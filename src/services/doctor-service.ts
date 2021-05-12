import Doctor from "../models/doctor";
import DoctorRepository, { DoctorAttributes } from "../respository/doctor-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";

class DoctorService {
  public static async create(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    return this.createDoctor(doctorAttributes);
  }

  private static async createDoctor(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    try {
      return await DoctorRepository.create(doctorAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }
}

export default DoctorService;
