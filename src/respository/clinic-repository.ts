import { BaseError, UniqueConstraintError, ValidationError } from "sequelize";
import { Errors } from "../errors/error-mappings";
import RepositoryError from "../errors/repository-error";
import { Logger } from "../logger";
import Clinic, { ClinicAttributes } from "../models/clinic";
import { mapSequelizeErrorToErrorMessage } from "../utils/helpers";

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
      const message = mapSequelizeErrorToErrorMessage("Unable to create clinic", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
    }
    if (error instanceof ValidationError) {
      const message = mapSequelizeErrorToErrorMessage("Unable to create clinic", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
    }
    throw error;
  }
}

export default ClinicRepository;
