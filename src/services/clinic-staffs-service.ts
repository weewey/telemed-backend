import ClinicStaffs from "../models/clinic-staffs";
import ClinicStaffsRepository, { ClinicStaffsAttributes } from "../respository/clinic-staffs-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";

class ClinicStaffsService {
  public static async create(clinicStaffsAttributes: ClinicStaffsAttributes): Promise<ClinicStaffs> {
    return this.createClinicStaffs(clinicStaffsAttributes);
  }

  private static async createClinicStaffs(clinicStaffsAttributes: ClinicStaffsAttributes): Promise<ClinicStaffs> {
    try {
      return await ClinicStaffsRepository.create(clinicStaffsAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }
}

export default ClinicStaffsService;
