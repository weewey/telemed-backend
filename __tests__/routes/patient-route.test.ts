import request from "supertest";
import patientService, { PatientAttributes } from "../../src/services/patient-service";
import Patient from "../../src/models/patient";
import { StatusCodes } from "http-status-codes";
import app from "../../src/app";
import { omit } from "lodash";

describe("Patients Route", () => {
    const patientBaseUrl = "/api/v1/patients";
    const patient: PatientAttributes = {
        firstName: "firstName",
        lastName: "lastName-route",
        email: "email-route@gmail.com",
        authId: "route-auth-Id",
        mobileNumber: "91110002",
    }

    beforeEach(jest.clearAllMocks);

    describe("POST /", () => {
        describe('Successful scenarios', () => {
            it("should return 201 with the expected body", async () => {
                jest.spyOn(patientService, "create").mockResolvedValue(patient as Patient)
                await request(app).post(patientBaseUrl)
                .send(patient)
                .expect(StatusCodes.CREATED)
                .expect(patient);
            });
        });

        describe('Error scenarios', () => {

            describe('route validation errors', () => {
                it.each([
                    [ "firstName" ],
                    [ "lastName" ],
                    [ "email" ],
                    [ "authId" ],
                    [ "mobileNumber" ]
                ])('should throw validation error when field does not exist (%s)', async (missingField) => {
                    const patientDetailsWithMissingField = omit(patient, missingField)
                    jest.spyOn(patientService, "create").mockResolvedValue(patient as Patient)

                    const response = await request(app).post(patientBaseUrl)
                    .send(patientDetailsWithMissingField)
                    .expect(StatusCodes.BAD_REQUEST)

                    expect(response.body.error).toMatchObject({ invalidParams: [
                        { name: missingField, reason: `${missingField} must be present` } ]})
                });

                it('should throw validation error when firstName has > 50 characters', async () => {
                    const patientDetails= { ...patient, firstName: "long-name-more-than-fifty-characters-for-sure-i-know-it"}
                    jest.spyOn(patientService, "create").mockResolvedValue(patient as Patient)

                    const response = await request(app).post(patientBaseUrl)
                    .send(patientDetails)
                    .expect(StatusCodes.BAD_REQUEST)

                    expect(response.body.error).toMatchObject({ invalidParams: [
                        { name: "firstName", reason: "firstName must not be longer than 50 characters" } ]})
                });

                it('should throw validation error when lastName has > 50 characters', async () => {
                    const patientDetails= { ...patient, lastName: "long-name-more-than-fifty-characters-for-sure-i-know-it"}
                    jest.spyOn(patientService, "create").mockResolvedValue(patient as Patient)

                    const response = await request(app).post(patientBaseUrl)
                    .send(patientDetails)
                    .expect(StatusCodes.BAD_REQUEST)

                    expect(response.body.error).toMatchObject({ invalidParams: [
                        { name: "lastName", reason: "lastName must not be longer than 50 characters" } ]})
                });

                it('should throw validation error when email is not a valid email', async () => {
                    const patientDetails = { ...patient, email: "invalid-email"}
                    jest.spyOn(patientService, "create").mockResolvedValue(patient as Patient)

                    const response = await request(app).post(patientBaseUrl)
                    .send(patientDetails)
                    .expect(StatusCodes.BAD_REQUEST)

                    expect(response.body.error).toMatchObject({ invalidParams: [
                        { name: "email", reason: "email must be a valid email" } ]})
                });

                it('should throw validation error when mobileNumber has less then 8 characters', async () => {
                    const patientDetails = { ...patient, mobileNumber: "9108"}
                    jest.spyOn(patientService, "create").mockResolvedValue(patient as Patient)

                    const response = await request(app).post(patientBaseUrl)
                    .send(patientDetails)
                    .expect(StatusCodes.BAD_REQUEST)

                    expect(response.body.error).toMatchObject({ invalidParams: [
                        { name: "mobileNumber", reason: "mobileNumber must have min 8 characters" } ]})
                });
            });
        });
    });
});