import Patient from "../models/patient";
import RepositoryError from "../errors/repository-error";
import { UniqueConstraintError, ValidationError } from "sequelize";
import { Logger } from "../logger";
import { Errors } from "../errors/error-mappings";

export interface PatientAttributes {
  firstName: string;
  lastName: string;
  email: string;
  authId: string;
  mobileNumber: string;
  dateOfBirth: string,
}

class PatientRepository {
  public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
    let patient: Patient;
    try {
      patient = await Patient.create(patientAttributes);
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const field = error.errors[0].path;
        const errorMessage = `Unable to create patient as ${field} already exists`;
        Logger.error(errorMessage);
        throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, errorMessage);
      }
      if (error instanceof ValidationError) {
        const field = error.errors[0].path;
        const errorMessage = `Unable to create patient. Validation error encountered for [${field}]`;
        Logger.error(errorMessage);
        throw new RepositoryError(Errors.VALIDATION_ERROR.code, errorMessage);
      }
      throw error;
    }
    return patient;
  }

  public static async getById(patientId: number): Promise<Patient|null> {
    return Patient.findByPk(patientId);
  }
}

export default PatientRepository;
