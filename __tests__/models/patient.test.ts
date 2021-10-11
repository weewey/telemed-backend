import { UniqueConstraintError, ValidationError } from "sequelize";
import Patient from "../../src/models/patient";
import { v4 as generateUUID } from "uuid";
import { PatientAttributes } from "../../src/respository/patient-repository";

describe("Patient", () => {
  const firstName = "patientModelTest";
  const getPatientDetails = (overrideDetails?: Partial<PatientAttributes>): PatientAttributes => {
    return {
      firstName: "patientModelTest",
      lastName: "patientLastName",
      email: `${generateUUID()}@gmail.com`,
      authId: generateUUID(),
      mobileNumber: generateUUID(),
      dateOfBirth: "1990-01-01",
      ...overrideDetails,
    };
  };

  afterAll(async () => {
    await Patient.destroy({ where: { firstName } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const patient = await Patient.create(getPatientDetails());
      expect(patient).toBeDefined();
    });

    it("should auto increment id", async () => {
      const patient1 = await Patient.create(getPatientDetails());
      const patient2 = await Patient.create(getPatientDetails());

      expect(patient1.id + 1).toEqual(patient2.id);
    });
  });

  describe("invalid", () => {
    describe("should throw sequelize validation error", () => {
      it("when inserting an invalid firstName in DB", async () => {
        const patientWithInvalidFirstName = getPatientDetails({ firstName: "invalid-name-with-hypen" });

        await expect(Patient.create(patientWithInvalidFirstName)).rejects.toThrow(ValidationError);
      });

      it("when inserting a firstName with longer than 50 characters in DB", async () => {
        const patientWithLongFirstName = getPatientDetails(
          { firstName: "long-name-veryyyyy-looooooooong-nameeeee-more-than-50-chars" },
        );

        await expect(Patient.create(patientWithLongFirstName)).rejects.toThrow(ValidationError);
      });

      it("when inserting an invalid lastName in DB", async () => {
        const patientWithInvalidLastName = getPatientDetails({ lastName: "invalid-name-with-hypen" });

        await expect(Patient.create(patientWithInvalidLastName)).rejects.toThrow(ValidationError);
      });

      it("when inserting a lastName with longer than 50 characters in DB", async () => {
        const patientWithLongLastName = getPatientDetails(
          { lastName: "long-name-veryyyyy-looooooooong-nameeeee-more-than-50-chars" },
        );

        await expect(Patient.create(patientWithLongLastName)).rejects.toThrow(ValidationError);
      });

      it("when inserting an invalid email in DB", async () => {
        const patientWithInvalidEmail = getPatientDetails({ email: "invalid-email" });

        await expect(Patient.create(patientWithInvalidEmail)).rejects.toThrow(ValidationError);
      });
    });
    describe("should throw sequelize unique key constraint error", () => {
      it("when inserting authId that exists in DB", async () => {
        const patientWithAuthId12345 = getPatientDetails({ authId: "12345" });
        await Patient.create(patientWithAuthId12345);

        await expect(Patient.create(patientWithAuthId12345)).rejects.toThrow(UniqueConstraintError);
      });

      it("when inserting email that exists in DB", async () => {
        const patientWithEmail12345 = getPatientDetails({ email: "12345@gmail.com" });
        await Patient.create(patientWithEmail12345);

        await expect(Patient.create(patientWithEmail12345)).rejects.toThrow(UniqueConstraintError);
      });

      it("when inserting mobileNumber that exists in DB", async () => {
        const patientWithMobileNumber91081111 = getPatientDetails({ mobileNumber: "91081111" });
        await Patient.create(patientWithMobileNumber91081111);

        await expect(Patient.create(patientWithMobileNumber91081111)).rejects.toThrow(UniqueConstraintError);
      });
    });
  });
});
