import Admin from "../models/admins";
import { BaseError, ForeignKeyConstraintError, UniqueConstraintError, ValidationError } from "sequelize";
import { mapSequelizeErrorToErrorMessage } from "../utils/helpers";
import { Errors } from "../errors/error-mappings";
import RepositoryError from "../errors/repository-error";
import { Logger } from "../logger";

export interface AdminAttributes {
  firstName: string,
  lastName: string,
  email: string,
  authId: string,
  mobileNumber: string,
}

class AdminRepository {
  public static async create(adminAttributes: AdminAttributes): Promise<Admin> {
    let admin: Admin;
    try {
      admin = await Admin.create(adminAttributes);
    } catch (error) {
      throw this.handleCreateAdminError(error);
    }
    return admin;
  }

  private static handleCreateAdminError(error: BaseError): RepositoryError {
    if (error instanceof UniqueConstraintError) {
      const message = mapSequelizeErrorToErrorMessage("Unable to create admin", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
    }
    if (error instanceof ValidationError) {
      const message = mapSequelizeErrorToErrorMessage("Unable to create admin", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
    }
    if (error instanceof ForeignKeyConstraintError) {
      const message = `Unable to create admin ${error.fields} ${error.message}}`;
      Logger.error(message);
      throw new RepositoryError(Errors.ENTITY_NOT_FOUND.code, message);
    }
    throw error;
  }
}

export default AdminRepository;
