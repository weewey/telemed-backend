import app from "../../src/app";
import request from "supertest";
import {clinicFactory} from "../factories";
import clinicService from "../../src/services/clinic-service"
import Clinic from "../../src/models/clinic";


describe("Clinic Route", () => {
    const clinicBaseUrl = "/api/v1/clinics";

    describe("GET", () => {
        let getClinicByIdSpy: jest.SpyInstance;
        let mockClinic: Clinic
        const clinicId = 1;

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
    });

});