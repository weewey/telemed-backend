import { v4 as generateUUID } from "uuid";
import StaffRepository, { StaffAttributes } from "../../src/respository/staff-repository";
import Staff from "../../src/models/staff";
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError, ValidationErrorItem } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import { Logger } from "../../src/logger";
import { Errors } from "../../src/errors/error-mappings";
import objectContaining = jasmine.objectContaining;

describe("Staff Repository", () => {
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

  beforeEach(() => {
    jest.spyOn(Logger, "error").mockImplementation(() => {});
  });

  describe("success", () => {
    it("should call Staff with the expected attributes", async () => {
      const staffAttrs = getStaffAttrs();
      const spy = jest.spyOn(Staff, "create").mockResolvedValue();
      await StaffRepository.create(staffAttrs);
      expect(spy).toBeCalledWith(staffAttrs);
    });
  });

  describe("errors", () => {
    describe("when it encounters UniqueConstraintError", () => {
      it("should return repository error", async () => {
        const staffAttrs = getStaffAttrs();
        jest.spyOn(Staff, "create").mockRejectedValue(
          new UniqueConstraintError({
            errors: [ new ValidationErrorItem("email must be unique",
              "email", "email") ],
          }),
        );
        await expect(StaffRepository.create(staffAttrs)).rejects.toThrowError(RepositoryError);
      });

      it("should return the expected error code", async () => {
        const staffAttrs = getStaffAttrs();
        jest.spyOn(Staff, "create").mockRejectedValue(
          new UniqueConstraintError({
            errors: [ new ValidationErrorItem("email must be unique",
              "email", "email") ],
          }),
        );
        await expect(StaffRepository.create(staffAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.FIELD_ALREADY_EXISTS.code,
          }));
      });
    });

    describe("when it encounters ValidationError", () => {
      it("should return repository error with the validation error code", async () => {
        const staffAttrs = getStaffAttrs({ email: "123" });
        jest.spyOn(Staff, "create").mockRejectedValue(
          new ValidationError("Validation isEmail on email failed",
            [ new ValidationErrorItem("email must be unique", "email") ]),
        );
        await expect(StaffRepository.create(staffAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.VALIDATION_ERROR.code,
          }));
      });
    });

    describe("when it encounters ForeignKeyConstraintError", () => {
      it("should return repository error with associated entity not found error code", async () => {
        const staffAttrs = getStaffAttrs({ email: "123" });
        jest.spyOn(Staff, "create").mockRejectedValue(
          new ForeignKeyConstraintError({ message: "clinicId 1 not found", fields: [ "clinicId" ] }),
        );
        await expect(StaffRepository.create(staffAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.ENTITY_NOT_FOUND.code,
          }));
      });
    });
  });
});
