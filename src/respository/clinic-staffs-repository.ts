import ClinicStaffs from "../models/clinic-staffs";
import { BaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { Logger } from "../logger";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorToErrorMessage } from "../utils/helpers";

export interface ClinicStaffsAttributes {
  firstName: string,
  lastName: string,
  email: string,
  authId: string,
  mobileNumber: string,
  clinicId?: number,
}

class ClinicStaffsRepository {
  public static async create(clinicStaffsAttributes: ClinicStaffsAttributes): Promise<ClinicStaffs> {
    let staff: ClinicStaffs;
    try {
      staff = await ClinicStaffs.create(clinicStaffsAttributes);
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

export default ClinicStaffsRepository;
