import request from "supertest";
import patientService, { PatientAttributes } from "../../src/services/patient-service";
import Patient from "../../src/models/patient";
import { StatusCodes } from "http-status-codes";
import app from "../../src/app";


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
        it("should return 201 with the expected body", async () => {
            jest.spyOn(patientService, "create").mockResolvedValue(patient as Patient)
            await request(app).post(patientBaseUrl)
            .send(patient)
            .expect(StatusCodes.CREATED)
            .expect(patient);
        });
    });
});