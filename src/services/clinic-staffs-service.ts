import ClinicStaff from "../models/clinic-staff";
import ClinicStaffRepository, { ClinicStaffAttributes } from "../respository/clinic-staff-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import AuthService from "./auth-service";
import { Role } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

class ClinicStaffsService {
  public static async create(clinicStaffsAttributes: ClinicStaffAttributes): Promise<ClinicStaff> {
    const clinicStaff = await this.createClinicStaffs(clinicStaffsAttributes);
    await this.setPermissions(clinicStaff);
    return clinicStaff;
  }

  private static async setPermissions(clinicStaff: ClinicStaff):Promise<void> {
    try {
      await AuthService.setPermissions(clinicStaff.authId, Role.CLINIC_STAFF, clinicStaff.clinicId);
    } catch (e) {
      await this.deleteAppendErrorMessagePrefix(clinicStaff,
        "Error deleting clinicStaff after failure to setPermissions on AuthService. " +
          `ClinicStaff: ${clinicStaff.id}`);
      throw e;
    }
  }

  private static async createClinicStaffs(clinicStaffsAttributes: ClinicStaffAttributes): Promise<ClinicStaff> {
    try {
      return await ClinicStaffRepository.create(clinicStaffsAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  private static async deleteAppendErrorMessagePrefix(clinicStaff: ClinicStaff,
    errorMessagePrefix = ""): Promise<void> {
    try {
      return await clinicStaff.destroy();
    } catch (error) {
      const errorMessage = `${errorMessagePrefix} ${error.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}

export default ClinicStaffsService;
