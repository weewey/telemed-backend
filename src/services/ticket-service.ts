/* eslint-disable no-console */
import Ticket, { TicketAttributes, TicketAttributesWithId } from "../models/ticket";
import TicketRepository, { FindAllTicketAttributes } from "../respository/ticket-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import QueueService from "./queue-service";
import Queue from "../models/queue";
import QueueStatus from "../queue_status";
import BusinessError from "../errors/business-error";
import { Errors } from "../errors/error-mappings";
import TicketStatus from "../ticket_status";
import { sequelize } from "../utils/db-connection";
import { Transaction } from "sequelize";
import TechnicalError from "../errors/technical-error";
import { Logger } from "../logger";
import NotFoundError from "../errors/not-found-error";
import TicketTypes from "../ticket_types";

export type CreateTicketRequest = {
  patientId: number,
  queueId: number,
  clinicId: number,
  type: TicketTypes
};

class TicketService {
  public static async create(createTicketRequest: CreateTicketRequest): Promise<Ticket> {
    const queue = await QueueService.getQueueById(createTicketRequest.queueId);
    this.validateActiveQueue(queue);
    await this.validatePatientDoesNotHaveActiveTicket(createTicketRequest.patientId);
    const ticketAttr = this.generateTicketAttr(createTicketRequest, queue);
    const ticket = await this.createTicketAndUpdateQueueInTransaction(ticketAttr, queue);
    return ticket.reload({ include: Queue });
  }

  public static async findAll(findAllTicketAttributes: FindAllTicketAttributes): Promise<Ticket[]> {
    return TicketRepository.findAll(findAllTicketAttributes);
  }

  private static validateActiveQueue(queue: Queue): void {
    if (queue.status !== QueueStatus.ACTIVE) {
      throw new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE_AS_QUEUE_IS_INACTIVE.code,
        Errors.UNABLE_TO_CREATE_QUEUE_AS_QUEUE_IS_INACTIVE.message);
    }
  }

  private static generateTicketAttr(createTicketRequest: CreateTicketRequest,
    { latestGeneratedTicketDisplayNumber }: Queue): TicketAttributes {
    const ticketDisplayNumber = latestGeneratedTicketDisplayNumber + 1;
    return {
      displayNumber: ticketDisplayNumber,
      status: TicketStatus.WAITING,
      ...createTicketRequest,
    };
  }

  private static async createTicket(ticketAttributes: TicketAttributes,
    transaction: Transaction): Promise<Ticket> {
    try {
      return await TicketRepository.create(ticketAttributes, transaction);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  private static async updateQueueWithLatestTicketInfo(ticket: Ticket,
    queue: Queue, transaction: Transaction): Promise<void> {
    try {
      await queue.update({
        latestGeneratedTicketDisplayNumber: ticket.displayNumber,
        pendingTicketIdsOrder: queue.pendingTicketIdsOrder.concat(ticket.id),
      }, { transaction });
    } catch (e) {
      throw new TechnicalError(`Failed to update queueId: ${queue.id} ${e.message}`);
    }
  }

  private static async createTicketAndUpdateQueueInTransaction(
    ticketAttr: TicketAttributes, queue: Queue,
  ): Promise<Ticket> {
    try {
      return await sequelize.transaction(
        async (transaction) => {
          const ticket = await this.createTicket(ticketAttr, transaction);

          await this.updateQueueWithLatestTicketInfo(ticket, queue, transaction);

          return ticket;
        },
      );
    } catch (e) {
      Logger.error(`Error when creating queue ticket: ${e.message}`);
      throw e;
    }
  }

  private static async validatePatientDoesNotHaveActiveTicket(patientId: number) : Promise<void> {
    let tickets: Ticket [];
    try {
      tickets = await TicketRepository.findPatientActiveTickets(patientId);
    } catch (e) {
      const errorMessage = `Error when fetching patient's active tickets: ${e.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
    if (tickets.length > 0) {
      throw new BusinessError(
        Errors.UNABLE_TO_CREATE_TICKET_AS_PATIENT_ALREADY_HAS_AN_ACTIVE_TICKET.code,
        Errors.UNABLE_TO_CREATE_TICKET_AS_PATIENT_ALREADY_HAS_AN_ACTIVE_TICKET.message,
      );
    }
  }

  public static async update(ticketModelAttributes: Partial<TicketAttributesWithId>): Promise<void> {
    const { status } = ticketModelAttributes;

    await TicketRepository.update(
      { ...ticketModelAttributes,
        ...((status === TicketStatus.WAITING) && { updatedAt: new Date() }),
        ...((status === TicketStatus.CLOSED) && { updatedAt: new Date() }),
        ...((status === TicketStatus.SERVING) && { updatedAt: new Date() }) },
    );
  }

  public static async get(ticketId: number): Promise<Ticket> {
    const ticket = await TicketRepository.get(ticketId);
    if (ticket == null) {
      throw new NotFoundError(Errors.TICKET_NOT_FOUND.code, Errors.TICKET_NOT_FOUND.message);
    }
    return ticket;
  }
}

export default TicketService;
