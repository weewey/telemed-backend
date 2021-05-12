import Queue, { QueueAttributes, QueueAttributesWithId } from "../models/queue";
import { ForeignKeyConstraintError } from "sequelize";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import QueueStatus from "../queue_status";
import NotFoundError from "../errors/not-found-error";
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

  public static async getByClinicIdAndStatus(clinicId: number, status?: QueueStatus): Promise<Queue[]> {
    return Queue.findAll({
      where: {
        clinicId, ...(status && { status }),
      },
    });
  }

  public static async update(queueModelAttributes: Partial<QueueAttributesWithId>): Promise<void> {
    const { id, ...updateAttributes } = queueModelAttributes;
    const queue = await Queue.findByPk(id);
    if (!queue) {
      throw new NotFoundError(Errors.QUEUE_NOT_FOUND.code, Errors.QUEUE_NOT_FOUND.message);
    }

    await queue.update(updateAttributes);
  }
}

export default QueueRepository;
