import { UniqueConstraintError, ValidationError } from "sequelize";
import { v4 as generateUUID } from "uuid";
import { StaffAttributes } from "../../src/respository/staff-repository";
import Staff from "../../src/models/staff";

describe("Staff", () => {
  const staffIdsToBeDeleted: Array<number> = [];
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

  afterAll(async () => {
    await Staff.destroy({ where: { id: staffIdsToBeDeleted } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const staff = await Staff.create(getStaffAttrs());
      expect(staff).toBeDefined();

      staffIdsToBeDeleted.push(staff.id);
    });
  });

  describe("when invalid", () => {
    it("should return an error when the email is not valid", async () => {
      await expect(Staff.create(getStaffAttrs({ email: "email" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is not valid", async () => {
      await expect(Staff.create(getStaffAttrs({ firstName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is above 50 characters", async () => {
      await expect(Staff.create(
        getStaffAttrs({
          firstName:
          "Lorem ipsum dolor sit ameta consectetuer adipiscing",
        }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is above 50 characters", async () => {
      await expect(Staff.create(
        getStaffAttrs({ firstName: "Lorem ipsum dolor sit ameta consectetuer adipiscing" }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is not valid", async () => {
      await expect(Staff.create(getStaffAttrs({ lastName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    describe("when fields are not unique", () => {
      const email = "123@gmail.com";
      const authId = "authId";
      const mobileNumber = "123456";

      beforeAll(async () => {
        const staff = await Staff.create(getStaffAttrs({ email, authId, mobileNumber }));

        staffIdsToBeDeleted.push(staff.id);
      });
      it("should return UniqueConstraintError when email is not unique", async () => {
        await expect(Staff.create(getStaffAttrs({ email })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when authId is not unique", async () => {
        await expect(Staff.create(getStaffAttrs({ authId })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when mobileNumber is not unique", async () => {
        await expect(Staff.create(getStaffAttrs({ mobileNumber })))
          .rejects.toThrowError(UniqueConstraintError);
      });
    });
  });
});
