import { StatusCodes } from "http-status-codes";
import request from "supertest";
import { destroyPatientsByIds } from "../helpers/patient-helpers";
import app from "../../src/app";
import { Errors } from "../../src/errors/error-mappings";
import { PatientAttributes } from "../../src/respository/patient-repository";
import { generateRandomString } from "../helpers/common-helpers";
import * as admin from "firebase-admin";

describe("#Patient Component", () => {
  const firebaseAuthAdmin = admin.initializeApp(undefined, "integration-test").auth();

  const PATIENT_PATH = "/api/v1/patients";
  const defaultPatient = {
    firstName: "PatientComponentFirstName",
    lastName: "PatientComponentLastName",
    email: "email1@gmail.com",
    authId: "Patient-component-authId",
    mobileNumber: "910481234",
  };

  const patientAttributes = (overrides?: Partial<PatientAttributes>): PatientAttributes => {
    const patient = {
      firstName: generateRandomString(8),
      lastName: generateRandomString(8),
      email: `${generateRandomString(8)}@gmail.com`,
      authId: generateRandomString(8),
      mobileNumber: generateRandomString(8),
    };
    return { ...patient, ...overrides };
  };

  beforeAll(async () => {
    await firebaseAuthAdmin.createUser({ uid: defaultPatient.authId });
  });

  afterAll(async () => {
    await firebaseAuthAdmin.deleteUser(defaultPatient.authId);
  });

  describe("#POST /patients", () => {
    const patientIdsToDestroy: number[] = [];

    afterAll(async () => {
      await destroyPatientsByIds(patientIdsToDestroy);
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
      patientIdsToDestroy.push(response.body.id);
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

        patientIdsToDestroy.push(response.body.id);
      });
    });
  });
});
