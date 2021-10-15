import app from "../../src/app";
import request from "supertest";
import DoctorService from "../../src/services/doctor-service";
import Doctor, { DoctorAttributes } from "../../src/models/doctor";
import { StatusCodes } from "http-status-codes";
import { omit } from "lodash";
import { Logger } from "../../src/logger";

describe("Doctors Route", () => {
  const doctorsBaseUrl = "/api/v1/doctors";
  const doctorAttrs: Partial<DoctorAttributes> = {
    firstName: "first name",
    lastName: "last name",
    email: "email@email.com",
    authId: "authId",
    mobileNumber: "123456789",
    onDuty: false,
    dateOfBirth: "1990-01-01",
  };
  const mockDoctor = { id: 1, firstName: "doctor", lastName: "strange" } as Doctor;

  describe("POST /", () => {
    let createDoctorSpy: jest.SpyInstance;
    beforeAll(() => {
      createDoctorSpy = jest.spyOn(DoctorService, "create").mockResolvedValue(mockDoctor);
    });

    describe("success", () => {
      it("calls DoctorService.create", async () => {
        await request(app).post(`${doctorsBaseUrl}`).send(doctorAttrs);
        expect(createDoctorSpy).toHaveBeenCalled();
      });

      it("calls DoctorService.create with onDuty false when onDuty in the request body", async () => {
        const withoutOnDutyAttrs = omit(doctorAttrs, "onDuty");
        await request(app).post(`${doctorsBaseUrl}`).send(withoutOnDutyAttrs);
        expect(createDoctorSpy).toHaveBeenCalledWith(doctorAttrs);
      });

      it("returns statusCode 201", async () => {
        const result = await request(app).post(`${doctorsBaseUrl}`).send(doctorAttrs);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });

      it("allows onDuty to be optional", async () => {
        const withoutOnDutyAttrs = omit(doctorAttrs, "onDuty");
        const result = await request(app).post(doctorsBaseUrl).send(withoutOnDutyAttrs);
        expect(result.body).toEqual(mockDoctor);
      });

      it("returns the doctor in the body", async () => {
        const result = await request(app).post(`${doctorsBaseUrl}`).send(doctorAttrs);
        expect(result.body).toEqual(mockDoctor);
      });
    });

    describe("error scenarios", () => {
      beforeEach(() => {
        jest.spyOn(Logger, "error").mockImplementation(() => {});
      });

      describe("route validation errors", () => {
        it.each([
          [ "firstName" ],
          [ "lastName" ],
          [ "email" ],
          [ "authId" ],
          [ "mobileNumber" ],
        ])("should throw validation error when field does not exist (%s)", async (missingField) => {
          const doctorAttrsWithMissingKey = omit(doctorAttrs, missingField);
          const response = await request(app).post(doctorsBaseUrl)
            .send(doctorAttrsWithMissingKey)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: missingField, reason: `${missingField} must be present` } ] });
        });
      });
    });
  });

  describe("PUT /:doctorId", () => {
    describe("Successful scenarios", () => {
      const doctorId = 123456;
      const DOCTOR_PUT_PATH = `${doctorsBaseUrl}/${doctorId}`;
      const doctor = { id: doctorId, clinicId: 1, authId: "authId" } as unknown as Doctor;

      // eslint-disable-next-line jest/expect-expect
      it("should return 200 with the expected body", async () => {
        jest.spyOn(DoctorService, "update").mockResolvedValue(doctor);
        await request(app).put(DOCTOR_PUT_PATH)
          .send({ clinicId: 1 })
          .expect(StatusCodes.OK)
          .expect(doctor);
      });
    });
  });

  describe("GET /doctors", () => {
    it("should return doctors from DoctorService", async () => {
      const doctor = { id: 1 } as Doctor;
      jest.spyOn(DoctorService, "findDoctors").mockResolvedValue([ doctor ]);
      const response = await request(app)
        .get(doctorsBaseUrl)
        .expect(StatusCodes.OK);

      expect(response.body).toEqual([ doctor ]);
    });

    describe("when there is query params", () => {
      it("call DoctorService.findDoctors with the expected attrs", async () => {
        const doctor = { id: 1 } as Doctor;
        const spy = jest.spyOn(DoctorService, "findDoctors").mockResolvedValue([ doctor ]);
        await request(app)
          .get(`${doctorsBaseUrl}?clinicId=1&onDuty=true`)
          .expect(StatusCodes.OK);

        expect(spy).toBeCalledWith({ clinicId: 1, onDuty: true });
      });
    });

    describe("when there is no query params", () => {
      it("call DoctorService.findDoctors with the expected attrs", async () => {
        const doctor = { id: 1 } as Doctor;
        const spy = jest.spyOn(DoctorService, "findDoctors").mockResolvedValue([ doctor ]);
        await request(app)
          .get(`${doctorsBaseUrl}`)
          .expect(StatusCodes.OK);

        expect(spy).toBeCalledWith();
      });
    });
  });

  describe("Get /doctors/:doctorId", () => {
    it("should call DoctorService.get", async () => {
      const doctor = { id: 1 } as Doctor;
      jest.spyOn(DoctorService, "get").mockResolvedValue(doctor);
      const response = await request(app).get(`${doctorsBaseUrl}/${doctor.id}`)
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(doctor);
    });
  });
});
