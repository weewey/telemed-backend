import app from "../../src/app";
import request from "supertest";
import DoctorService, {DoctorAttributes} from "../../src/services/doctor-service";
import Doctor from "../../src/models/doctor";
import {StatusCodes} from "http-status-codes";

describe("Doctors Route", () => {
    const doctorsBaseUrl = "/api/v1/doctors";
    const doctorAttrs: DoctorAttributes = {
        firstName: "first name",
        lastName: "last name",
        email: "email@email.com",
        authId: "authId",
        mobileNumber: "999",
        onDuty: false
    }
    const mockDoctor = {id: 1, firstName: "doctor", lastName: "strange"} as Doctor

    describe("POST /", () => {
        let createDoctorSpy: jest.SpyInstance
        beforeAll(() => {
            createDoctorSpy = jest.spyOn(DoctorService, "create").mockResolvedValue(mockDoctor);
        })

        describe('success', () => {
            it("calls DoctorService.create", async () => {
                await request(app).post(`${doctorsBaseUrl}`).send(doctorAttrs);
                expect(createDoctorSpy).toHaveBeenCalled();
            });

            it("returns statusCode 201", async () => {
                const result = await request(app).post(`${doctorsBaseUrl}`).send(doctorAttrs);
                expect(result.status).toEqual(StatusCodes.CREATED)
            });

            it("returns the doctor in the body", async () => {
                const result = await request(app).post(`${doctorsBaseUrl}`).send(doctorAttrs);
                expect(result.body).toEqual(mockDoctor)
            });
        });

    });
});