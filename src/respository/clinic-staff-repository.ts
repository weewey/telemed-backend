import ClinicStaff from "../models/clinic-staff";
import { BaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { Logger } from "../logger";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorToErrorMessage } from "../utils/helpers";

export interface ClinicStaffAttributes {
  firstName: string,
  lastName: string,
  email: string,
  authId: string,
  mobileNumber: string,
  clinicId?: number,
  dateOfBirth: string,
}

class ClinicStaffRepository {
  public static async create(clinicStaffAttributes: ClinicStaffAttributes): Promise<ClinicStaff> {
    let staff: ClinicStaff;
    try {
      staff = await ClinicStaff.create(clinicStaffAttributes);
    } catch (error) {
      throw this.handleCreateStaffError(error);
    }
    return staff;
  }

  private static handleCreateStaffError(error: BaseError): RepositoryError {
    if (error instanceof UniqueConstraintError) {
      const message = mapSequelizeErrorToErrorMessage("Unable to create staff", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
    }
    if (error instanceof ValidationError) {
      const message = mapSequelizeErrorToErrorMessage("Unable to create staff", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
    }
    if (error instanceof ForeignKeyConstraintError) {
      const message = `Unable to create staff ${error.fields} ${error.message}}`;
      Logger.error(message);
      throw new RepositoryError(Errors.ENTITY_NOT_FOUND.code, message);
    }
    throw error;
  }
}

export default ClinicStaffRepository;
