import ClinicStaffsRepository, { ClinicStaffsAttributes } from "../../src/respository/clinic-staffs-repository";
import ClinicStaffs from "../../src/models/clinic-staffs";
import ClinicStaffsService from "../../src/services/clinic-staffs-service";
import { v4 as generateUUID } from "uuid";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import NotFoundError from "../../src/errors/not-found-error";
import AuthService from "../../src/services/auth-service";
import { Role } from "../../src/clients/auth-client";

describe("ClinicStaffs Service", () => {
  const getClinicStaffAttrs = (overrideAttrs?: Partial<ClinicStaffsAttributes>): ClinicStaffsAttributes => {
    return {
      authId: generateUUID(),
      email: `${generateUUID()}@gmail.com`,
      firstName: "first name",
      lastName: "last",
      mobileNumber: generateUUID(),
      ...overrideAttrs,
    };
  };

  it("should call ClinicStaffsRepository.create with the right params", async () => {
    const clinicStaffsAttrs = getClinicStaffAttrs();
    const spy = jest.spyOn(ClinicStaffsRepository, "create").mockResolvedValue(
      { authId: clinicStaffsAttrs.authId } as ClinicStaffs,
    );
    jest.spyOn(AuthService, "setPermissions").mockResolvedValue(undefined);
    await ClinicStaffsService.create(clinicStaffsAttrs);
    expect(spy).toBeCalledWith(clinicStaffsAttrs);
  });

  it("should call AuthService.setPermissions with the right params", async () => {
    const clinicStaffAttrs = getClinicStaffAttrs();
    jest.spyOn(ClinicStaffsRepository, "create").mockResolvedValue(
      { authId: clinicStaffAttrs.authId } as ClinicStaffs,
    );
    const spy = jest.spyOn(AuthService, "setPermissions").mockResolvedValue(undefined);
    await ClinicStaffsService.create(clinicStaffAttrs);
    expect(spy).toBeCalledWith(clinicStaffAttrs.authId, Role.ClinicStaff, undefined);
  });

  describe("when ClinicStaffsRepository errors", () => {
    it("should throw BusinessError when the error is due to uniqueness/validation", async () => {
      jest.spyOn(ClinicStaffsRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "message"),
      );
      const clinicStaffsAttrs = getClinicStaffAttrs();
      await expect(ClinicStaffsService.create(clinicStaffsAttrs)).rejects.toThrowError(BusinessError);
    });

    it("should throw NotFoundError when the error is due to associated entity not found", async () => {
      jest.spyOn(ClinicStaffsRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.ENTITY_NOT_FOUND.code, "not found"),
      );
      const clinicStaffsAttrs = getClinicStaffAttrs();
      await expect(ClinicStaffsService.create(clinicStaffsAttrs)).rejects.toThrowError(NotFoundError);
    });

    it("should throw TechnicalError when it encounters other errors", async () => {
      jest.spyOn(ClinicStaffsRepository, "create").mockRejectedValue(
        new RepositoryError("other error code", "message"),
      );
      const clinicStaffsAttrs = getClinicStaffAttrs();
      await expect(ClinicStaffsService.create(clinicStaffsAttrs)).rejects.toThrowError(TechnicalError);
    });
  });

  describe("when AuthService.setPermissions errors", () => {
    const clinicStaffAttrs = getClinicStaffAttrs();
    const mockClinicStaff = { authId: clinicStaffAttrs.authId,
      id: 1,
      destroy: () => {} } as ClinicStaffs;

    beforeEach(() => {
      jest.spyOn(ClinicStaffsRepository, "create").mockResolvedValue(mockClinicStaff);
      jest.spyOn(AuthService, "setPermissions").mockRejectedValue(new Error("test"));
    });

    it("should call clinicStaff.destroy", async () => {
      const spy = jest.spyOn(mockClinicStaff, "destroy")
        .mockResolvedValue(undefined);
      await expect(ClinicStaffsService.create(clinicStaffAttrs)).rejects.toThrowError(Error);
      expect(spy).toBeCalled();
    });

    describe("when destroy clinicStaff errors", () => {
      it("should throw TechnicalError", async () => {
        jest.spyOn(mockClinicStaff, "destroy")
          .mockRejectedValue(new TechnicalError("test"));
        await expect(ClinicStaffsService.create(clinicStaffAttrs))
          .rejects
          .toEqual(new TechnicalError("Error deleting clinicStaff after failure to setPermissions " +
              "on AuthService. ClinicStaff: 1 test"));
      });
    });
  });
});
