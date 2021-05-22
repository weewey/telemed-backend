import StaffRepository, { StaffAttributes } from "../../src/respository/staff-repository";
import Staff from "../../src/models/staff";
import StaffService from "../../src/services/staff-service";
import { v4 as generateUUID } from "uuid";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import NotFoundError from "../../src/errors/not-found-error";

describe("Staff Service", () => {
  const getStaffAttrs = (overrideAttrs?: Partial<StaffAttributes>): StaffAttributes => {
    return {
      authId: generateUUID(),
      email: `${generateUUID()}@gmail.com`,
      firstName: "first name",
      lastName: "last",
      mobileNumber: generateUUID(),
      ...overrideAttrs,
    };
  };

  it("should call StaffRepository.create with the right params", async () => {
    const spy = jest.spyOn(StaffRepository, "create").mockResolvedValue({} as Staff);
    const staffAttrs = getStaffAttrs();
    await StaffService.create(staffAttrs);
    expect(spy).toBeCalledWith(staffAttrs);
  });

  describe("when StaffRepository errors", () => {
    it("should throw BusinessError when the error is due to uniqueness/validation", async () => {
      jest.spyOn(StaffRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "message"),
      );
      const staffAttrs = getStaffAttrs();
      await expect(StaffService.create(staffAttrs)).rejects.toThrowError(BusinessError);
    });

    it("should throw NotFoundError when the error is due to associated entity not found", async () => {
      jest.spyOn(StaffRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.ENTITY_NOT_FOUND.code, "not found"),
      );
      const staffAttrs = getStaffAttrs();
      await expect(StaffService.create(staffAttrs)).rejects.toThrowError(NotFoundError);
    });

    it("should throw TechnicalError when it encounters other errors", async () => {
      jest.spyOn(StaffRepository, "create").mockRejectedValue(
        new RepositoryError("other error code", "message"),
      );
      const staffAttrs = getStaffAttrs();
      await expect(StaffService.create(staffAttrs)).rejects.toThrowError(TechnicalError);
    });
  });
});
