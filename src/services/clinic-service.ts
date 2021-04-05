import Clinic from "../models/clinic";

class ClinicService {

    async getClinicById(id: string): Promise<Clinic | null> {
        return await Clinic.findByPk(id)
    }

}

export default new ClinicService();