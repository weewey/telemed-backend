import { UniqueConstraintError, ValidationError } from "sequelize";
import QueueStatus from "../../src/queue_status";
import Queue from "../../src/models/queue";
import { v4 as generateUUID } from "uuid";
import { DoctorAttributes } from "../../src/respository/doctor-repository";
import Doctor from "../../src/models/doctor";
import { clinicFactory } from "../factories/clinic";

describe("Doctor", () => {
  const doctorIdsToBeDeleted: Array<number> = [];
  const getDoctorAttrs = (overrideAttrs?: Partial<DoctorAttributes>): DoctorAttributes => {
    return {
      authId: generateUUID(),
      email: `${generateUUID()}@gmail.com`,
      firstName: "first name",
      lastName: "last",
      mobileNumber: generateUUID(),
      onDuty: false,
      ...overrideAttrs,
    };
  };

  afterAll(async () => {
    await Doctor.destroy({ where: { id: doctorIdsToBeDeleted } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const doctor = await Doctor.create(getDoctorAttrs());
      expect(doctor).toBeDefined();

      doctorIdsToBeDeleted.push(doctor.id);
    });

    describe("when the doctor has a queue", () => {
      let clinicId: number;
      let queueId: number;
      let doctor: Doctor;

      beforeEach(async () => {
        const clinic = await clinicFactory.build();
        clinicId = clinic.id;
        const queueAttributes = {
          "clinicId": clinicId,
          "createdAt": new Date(Date.now()),
          "updatedAt": new Date(Date.now()),
          "status": QueueStatus.CLOSED,
          "startedAt": new Date(Date.now()),
          "closedAt": new Date(Date.now()),
        };
        const queue = await Queue.create(queueAttributes);
        queueId = queue.id;
      });

      it("should associate correctly to queue", async () => {
        doctor = await Doctor.create(getDoctorAttrs({ queueId }));

        const foundDoctor = await Doctor.findOne({ where: { id: doctor.id }, include: Queue });
        expect(foundDoctor?.queue?.id).toEqual(queueId);

        doctorIdsToBeDeleted.push(doctor.id);
      });
    });
  });

  describe("when invalid", () => {
    it("should return an error when the email is not valid", async () => {
      await expect(Doctor.create(getDoctorAttrs({ email: "email" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is not valid", async () => {
      await expect(Doctor.create(getDoctorAttrs({ firstName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the firstName is above 50 characters", async () => {
      await expect(Doctor.create(
        getDoctorAttrs({
          firstName:
                        "Lorem ipsum dolor sit ameta consectetuer adipiscing",
        }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is above 50 characters", async () => {
      await expect(Doctor.create(
        getDoctorAttrs({ firstName: "Lorem ipsum dolor sit ameta consectetuer adipiscing" }),
      )).rejects
        .toThrowError(ValidationError);
    });

    it("should return an error when the lastName is not valid", async () => {
      await expect(Doctor.create(getDoctorAttrs({ lastName: "1234" }))).rejects
        .toThrowError(ValidationError);
    });

    describe("when fields are not unique", () => {
      const email = "123@gmail.com";
      const authId = "authId";
      const mobileNumber = "123456";

      beforeAll(async () => {
        const doctor = await Doctor.create(getDoctorAttrs({ email, authId, mobileNumber }));

        doctorIdsToBeDeleted.push(doctor.id);
      });
      it("should return UniqueConstraintError when email is not unique", async () => {
        await expect(Doctor.create(getDoctorAttrs({ email })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when authId is not unique", async () => {
        await expect(Doctor.create(getDoctorAttrs({ authId })))
          .rejects.toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when mobileNumber is not unique", async () => {
        await expect(Doctor.create(getDoctorAttrs({ mobileNumber })))
          .rejects.toThrowError(UniqueConstraintError);
      });
    });
  });
});
