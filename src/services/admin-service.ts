import AdminRepository, { AdminAttributes } from "../respository/admin-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import AuthService from "./auth-service";
import { Role } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";
import Admin from "../models/admin";

class AdminService {
  public static async create(adminAttributes: AdminAttributes): Promise<Admin> {
    const admin = await this.createAdmin(adminAttributes);
    await this.setPermissions(admin);
    return admin;
  }

  private static async createAdmin(adminAttributes: AdminAttributes): Promise<Admin> {
    try {
      return await AdminRepository.create(adminAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  private static async setPermissions(admin: Admin): Promise<void> {
    try {
      await AuthService.setPermissions(
        { authId: admin.authId,
          role: Role.ADMIN,
          adminId: admin.id },
      );
    } catch (e) {
      await this.deleteAppendErrorMessagePrefix(admin,
        `Error deleting admin after failure to setPermissions on AuthService. AdminId: ${admin.id}`);
      throw e;
    }
  }

  private static async deleteAppendErrorMessagePrefix(admin: Admin, errorMessagePrefix = ""): Promise<void> {
    try {
      return await admin.destroy();
    } catch (error) {
      const errorMessage = `${errorMessagePrefix} ${error.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}

export default AdminService;
