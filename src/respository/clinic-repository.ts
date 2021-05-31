import Clinic, { ClinicAttributes } from "../models/clinic";
import { BaseError, UniqueConstraintError, ValidationError } from "sequelize";
import { Logger } from "../logger";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorsToErrorFieldsAndMessage } from "../utils/helpers";

class ClinicRepository {
  public static async create(clinicAttributes: ClinicAttributes): Promise<Clinic> {
    let clinic: Clinic;
    try {
      clinic = await Clinic.create(clinicAttributes);
    } catch (error) {
      throw this.handleCreateClinicError(error);
    }
    return clinic;
  }

  private static handleCreateClinicError(error: BaseError): RepositoryError {
    if (error instanceof UniqueConstraintError) {
      const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors);
      const message = `Unable to create clinic. Fields: [${errorFields}], message: [${errorMessage}]`;
      Logger.error(message);
      throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
    }
    if (error instanceof ValidationError) {
      const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors);
      const message = `Unable to create clinic. Fields: [ ${errorFields}], message: [ ${errorMessage}]`;
      Logger.error(message);
      throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
    }
    throw error;
  }
}

export default ClinicRepository;
