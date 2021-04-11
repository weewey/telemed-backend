import Queue, { QueueAttributes } from "../models/queue";
import QueueRepository from "../respository/queue_repository";
// import { ForeignKeyConstraintError } from "sequelize";
class QueueService {

    public static async create(queueAttr: QueueAttributes): Promise<Queue> {
        // TODO: add trycatch and Business error wrapper
        return QueueRepository.create(queueAttr);
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