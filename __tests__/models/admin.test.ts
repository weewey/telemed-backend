import { v4 as generateUUID } from "uuid";
import { AdminAttributes } from "../../src/respository/admin-repository";
import Admin from "../../src/models/admins";
import { UniqueConstraintError, ValidationError } from "sequelize";

describe("Admin", () => {
  const adminIdsToBeDeleted: Array<number> = [];
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

  afterAll(async () => {
    await Admin.destroy({ where: { id: adminIdsToBeDeleted } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const admin = await Admin.create(getAdminAttrs());
      expect(admin).toBeDefined();

      adminIdsToBeDeleted.push(admin.id);
    });
  });

  describe("when invalid", () => {
    it("should return an error when the email is not valid", async () => {
      await expect(Admin.create(getAdminAttrs({ email: "email" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is not valid", async () => {
      await expect(Admin.create(getAdminAttrs({ firstName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is above 50 characters", async () => {
      await expect(Admin.create(
        getAdminAttrs({
          firstName:
                        "Lorem ipsum dolor sit ameta consectetuer adipiscing",
        }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is above 50 characters", async () => {
      await expect(Admin.create(
        getAdminAttrs({ firstName: "Lorem ipsum dolor sit ameta consectetuer adipiscing" }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is not valid", async () => {
      await expect(Admin.create(getAdminAttrs({ lastName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    describe("when fields are not unique", () => {
      const email = "123@gmail.com";
      const authId = "authId";
      const mobileNumber = "123456";

      beforeAll(async () => {
        const admin = await Admin.create(getAdminAttrs({ email, authId, mobileNumber }));

        adminIdsToBeDeleted.push(admin.id);
      });
      it("should return UniqueConstraintError when email is not unique", async () => {
        await expect(Admin.create(getAdminAttrs({ email })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when authId is not unique", async () => {
        await expect(Admin.create(getAdminAttrs({ authId })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when mobileNumber is not unique", async () => {
        await expect(Admin.create(getAdminAttrs({ mobileNumber })))
          .rejects.toThrowError(UniqueConstraintError);
      });
    });
  });
});
