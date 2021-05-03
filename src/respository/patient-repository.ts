import Patient from "../models/patient";
import { PatientAttributes } from "../services/patient-service";
import RepositoryError from "../errors/repository-error";
import { UniqueConstraintError } from "sequelize";
import { Logger } from "../logger";
import { Errors } from "../errors/error-mappings";
class PatientRepository {

    public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
        let patient: Patient;
        try {
            patient = await Patient.create(patientAttributes)
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                const field = error.errors[0].path;
                Logger.error(`Unable to create patient as ${field} already exists`)
                throw new RepositoryError(Errors.UNABLE_TO_CREATE_PATIENT_AS_FIELD_EXISTS.code);
            }
            throw error;
        }
        return patient;
    }
}

export default PatientRepository;