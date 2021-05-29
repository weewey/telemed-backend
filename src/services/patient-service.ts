import Patient from "../models/patient";
import PatientRepository, { PatientAttributes } from "../respository/patient-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";
import AuthService from "./auth-service";
import { Role } from "../clients/auth-client";

class PatientService {
  public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
    const patient = await this.createInRepo(patientAttributes);
    await this.setPermissions(patient);
    return patient;
  }

  private static async createInRepo(patientAttributes: PatientAttributes): Promise<Patient> {
    try {
      return await PatientRepository.create(patientAttributes);
    } catch (error) {
      throw mapRepositoryErrors(error);
    }
  }

  private static async setPermissions(patient: Patient): Promise<void> {
    try {
      await AuthService.setPermissions(patient.authId, Role.Patient);
    } catch (e) {
      await this.deleteAppendErrorMessagePrefix(patient,
        `Error deleting patient after failure to setPermissions on AuthService. PatientId: ${patient.id}`);
      throw e;
    }
  }

  private static async deleteAppendErrorMessagePrefix(patient: Patient, errorMessagePrefix = ""): Promise<void> {
    try {
      return await patient.destroy();
    } catch (error) {
      const errorMessage = `${errorMessagePrefix} ${error.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}

export default PatientService;
