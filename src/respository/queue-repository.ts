import Queue, {QueueAttributes} from "../models/queue";
import {ForeignKeyConstraintError} from "sequelize";
import RepositoryError from "../errors/repository-error";
import {Errors} from "../errors/error-mappings";
import QueueStatus from "../queue_status";

class QueueRepository {

    public static async create(queueAttr: QueueAttributes): Promise<Queue> {
        let queue: Queue;
        try {
            queue = await Queue.create(queueAttr)
        } catch (error) {
            if (error instanceof ForeignKeyConstraintError) {
                throw new RepositoryError(Errors.CLINIC_NOT_FOUND.code);
            }
            throw error;
        }
        return queue;
    }

    public static async getByClinicIdAndStatus(clinicId: number, status?: QueueStatus): Promise<Queue[]> {
        return Queue.findAll({
            where: {
                clinicId, ...(status && { status })
            },
        })
    }
}

export default QueueRepository;