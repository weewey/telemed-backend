import app from "../../src/app";
import request from "supertest";
import {clinicFactory} from "../factories";
import clinicService from "../../src/services/clinic-service"
import Clinic from "../../src/models/clinic";


describe("Clinics Route", () => {
    const clinicBaseUrl = "/api/v1/clinics";

    describe("GET /:clinicId", () => {
        let getClinicByIdSpy: jest.SpyInstance;
        let mockClinic: Clinic
        const clinicId = 1;

        describe("when the clinic is found", () => {
            beforeAll(async () => {
                mockClinic = await clinicFactory.build({id: clinicId})
                getClinicByIdSpy = jest.spyOn(clinicService, "getClinicById").mockResolvedValue(mockClinic);
            });
            it("calls getClinicById", async () => {
                await request(app).get(`${clinicBaseUrl}/${clinicId}`);
                expect(getClinicByIdSpy).toHaveBeenCalled();
            });

            it("returns the clinic info in the right format", async () => {
                const result = await request(app).get(`${clinicBaseUrl}/${clinicId}`);
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { updatedAt, createdAt, ...actualBody } = result.body;
                expect(mockClinic).toEqual(expect.objectContaining(actualBody))
            });

            it("returns OK", async () => {
                const result = await request(app).get(`${clinicBaseUrl}/${clinicId}`);
                expect(result.status).toEqual(200)
            });
        })

        describe("when the clinic is not found", () => {
            beforeAll(async () => {
                getClinicByIdSpy = jest.spyOn(clinicService, "getClinicById").mockResolvedValue(null);
            });

            const notFoundClinicId = 99999
            it("should return 404", async () => {
                const notFoundResult = await request(app).get(`${clinicBaseUrl}/${notFoundClinicId}`);
                expect(notFoundResult.status).toEqual(404);
            })
        })
    });

    describe("GET /", () => {
        let getClinicsSpy: jest.SpyInstance;
        beforeAll(() => {
            getClinicsSpy = jest.spyOn(clinicService, "getClinics").mockResolvedValue([]);
        })
        it("calls getClinics", async () => {
            await request(app).get(`${clinicBaseUrl}`);
            expect(getClinicsSpy).toHaveBeenCalled();
        });
    });
});