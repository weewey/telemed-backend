import Clinic from "../models/clinic";

class QueueService {

    async getClinicById(id: string): Promise<Clinic | null> {
        return await Clinic.findByPk(id)
    }

    async getClinics(): Promise<Clinic[]> {
        return await Clinic.findAll();
    }

    async createQueue(clinicId: string): Promise<null> {
        // how to create queue in the db
        return null
    }

    async changeQueueStatus(queueId: string, status: string): Promise<null> {
        return null
    }

    async joinQueue(queueId: string, patientId: string): Promise<null> {
        return null
    }

}

export default new QueueService();