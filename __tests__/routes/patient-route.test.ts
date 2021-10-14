import request from "supertest";
import PatientService from "../../src/services/patient-service";
import Patient from "../../src/models/patient";
import { StatusCodes } from "http-status-codes";
import app from "../../src/app";
import { omit } from "lodash";
import { PatientAttributes } from "../../src/respository/patient-repository";
import { Logger } from "../../src/logger";

describe("Patients Route", () => {
  const patientBaseUrl = "/api/v1/patients";
  const authId = "route-auth-Id";
  const patient: PatientAttributes = {
    firstName: "firstName",
    lastName: "lastName-route",
    email: "email-route@gmail.com",
    authId,
    mobileNumber: "91110002",
    dateOfBirth: "1990-01-01",
  };

  beforeEach(() => {
    jest.spyOn(Logger, "error").mockImplementation(() => {});
    jest.clearAllMocks();
  });

  describe("POST /", () => {
    describe("Successful scenarios", () => {
      let patientServiceSpy: jest.SpyInstance;
      beforeEach(() => {
        patientServiceSpy = jest.spyOn(PatientService, "create").mockResolvedValue(patient as unknown as Patient);
      });

      it("should return 201 with the expected body", async () => {
        const response = await request(app).post(patientBaseUrl)
          .send(patient)
          .expect(StatusCodes.CREATED);

        expect(response.body).toMatchObject({ authId,
          email: "email-route@gmail.com",
          firstName: "firstName",
          lastName: "lastName-route",
          mobileNumber: "91110002" });
      });

      it("should call patientService.create with the right params", async () => {
        await request(app).post(patientBaseUrl)
          .send(patient)
          .expect(StatusCodes.CREATED);

        expect(patientServiceSpy).toBeCalledWith({
          "authId": authId,
          "email": "email-route@gmail.com",
          "dateOfBirth": "1990-01-01",
          "firstName": "firstName",
          "lastName": "lastName-route",
          "mobileNumber": "91110002",
        });
      });
    });

    describe("Error scenarios", () => {
      describe("route validation errors", () => {
        it.each([
          [ "firstName" ],
          [ "lastName" ],
          [ "email" ],
          [ "authId" ],
          [ "mobileNumber" ],
          [ "dateOfBirth" ],
        ])("should throw validation error when field does not exist (%s)", async (missingField) => {
          const patientDetailsWithMissingField = omit(patient, missingField);
          jest.spyOn(PatientService, "create").mockResolvedValue(patient as unknown as Patient);

          const response = await request(app).post(patientBaseUrl)
            .send(patientDetailsWithMissingField)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: missingField, reason: `${missingField} must be present` } ] });
        });

        it("should throw validation error when firstName has > 50 characters", async () => {
          const patientDetails = { ...patient, firstName: "long-name-more-than-fifty-characters-for-sure-i-know-it" };
          jest.spyOn(PatientService, "create").mockResolvedValue(patient as unknown as Patient);

          const response = await request(app).post(patientBaseUrl)
            .send(patientDetails)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: "firstName", reason: "firstName must not be longer than 50 characters" } ] });
        });

        it("should throw validation error when lastName has > 50 characters", async () => {
          const patientDetails = { ...patient, lastName: "long-name-more-than-fifty-characters-for-sure-i-know-it" };
          jest.spyOn(PatientService, "create").mockResolvedValue(patient as unknown as Patient);

          const response = await request(app).post(patientBaseUrl)
            .send(patientDetails)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: "lastName", reason: "lastName must not be longer than 50 characters" } ] });
        });

        it("should throw validation error when email is not a valid email", async () => {
          const patientDetails = { ...patient, email: "invalid-email" };
          jest.spyOn(PatientService, "create").mockResolvedValue(patient as unknown as Patient);

          const response = await request(app).post(patientBaseUrl)
            .send(patientDetails)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: "email", reason: "email must be a valid email" } ] });
        });

        it("should throw validation error when mobileNumber has less then 8 characters", async () => {
          const patientDetails = { ...patient, mobileNumber: "9108" };
          jest.spyOn(PatientService, "create").mockResolvedValue(patient as unknown as Patient);

          const response = await request(app).post(patientBaseUrl)
            .send(patientDetails)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: "mobileNumber", reason: "mobileNumber must have min 8 characters" } ] });
        });
      });
    });
  });

  describe("GET /:patientId", () => {
    it("should return the expected patient", async () => {
      const expectedPatient = { id: 1 } as Patient;
      jest.spyOn(PatientService, "getPatientById").mockResolvedValue(expectedPatient);
      const response = await request(app)
        .get(`${patientBaseUrl}/1`)
        .expect(StatusCodes.OK);

      expect(response.body).toEqual(expectedPatient);
    });
  });
});
