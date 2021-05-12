import Patient from "../models/patient";
import PatientRepository, { PatientAttributes } from "../respository/patient-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";

class PatientService {
  public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
    try {
      return await PatientRepository.create(patientAttributes);
    } catch (error) {
      throw mapRepositoryErrors(error);
    }
  }
}

export default PatientService;
