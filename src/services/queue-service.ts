import BusinessError from "../errors/business-error";
import { Errors } from "../errors/error-mappings";
import Queue, { QueueAttributes, QueueAttributesWithId } from "../models/queue";
import QueueStatus from "../queue_status";
import QueueRepository, { FindAllQueueAttributes } from "../respository/queue-repository";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import NotFoundError from "../errors/not-found-error";
import TicketRepository from "../respository/ticket-repository";
import TicketStatus from "../ticket_status";
import { sequelize } from "../utils/db-connection";
import DoctorService from "./doctor-service";
import ZoomService from "./zoom-service";
import TicketTypes from "../ticket_types";
// eslint-disable-next-line import/no-cycle
import TicketService from "./ticket-service";
import { ZoomMeeting } from "../clients/zoom-client";
import Ticket from "../models/ticket";

class QueueService {
  public static async create(queueAttr: QueueAttributes): Promise<Queue> {
    if (queueAttr.status === QueueStatus.CLOSED) {
      throw new BusinessError(Errors.QUEUE_CREATION_NO_CLOSED_STATUS.code,
        Errors.QUEUE_CREATION_NO_CLOSED_STATUS.message);
    }

    await this.validateNoOtherClinicActiveQueues(queueAttr.clinicId);

    try {
      return await QueueRepository.create(queueAttr);
    } catch (error) {
      Logger.error(`Error creating queue. ErrorMessage: ${error.message}, Queue attributes: `, queueAttr);
      throw mapRepositoryErrors(error);
    }
  }

  public static async nextTicket(doctorId: number, queueId: number): Promise<Queue> {
    const doctor = await DoctorService.get(doctorId);

    const queue = await QueueRepository.getById(queueId);
    if (!queue) {
      throw new NotFoundError(Errors.QUEUE_NOT_FOUND.code, Errors.QUEUE_NOT_FOUND.message);
    }

    this.validateQueueIsActive(queue);
    const { currentTicketId, pendingTicketIdsOrder } = queue;
    this.validateNoCurrentTicketId(currentTicketId);

    const nextTicketId = pendingTicketIdsOrder[0];
    if (!nextTicketId) {
      return queue;
    }

    const ticket = await TicketService.get(nextTicketId);

    if (ticket.type === TicketTypes.TELEMED) {
      const zoomMeeting = await ZoomService.createMeeting(doctor.email);
      return this.setQueueNextTicket(queue, ticket, pendingTicketIdsOrder, zoomMeeting);
    }

    return this.setQueueNextTicket(queue, ticket, pendingTicketIdsOrder);
  }

  private static validateNoCurrentTicketId(currentTicketId: number): void {
    if (currentTicketId) {
      throw new BusinessError(
        Errors.UNABLE_TO_SET_NEXT_TICKET_AS_QUEUE_CURRENTLY_HAS_A_CURRENT_TICKET.code,
        Errors.UNABLE_TO_SET_NEXT_TICKET_AS_QUEUE_CURRENTLY_HAS_A_CURRENT_TICKET.message,
      );
    }
  }

  private static validateQueueIsActive(queue: Queue): void {
    if (queue.status !== QueueStatus.ACTIVE) {
      throw new BusinessError(Errors.QUEUE_IS_NOT_ACTIVE.code, Errors.QUEUE_IS_NOT_ACTIVE.message);
    }
  }

  private static async setQueueNextTicket(
    queue: Queue,
    nextTicket: Ticket,
    pendingTicketIdsOrder: Array<number>,
    zoomMeeting?: ZoomMeeting,
  ): Promise<Queue> {
    const updateTicketAttrs = this.getUpdateTicketAttrs(nextTicket, zoomMeeting);
    try {
      return await sequelize.transaction(
        async (transaction) => {
          const updatedQueue = await queue.update({
            currentTicketId: nextTicket.id,
            pendingTicketIdsOrder: pendingTicketIdsOrder.splice(1),
          }, { transaction });

          await TicketRepository.update(updateTicketAttrs, transaction);

          return updatedQueue.reload({ "include": { model: Ticket, as: "currentTicket" }, transaction });
        },
      );
    } catch (e) {
      Logger.error(`Error when setting next ticket on queue: ${e.message}`);
      throw e;
    }
  }

  private static getUpdateTicketAttrs(nextTicket: Ticket, zoomMeeting: ZoomMeeting | undefined) {
    const updateTicketAttrs = {
      id: nextTicket.id,
      status: TicketStatus.SERVING,
    };
    if (nextTicket.type === TicketTypes.TELEMED && zoomMeeting) {
      return { ...updateTicketAttrs,
        ...{
          zoomMeetingId: zoomMeeting.id,
          zoomStartMeetingUrl: zoomMeeting.start_url,
          zoomJoinMeetingUrl: zoomMeeting.join_url,
        } };
    }
    return updateTicketAttrs;
  }

  private static async validateNoOtherClinicActiveQueues(clinicId: number, queueId?: number): Promise<void> {
    let existingActiveQueues = await QueueService.getQueuesByClinicAndStatus(clinicId, QueueStatus.ACTIVE);
    if (queueId) {
      existingActiveQueues = existingActiveQueues.filter((element) =>
        element.id !== queueId);
    }
    if (existingActiveQueues.length > 0) {
      Logger.error("Existing active queue exists for clinic, Clinic ID: ", clinicId);
      throw new BusinessError(Errors.UNABLE_TO_CREATE_OR_UPDATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code,
        Errors.UNABLE_TO_CREATE_OR_UPDATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message);
    }
  }

  public static async getQueuesByClinicAndStatus(clinicId: number, queueStatus: QueueStatus): Promise<Queue[]> {
    try {
      return await QueueRepository.getByClinicIdAndStatus(clinicId, queueStatus);
    } catch (error) {
      Logger.error(`Unable to getQueuesByClinicAndStatus. ErrorMessage: ${error.message}`);
      throw new TechnicalError(Errors.UNABLE_TO_CREATE_QUEUE.message, Errors.UNABLE_TO_CREATE_QUEUE.code);
    }
  }

  public static async update(queueModelAttributes: Partial<QueueAttributesWithId>): Promise<Queue> {
    const { status } = queueModelAttributes;

    if (status === QueueStatus.ACTIVE) {
      await this.validateNoOtherClinicActiveQueues(queueModelAttributes.clinicId!, queueModelAttributes.id);
    }

    return QueueRepository.update(
      { ...queueModelAttributes,
        ...((status === QueueStatus.ACTIVE) && { startedAt: new Date(), closedAt: null }),
        ...((status === QueueStatus.CLOSED) && { closedAt: new Date() }),
        ...((status === QueueStatus.INACTIVE) && { closedAt: null }) },
    );
  }

  public static async getQueueById(queueId: number): Promise<Queue> {
    try {
      const queue = await QueueRepository.getById(queueId);
      if (queue === null) {
        throw new NotFoundError(Errors.QUEUE_NOT_FOUND.code, Errors.QUEUE_NOT_FOUND.message);
      }
      return queue;
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw e;
      }
      throw new TechnicalError(e.message);
    }
  }

  public static async fetchAllQueues(findAllQueuesAttributes?: FindAllQueueAttributes): Promise<Queue[]> {
    try {
      return await QueueRepository.findAll(findAllQueuesAttributes);
    } catch (e) {
      throw new TechnicalError(`Failed to fetch all queues: ${e.message}`);
    }
  }
}

export default QueueService;
