import BusinessError from "../errors/business-error";
import {Errors} from "../errors/error-mappings";
import Queue, {QueueAttributes, QueueAttributesWithId} from "../models/queue";
import QueueStatus from "../queue_status";
import QueueRepository from "../respository/queue-repository";
import {Logger} from "../logger";
import NotFoundError from "../errors/not-found-error";

class QueueService {

    public static async create(queueAttr: QueueAttributes): Promise<Queue> {
        let queue;

        if (queueAttr.status === QueueStatus.CLOSED) {
            throw new BusinessError(Errors.QUEUE_CREATION_NO_CLOSED_STATUS.message, Errors.QUEUE_CREATION_NO_CLOSED_STATUS.code)
        }

        await this.validateNoExistingActiveQueues(queueAttr);

        try {
            queue = await QueueRepository.create(queueAttr);
        } catch (error) {
            Logger.error(`Error creating queue. ErrorMessage: ${error.message}, Queue attributes: `, queueAttr)
            if (error.message === Errors.CLINIC_NOT_FOUND.code) {
                throw new NotFoundError(Errors.CLINIC_NOT_FOUND.message, Errors.CLINIC_NOT_FOUND.code)
            }
            throw new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE.message, Errors.UNABLE_TO_CREATE_QUEUE.code)
        }
        return queue;
    }

    private static async validateNoExistingActiveQueues(queueAttr: QueueAttributes) {
        const existingActiveQueues = await QueueService.getQueuesByClinicAndStatus(queueAttr.clinicId, QueueStatus.ACTIVE)
        if (existingActiveQueues.length > 0) {
            Logger.error(`Error creating queue. ErrorMessage: existing active queue exists for clinic, Queue attributes: `, queueAttr)
            throw new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message,
                Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code)
        }
    }

    public static async getQueuesByClinicAndStatus(clinicId: number, queueStatus?: QueueStatus): Promise<Queue[]> {
        return QueueRepository.getByClinicIdAndStatus(clinicId, queueStatus)
    }

    public static async update(queueModelAttributes: Partial<QueueAttributesWithId>): Promise<void> {
        await QueueRepository.update(queueModelAttributes);
    }

    // async getClinicById(id: string): Promise<Clinic | null> {
    //     return await Clinic.findByPk(id)
    // }
    //
    // async getClinics(): Promise<Clinic[]> {
    //     return await Clinic.findAll();
    // }

    public static async joinQueue(queueId: string, patientId: string): Promise<null> {
        return null
    }

}

export default QueueService;