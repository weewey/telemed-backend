import AdminRepository, { AdminAttributes } from "../../src/respository/admin-repository";
import AdminService from "../../src/services/admin-service";
import { v4 as generateUUID } from "uuid";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import NotFoundError from "../../src/errors/not-found-error";
import AuthService from "../../src/services/auth-service";
import { Role } from "../../src/clients/auth-client";
import Admin from "../../src/models/admin";

describe("Admin Service", () => {
  const getAdminAttrs = (overrideAttrs?: Partial<AdminAttributes>): AdminAttributes => {
    return {
      authId: generateUUID(),
      email: `${generateUUID()}@gmail.com`,
      firstName: "first name",
      lastName: "last",
      mobileNumber: generateUUID(),
      dateOfBirth: "1990-01-01",
      ...overrideAttrs,
    };
  };

  it("should call AdminRepository.create with the right params", async () => {
    const spy = jest.spyOn(AdminRepository, "create").mockResolvedValue({} as Admin);
    jest.spyOn(AuthService, "setPermissions").mockResolvedValue(undefined);
    const adminAttrs = getAdminAttrs();
    await AdminService.create(adminAttrs);
    expect(spy).toBeCalledWith(adminAttrs);
  });

  it("should call AuthService.setPermissions with the right params", async () => {
    const adminAttrs = getAdminAttrs();
    jest.spyOn(AdminRepository, "create").mockResolvedValue({ authId: adminAttrs.authId, id: 1 } as Admin);
    const spy = jest.spyOn(AuthService, "setPermissions").mockResolvedValue(undefined);
    await AdminService.create(adminAttrs);
    expect(spy).toBeCalledWith({
      authId: adminAttrs.authId,
      role: Role.ADMIN,
      adminId: 1,
    });
  });

  describe("when AdminRepository errors", () => {
    it("should throw BusinessError when the error is due to uniqueness/validation", async () => {
      jest.spyOn(AdminRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "message"),
      );
      const adminAttrs = getAdminAttrs();
      await expect(AdminService.create(adminAttrs)).rejects.toThrowError(BusinessError);
    });

    it("should throw NotFoundError when the error is due to associated entity not found", async () => {
      jest.spyOn(AdminRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.ENTITY_NOT_FOUND.code, "not found"),
      );
      const adminAttrs = getAdminAttrs();
      await expect(AdminService.create(adminAttrs)).rejects.toThrowError(NotFoundError);
    });

    it("should throw TechnicalError when it encounters other errors", async () => {
      jest.spyOn(AdminRepository, "create").mockRejectedValue(
        new RepositoryError("other error code", "message"),
      );
      const adminAttrs = getAdminAttrs();
      await expect(AdminService.create(adminAttrs)).rejects.toThrowError(TechnicalError);
    });
  });

  describe("when AuthService.setPermissions errors", () => {
    const adminAttrs = getAdminAttrs();
    const mockAdmin = { authId: adminAttrs.authId,
      id: 1,
      destroy: () => {} } as Admin;

    beforeEach(() => {
      jest.spyOn(AdminRepository, "create").mockResolvedValue(mockAdmin);
      jest.spyOn(AuthService, "setPermissions").mockRejectedValue(new Error("test"));
    });

    it("should call admin.destroy", async () => {
      const spy = jest.spyOn(mockAdmin, "destroy")
        .mockResolvedValue(undefined);
      await expect(AdminService.create(adminAttrs)).rejects.toThrowError(Error);
      expect(spy).toBeCalled();
    });

    describe("when destroy admin errors", () => {
      it("should throw TechnicalError", async () => {
        jest.spyOn(mockAdmin, "destroy")
          .mockRejectedValue(new TechnicalError("test"));
        await expect(AdminService.create(adminAttrs))
          .rejects
          .toEqual(new TechnicalError("Error deleting admin after failure to setPermissions on " +
              "AuthService. AdminId: 1 test"));
      });
    });
  });
});
