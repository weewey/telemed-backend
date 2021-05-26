import { UniqueConstraintError, ValidationError } from "sequelize";
import { v4 as generateUUID } from "uuid";
import { ClinicStaffsAttributes } from "../../src/respository/clinic-staffs-repository";
import ClinicStaffs from "../../src/models/clinic-staffs";

describe("ClinicStaffs", () => {
  const clinicStaffsIdsToBeDeleted: Array<number> = [];
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

  afterAll(async () => {
    await ClinicStaffs.destroy({ where: { id: clinicStaffsIdsToBeDeleted } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const staff = await ClinicStaffs.create(getClinicStaffsAttrs());
      expect(staff).toBeDefined();

      clinicStaffsIdsToBeDeleted.push(staff.id);
    });
  });

  describe("when invalid", () => {
    it("should return an error when the email is not valid", async () => {
      await expect(ClinicStaffs.create(getClinicStaffsAttrs({ email: "email" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is not valid", async () => {
      await expect(ClinicStaffs.create(getClinicStaffsAttrs({ firstName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is above 50 characters", async () => {
      await expect(ClinicStaffs.create(
        getClinicStaffsAttrs({
          firstName:
          "Lorem ipsum dolor sit ameta consectetuer adipiscing",
        }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is above 50 characters", async () => {
      await expect(ClinicStaffs.create(
        getClinicStaffsAttrs({ firstName: "Lorem ipsum dolor sit ameta consectetuer adipiscing" }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is not valid", async () => {
      await expect(ClinicStaffs.create(getClinicStaffsAttrs({ lastName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    describe("when fields are not unique", () => {
      const email = "123@gmail.com";
      const authId = "authId";
      const mobileNumber = "123456";

      beforeAll(async () => {
        const clinicStaffs = await ClinicStaffs.create(getClinicStaffsAttrs({ email, authId, mobileNumber }));

        clinicStaffsIdsToBeDeleted.push(clinicStaffs.id);
      });
      it("should return UniqueConstraintError when email is not unique", async () => {
        await expect(ClinicStaffs.create(getClinicStaffsAttrs({ email })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when authId is not unique", async () => {
        await expect(ClinicStaffs.create(getClinicStaffsAttrs({ authId })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when mobileNumber is not unique", async () => {
        await expect(ClinicStaffs.create(getClinicStaffsAttrs({ mobileNumber })))
          .rejects.toThrowError(UniqueConstraintError);
      });
    });
  });
});
