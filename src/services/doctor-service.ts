import Doctor from "../models/doctor";
import DoctorRepository, { DoctorAttributes } from "../respository/doctor-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import AuthService from "./auth-service";
import { Role } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

class DoctorService {
  public static async create(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    const doctor = await this.createDoctor(doctorAttributes);
    await this.setPermissions(doctor);
    return doctor;
  }

  private static async createDoctor(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    try {
      return await DoctorRepository.create(doctorAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  private static async setPermissions(doctor: Doctor): Promise<void> {
    try {
      await AuthService.setPermissions(doctor.authId, Role.Doctor, doctor.clinicId);
    } catch (e) {
      await this.deleteAppendErrorMessagePrefix(doctor,
        `Error deleting doctor after failure to setPermissions on AuthService. DoctorId: ${doctor.id}`);
      throw e;
    }
  }

  private static async deleteAppendErrorMessagePrefix(doctor: Doctor, errorMessagePrefix = ""): Promise<void> {
    try {
      return await doctor.destroy();
    } catch (error) {
      const errorMessage = `${errorMessagePrefix} ${error.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}

export default DoctorService;
