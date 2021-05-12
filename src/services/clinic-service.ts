import Clinic from "../models/clinic";

class ClinicService {
  public static async getClinicById(id: string): Promise<Clinic | null> {
    return Clinic.findByPk(id);
  }

  public static async getClinics(): Promise<Clinic[]> {
    return Clinic.findAll();
  }
}

export default ClinicService;
