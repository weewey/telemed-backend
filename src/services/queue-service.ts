import BusinessError from "../errors/business-error";
import { Errors } from "../errors/error-mappings";
import Queue, { QueueAttributes } from "../models/queue";
import QueueStatus from "../queue_status";
import QueueRepository from "../respository/queue-repository";
import { Logger }from "../logger";

class QueueService {

    public static async create(queueAttr: QueueAttributes): Promise<Queue> {

        if (queueAttr.status === QueueStatus.CLOSED) {
            throw new BusinessError(Errors.QUEUE_CREATION_NO_CLOSED_STATUS.message, Errors.QUEUE_CREATION_NO_CLOSED_STATUS.code)
        }

        // Clinic
        //     -> Active/Inactive
        // —  There is no existing inactive / active queue for the clinic

        let queue;
        try {
            queue = await QueueRepository.create(queueAttr);
        } catch (error) {
            Logger.error(`Error creating queue. ErrorMessage: ${error.message}, Queue attributes: `, queueAttr)
            if (error.message === Errors.CLINIC_NOT_FOUND.code) {
                throw new BusinessError(Errors.CLINIC_NOT_FOUND.message, Errors.CLINIC_NOT_FOUND.code)
            }
            throw new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE.message, Errors.UNABLE_TO_CREATE_QUEUE.code)

        }
        return queue;
    }

    // async getClinicById(id: string): Promise<Clinic | null> {
    //     return await Clinic.findByPk(id)
    // }
    //
    // async getClinics(): Promise<Clinic[]> {
    //     return await Clinic.findAll();
    // }


    public static async changeQueueStatus(queueId: string, status: string): Promise<null> {
        return null
    }

   public static async joinQueue(queueId: string, patientId: string): Promise<null> {
        return null
    }

}

export default QueueService;