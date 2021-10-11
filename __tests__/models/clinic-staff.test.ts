import { UniqueConstraintError, ValidationError } from "sequelize";
import { v4 as generateUUID } from "uuid";
import { ClinicStaffAttributes } from "../../src/respository/clinic-staff-repository";
import ClinicStaff from "../../src/models/clinic-staff";

describe("ClinicStaff", () => {
  const clinicStaffsIdsToBeDeleted: Array<number> = [];
  const getClinicStaffAttrs = (overrideAttrs?: Partial<ClinicStaffAttributes>): ClinicStaffAttributes => {
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

  afterAll(async () => {
    await ClinicStaff.destroy({ where: { id: clinicStaffsIdsToBeDeleted } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const staff = await ClinicStaff.create(getClinicStaffAttrs());
      expect(staff).toBeDefined();

      clinicStaffsIdsToBeDeleted.push(staff.id);
    });
  });

  describe("when invalid", () => {
    it("should return an error when the email is not valid", async () => {
      await expect(ClinicStaff.create(getClinicStaffAttrs({ email: "email" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is not valid", async () => {
      await expect(ClinicStaff.create(getClinicStaffAttrs({ firstName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is above 50 characters", async () => {
      await expect(ClinicStaff.create(
        getClinicStaffAttrs({
          firstName:
          "Lorem ipsum dolor sit ameta consectetuer adipiscing",
        }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is above 50 characters", async () => {
      await expect(ClinicStaff.create(
        getClinicStaffAttrs({ firstName: "Lorem ipsum dolor sit ameta consectetuer adipiscing" }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is not valid", async () => {
      await expect(ClinicStaff.create(getClinicStaffAttrs({ lastName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    describe("when fields are not unique", () => {
      const email = "123@gmail.com";
      const authId = "authId";
      const mobileNumber = "123456";

      beforeAll(async () => {
        const clinicStaffs = await ClinicStaff.create(getClinicStaffAttrs({ email, authId, mobileNumber }));

        clinicStaffsIdsToBeDeleted.push(clinicStaffs.id);
      });
      it("should return UniqueConstraintError when email is not unique", async () => {
        await expect(ClinicStaff.create(getClinicStaffAttrs({ email })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when authId is not unique", async () => {
        await expect(ClinicStaff.create(getClinicStaffAttrs({ authId })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when mobileNumber is not unique", async () => {
        await expect(ClinicStaff.create(getClinicStaffAttrs({ mobileNumber })))
          .rejects.toThrowError(UniqueConstraintError);
      });
    });
  });
});
