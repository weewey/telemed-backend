import BusinessError from "../errors/business-error";
import { Errors } from "../errors/error-mappings";
import Queue, { QueueAttributes, QueueAttributesWithId } from "../models/queue";
import QueueStatus from "../queue_status";
import QueueRepository from "../respository/queue-repository";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import NotFoundError from "../errors/not-found-error";

class QueueService {
  public static async create(queueAttr: QueueAttributes): Promise<Queue> {
    if (queueAttr.status === QueueStatus.CLOSED) {
      throw new BusinessError(Errors.QUEUE_CREATION_NO_CLOSED_STATUS.code,
        Errors.QUEUE_CREATION_NO_CLOSED_STATUS.message);
    }

    await this.validateNoExistingActiveQueues(queueAttr);

    try {
      return await QueueRepository.create(queueAttr);
    } catch (error) {
      Logger.error(`Error creating queue. ErrorMessage: ${error.message}, Queue attributes: `, queueAttr);
      throw mapRepositoryErrors(error);
    }
  }

  private static async validateNoExistingActiveQueues(queueAttr: QueueAttributes): Promise<void> {
    const existingActiveQueues = await QueueService.getQueuesByClinicAndStatus(queueAttr.clinicId, QueueStatus.ACTIVE);
    if (existingActiveQueues.length > 0) {
      Logger.error("Error creating queue. ErrorMessage: existing active " +
          "queue exists for clinic, Queue attributes: ", queueAttr);
      throw new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code,
        Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message);
    }
  }

  public static async getQueuesByClinicAndStatus(clinicId: number, queueStatus?: QueueStatus): Promise<Queue[]> {
    try {
      return await QueueRepository.getByClinicIdAndStatus(clinicId, queueStatus);
    } catch (error) {
      Logger.error(`Error creating queue. Unable to getQueuesByClinicAndStatus. ErrorMessage: ${error.message}`);
      throw new TechnicalError(Errors.UNABLE_TO_CREATE_QUEUE.message, Errors.UNABLE_TO_CREATE_QUEUE.code);
    }
  }

  public static async update(queueModelAttributes: Partial<QueueAttributesWithId>): Promise<void> {
    const { status } = queueModelAttributes;

    await QueueRepository.update(
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

  public static async fetchAllQueues(): Promise<Queue[]> {
    try {
      return await QueueRepository.findAll();
    } catch (e) {
      throw new TechnicalError(`Failed to fetch all queues: ${e.message}`);
    }
  }
}

export default QueueService;
