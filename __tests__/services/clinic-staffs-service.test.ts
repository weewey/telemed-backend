import ClinicStaffsRepository, { ClinicStaffsAttributes } from "../../src/respository/clinic-staffs-repository";
import ClinicStaffs from "../../src/models/clinic-staffs";
import ClinicStaffsService from "../../src/services/clinic-staffs-service";
import { v4 as generateUUID } from "uuid";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import NotFoundError from "../../src/errors/not-found-error";

describe("ClinicStaffs Service", () => {
  const getClinicStaffsAttrs = (overrideAttrs?: Partial<ClinicStaffsAttributes>): ClinicStaffsAttributes => {
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
    const spy = jest.spyOn(ClinicStaffsRepository, "create").mockResolvedValue({} as ClinicStaffs);
    const clinicStaffsAttrs = getClinicStaffsAttrs();
    await ClinicStaffsService.create(clinicStaffsAttrs);
    expect(spy).toBeCalledWith(clinicStaffsAttrs);
  });

  describe("when ClinicStaffsRepository errors", () => {
    it("should throw BusinessError when the error is due to uniqueness/validation", async () => {
      jest.spyOn(ClinicStaffsRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "message"),
      );
      const clinicStaffsAttrs = getClinicStaffsAttrs();
      await expect(ClinicStaffsService.create(clinicStaffsAttrs)).rejects.toThrowError(BusinessError);
    });

    it("should throw NotFoundError when the error is due to associated entity not found", async () => {
      jest.spyOn(ClinicStaffsRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.ENTITY_NOT_FOUND.code, "not found"),
      );
      const clinicStaffsAttrs = getClinicStaffsAttrs();
      await expect(ClinicStaffsService.create(clinicStaffsAttrs)).rejects.toThrowError(NotFoundError);
    });

    it("should throw TechnicalError when it encounters other errors", async () => {
      jest.spyOn(ClinicStaffsRepository, "create").mockRejectedValue(
        new RepositoryError("other error code", "message"),
      );
      const clinicStaffsAttrs = getClinicStaffsAttrs();
      await expect(ClinicStaffsService.create(clinicStaffsAttrs)).rejects.toThrowError(TechnicalError);
    });
  });
});
