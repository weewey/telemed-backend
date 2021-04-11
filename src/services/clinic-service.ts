import Clinic from "../models/clinic";

class ClinicService {

    public static async getClinicById(id: string): Promise<Clinic | null> {
        return await Clinic.findByPk(id)
    }

    public static async getClinics(): Promise<Clinic[]> {
        return await Clinic.findAll();
    }

}

export default ClinicService;