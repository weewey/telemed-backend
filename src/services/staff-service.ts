import Staff from "../models/staff";
import StaffRepository, { StaffAttributes } from "../respository/staff-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";

class StaffService {
  public static async create(staffAttributes: StaffAttributes): Promise<Staff> {
    return this.createStaff(staffAttributes);
  }

  private static async createStaff(staffAttributes: StaffAttributes): Promise<Staff> {
    try {
      return await StaffRepository.create(staffAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }
}

export default StaffService;
