import Queue, { QueueAttributes, QueueAttributesWithId } from "../models/queue";
import { ForeignKeyConstraintError } from "sequelize";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import QueueStatus from "../queue_status";
import NotFoundError from "../errors/not-found-error";

export interface FindAllQueueAttributes {
  clinicId: number,
  status?: string
}

class QueueRepository {
  public static async create(queueAttr: QueueAttributes): Promise<Queue> {
    let queue: Queue;
    try {
      queue = await Queue.create(queueAttr);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        throw new RepositoryError(Errors.ENTITY_NOT_FOUND.code,
          "Queue cannot be created as associated Clinic Id does not exist");
      }
      throw error;
    }
    return queue;
  }

  public static async findAll(findAllQueueAttributes?: FindAllQueueAttributes): Promise<Queue[]> {
    if (findAllQueueAttributes) {
      return Queue.findAll({ where: { ...findAllQueueAttributes } });
    }

    return Queue.findAll();
  }

  public static async getByClinicIdAndStatus(clinicId: number, status: QueueStatus): Promise<Queue[]> {
    return Queue.findAll({
      where: {
        clinicId,
        ...(status && { status }),
      },
    });
  }

  public static async getById(queueId: number): Promise<Queue|null> {
    return Queue.findByPk(queueId);
  }

  public static async update(queueModelAttributes: Partial<QueueAttributesWithId>): Promise<Queue> {
    const { id, ...updateAttributes } = queueModelAttributes;
    const queue = await Queue.findByPk(id);
    if (!queue) {
      throw new NotFoundError(Errors.QUEUE_NOT_FOUND.code, Errors.QUEUE_NOT_FOUND.message);
    }

    return queue.update(updateAttributes);
  }
}

export default QueueRepository;
