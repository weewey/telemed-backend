import Clinic, { ClinicAttributes } from "../models/clinic";
import ClinicRepository from "../respository/clinic-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
class ClinicService {
  public static async create(clinicAttributes: ClinicAttributes): Promise<Clinic> {
    const clinic = await this.createClinic(clinicAttributes);
    return clinic;
  }

  private static async createClinic(clinicAttributes: ClinicAttributes): Promise<Clinic> {
    try {
      return await ClinicRepository.create(clinicAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  public static async getClinicById(id: string): Promise<Clinic | null> {
    return Clinic.findByPk(id);
  }

  public static async getClinics(): Promise<Clinic[]> {
    return Clinic.findAll();
  }
}

export default ClinicService;
