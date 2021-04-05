import Clinic from "../models/clinic";

class ClinicService {

    async getClinicById(id: string): Promise<Clinic | null> {
        return await Clinic.findByPk(id)
    }

    async getClinics(): Promise<Clinic[]> {
        return await Clinic.findAll();
    }

}

export default new ClinicService();