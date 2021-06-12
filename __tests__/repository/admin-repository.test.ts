import { v4 as generateUUID } from "uuid";
import AdminRepository, { AdminAttributes } from "../../src/respository/admin-repository";
import { ForeignKeyConstraintError, UniqueConstraintError, ValidationError, ValidationErrorItem } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import { Logger } from "../../src/logger";
import { Errors } from "../../src/errors/error-mappings";
import Admin from "../../src/models/admin";
import objectContaining = jasmine.objectContaining;

describe("Admin Repository", () => {
  const getAdminAttrs = (overrideAttrs?: Partial<AdminAttributes>): AdminAttributes => {
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
    it("should call Admin with the expected attributes", async () => {
      const adminAttrs = getAdminAttrs();
      const spy = jest.spyOn(Admin, "create").mockResolvedValue();
      await AdminRepository.create(adminAttrs);
      expect(spy).toBeCalledWith(adminAttrs);
    });
  });

  describe("errors", () => {
    describe("when it encounters UniqueConstraintError", () => {
      it("should return repository error", async () => {
        const adminAttrs = getAdminAttrs();
        jest.spyOn(Admin, "create").mockRejectedValue(
          new UniqueConstraintError({
            errors: [ new ValidationErrorItem("email must be unique",
              "email", "email") ],
          }),
        );
        await expect(AdminRepository.create(adminAttrs)).rejects.toThrowError(RepositoryError);
      });

      it("should return the expected error code", async () => {
        const adminAttrs = getAdminAttrs();
        jest.spyOn(Admin, "create").mockRejectedValue(
          new UniqueConstraintError({
            errors: [ new ValidationErrorItem("email must be unique",
              "email", "email") ],
          }),
        );
        await expect(AdminRepository.create(adminAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.FIELD_ALREADY_EXISTS.code,
          }));
      });
    });

    describe("when it encounters ValidationError", () => {
      it("should return repository error with the validation error code", async () => {
        const adminAttrs = getAdminAttrs({ email: "123" });
        jest.spyOn(Admin, "create").mockRejectedValue(
          new ValidationError("Validation isEmail on email failed",
            [ new ValidationErrorItem("email must be unique", "email") ]),
        );
        await expect(AdminRepository.create(adminAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.VALIDATION_ERROR.code,
          }));
      });
    });

    describe("when it encounters ForeignKeyConstraintError", () => {
      it("should return repository error with associated entity not found error code", async () => {
        const adminAttrs = getAdminAttrs({ email: "123" });
        jest.spyOn(Admin, "create").mockRejectedValue(
          new ForeignKeyConstraintError({ message: "clinicId 1 not found", fields: [ "clinicId" ] }),
        );
        await expect(AdminRepository.create(adminAttrs)).rejects
          .toMatchObject(objectContaining({
            code: Errors.ENTITY_NOT_FOUND.code,
          }));
      });
    });
  });
});
