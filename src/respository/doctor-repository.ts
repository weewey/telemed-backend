import Doctor from "../models/doctor";
import { BaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { Logger } from "../logger";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorsToErrorFieldsAndMessage } from "../utils/helpers";

export interface DoctorAttributes {
  firstName: string,
  lastName: string,
  email: string,
  authId: string,
  mobileNumber: string,
  onDuty: boolean,
  queueId?: number,
  clinicId?: number,
}

class DoctorRepository {
  public static async create(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    let doctor: Doctor;
    try {
      doctor = await Doctor.create(doctorAttributes);
    } catch (error) {
      throw this.handleCreateDoctorError(error);
    }
    return doctor;
  }

  private static handleCreateDoctorError(error: BaseError): RepositoryError {
    if (error instanceof UniqueConstraintError) {
      const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors);
      const message = `Unable to create doctor. Fields: [${errorFields}], message: [${errorMessage}]`;
      Logger.error(message);
      throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
    }
    if (error instanceof ValidationError) {
      const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors);
      const message = `Unable to create doctor. Fields: [ ${errorFields}], message: [ ${errorMessage}]`;
      Logger.error(message);
      throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
    }
    if (error instanceof ForeignKeyConstraintError) {
      const message = `Unable to create doctor ${error.fields} ${error.message}}`;
      Logger.error(message);
      throw new RepositoryError(Errors.ENTITY_NOT_FOUND.code, message);
    }
    throw error;
  }
}

export default DoctorRepository;
