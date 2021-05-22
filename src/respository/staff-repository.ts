import Staff from "../models/staff";
import { BaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { Logger } from "../logger";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorsToErrorFieldsAndMessage } from "../utils/helpers";

export interface StaffAttributes {
  firstName: string,
  lastName: string,
  email: string,
  authId: string,
  mobileNumber: string,
  clinicId?: number,
}

class StaffRepository {
  public static async create(staffAttributes: StaffAttributes): Promise<Staff> {
    let staff: Staff;
    try {
      staff = await Staff.create(staffAttributes);
    } catch (error) {
      throw this.handleCreateStaffError(error);
    }
    return staff;
  }

  private static handleCreateStaffError(error: BaseError): RepositoryError {
    if (error instanceof UniqueConstraintError) {
      const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors);
      const message = `Unable to create staff. Fields: [${errorFields}], message: [${errorMessage}]`;
      Logger.error(message);
      throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
    }
    if (error instanceof ValidationError) {
      const { errorFields, errorMessage } = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors);
      const message = `Unable to create staff. Fields: [ ${errorFields}], message: [ ${errorMessage}]`;
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

export default StaffRepository;
