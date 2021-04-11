import Queue, {QueueAttributes} from "../models/queue";
import QueueRepository from "../respository/queue_repository";

class QueueService {

    public static async create(queueAttr: QueueAttributes): Promise<Queue> {
        return QueueRepository.create(queueAttr);
    }

    // async getClinicById(id: string): Promise<Clinic | null> {
    //     return await Clinic.findByPk(id)
    // }
    //
    // async getClinics(): Promise<Clinic[]> {
    //     return await Clinic.findAll();
    // }


    // async changeQueueStatus(queueId: string, status: string): Promise<null> {
    //     return null
    // }
    //
    // async joinQueue(queueId: string, patientId: string): Promise<null> {
    //     return null
    // }

}

export default QueueService;