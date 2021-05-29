import Patient from "../models/patient";
import PatientRepository, { PatientAttributes } from "../respository/patient-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

class PatientService {
  public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
    try {
      return await PatientRepository.create(patientAttributes);
    } catch (error) {
      throw mapRepositoryErrors(error);
    }
  }

  public static async delete(patient: Patient): Promise<void> {
    try {
      return await patient.destroy();
    } catch (error) {
      const errorMessage = `Error deleting patient record: ${patient.id}. ${error.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}

export default PatientService;
