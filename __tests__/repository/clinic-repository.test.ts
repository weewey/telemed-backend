import { UniqueConstraintError, ValidationError, ValidationErrorItem } from "sequelize";
import { Errors } from "../../src/errors/error-mappings";
import RepositoryError from "../../src/errors/repository-error";
import { Logger } from "../../src/logger";
import Clinic from "../../src/models/clinic";
import ClinicRepository from "../../src/respository/clinic-repository";
import { getClinicAttrs } from "../helpers/clinic-helpers";
import objectContaining = jasmine.objectContaining;

describe("Clinic Repository", () => {
  beforeEach(() => {
    jest.spyOn(Logger, "error").mockImplementation(() => {});
  });

  describe("success", () => {
    it("should call Clinic with the expected attributes", async () => {
      const clinicAttrs = getClinicAttrs();
      const spy = jest.spyOn(Clinic, "create").mockResolvedValue();
      await ClinicRepository.create(clinicAttrs);
      expect(spy).toBeCalledWith(clinicAttrs);
    });
  });

  describe("error", () => {
    describe("when it encounter UniqueConstraintError", () => {
      it("should return repository error", async () => {
        const clinicAttrs = getClinicAttrs();
        jest.spyOn(Clinic, "create").mockRejectedValue(
          new UniqueConstraintError({
            errors: [ new ValidationErrorItem("email must be unique",
              "email", "email") ],
          }),
        );
        await expect(ClinicRepository.create(clinicAttrs)).rejects.toThrowError(RepositoryError);
      });

      it("should return the expected error code", async () => {
        const clinicAttrs = getClinicAttrs();
        jest.spyOn(Clinic, "create").mockRejectedValue(
          new UniqueConstraintError({
            errors: [ new ValidationErrorItem("email must be unique",
              "email", "email") ],
          }),
        );
        await expect(ClinicRepository.create(clinicAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.FIELD_ALREADY_EXISTS.code,
          }));
      });
    });

    describe("when it encounter ValidationError", () => {
      it("should return the expected error code", async () => {
        const clinicAttrs = getClinicAttrs();
        jest.spyOn(Clinic, "create").mockRejectedValue(
          new ValidationError("Validation error: Invalid email"),
        );
        await expect(ClinicRepository.create(clinicAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.VALIDATION_ERROR.code,
          }));
      });
    });
  });
});
