import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { destroyPatientByField } from "../helpers/patient-helpers";
import app from "../../src/app";
import { Errors } from "../../src/errors/error-mappings";
import { PatientAttributes } from "../../src/respository/patient-repository";
import { generateRandomString } from "../helpers/common-helpers";

describe("#Patient Component", () => {
  const PATIENT_PATH = "/api/v1/patients";
  const defaultPatient = {
    firstName: "PatientComponentFirstName",
    lastName: "PatientComponentLastName",
    email: "email1@gmail.com",
    authId: "Patient-component-authId",
    mobileNumber: "910481234",
  };
  const patientNameForErrorCases = "PatientComponentFirstNameError";

  const patientAttributes = (overrides?: Partial<PatientAttributes>): PatientAttributes => {
    const patient = {
      firstName: patientNameForErrorCases,
      lastName: generateRandomString(8),
      email: `${generateRandomString(8)}@gmail.com`,
      authId: generateRandomString(8),
      mobileNumber: generateRandomString(8),
    };
    return { ...patient, ...overrides };
  };

  describe("#POST /patients", () => {
    afterEach(async () => {
      await destroyPatientByField({ firstName: defaultPatient.firstName });
      await destroyPatientByField({ firstName: patientNameForErrorCases });
    });

    it("should create Patient successfully", async () => {
      const response = await request(app)
        .post(PATIENT_PATH)
        .send(defaultPatient)
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        firstName: defaultPatient.firstName,
        lastName: defaultPatient.lastName,
        email: defaultPatient.email,
        authId: defaultPatient.authId,
        mobileNumber: defaultPatient.mobileNumber,
      }));
    });

    describe("Error Scenarios", () => {
      it.each([
        [ "mobileNumber", { mobileNumber: defaultPatient.mobileNumber } ],
        [ "email", { email: defaultPatient.email } ],
        [ "authId", { authId: defaultPatient.authId } ],
      ])("should throw error when creating patient with [%s] that already exists", async (fieldName, field) => {
        await request(app).post(PATIENT_PATH).send({ ...patientAttributes(), ...field });

        const response = await request(app)
          .post(PATIENT_PATH)
          .send({ ...patientAttributes(), ...field })
          .expect(StatusCodes.BAD_REQUEST);

        expect(response.body).toMatchObject({
          error: {
            message: `Unable to create patient as ${fieldName} already exists`,
            code: Errors.FIELD_ALREADY_EXISTS.code,
          },
        });
      });
    });
  });
});
