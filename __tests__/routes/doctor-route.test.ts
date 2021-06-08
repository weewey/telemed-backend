import app from "../../src/app";
import request from "supertest";
import DoctorService from "../../src/services/doctor-service";
import Doctor from "../../src/models/doctor";
import { StatusCodes } from "http-status-codes";
import { DoctorAttributes } from "../../src/respository/doctor-repository";
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
});
