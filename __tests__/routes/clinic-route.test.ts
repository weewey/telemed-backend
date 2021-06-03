import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import Clinic from "../../src/models/clinic";
import ClinicService from "../../src/services/clinic-service";
import { getClinicAttrs } from "../helpers/clinic-helpers";

describe("Clinics Route", () => {
  const clinicBaseUrl = "/api/v1/clinics";

  describe("GET /:clinicId", () => {
    let getClinicByIdSpy: jest.SpyInstance;
    let mockClinic: Clinic;
    const clinicId = 200;

    describe("when the clinic is found", () => {
      beforeAll(async () => {
        mockClinic = { id: 1 } as Clinic;
        getClinicByIdSpy = jest.spyOn(ClinicService, "getClinicById").mockResolvedValue(mockClinic);
      });
      it("calls getClinicById", async () => {
        await request(app).get(`${clinicBaseUrl}/${clinicId}`);
        expect(getClinicByIdSpy).toHaveBeenCalled();
      });

      it("returns the clinic info in the right format", async () => {
        const result = await request(app).get(`${clinicBaseUrl}/${clinicId}`);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { updatedAt, createdAt, ...actualBody } = result.body;
        expect(mockClinic).toEqual(expect.objectContaining(actualBody));
      });

      it("returns OK", async () => {
        const result = await request(app).get(`${clinicBaseUrl}/${clinicId}`);
        expect(result.status).toEqual(200);
      });
    });

    describe("when the clinic is not found", () => {
      beforeAll(async () => {
        getClinicByIdSpy = jest.spyOn(ClinicService, "getClinicById").mockResolvedValue(null);
      });

      const notFoundClinicId = 99999;
      it("should return 404", async () => {
        const notFoundResult = await request(app).get(`${clinicBaseUrl}/${notFoundClinicId}`);
        expect(notFoundResult.status).toEqual(404);
      });
    });
  });

  describe("GET /", () => {
    let getClinicsSpy: jest.SpyInstance;
    beforeAll(() => {
      getClinicsSpy = jest.spyOn(ClinicService, "getClinics").mockResolvedValue([]);
    });
    it("calls getClinics", async () => {
      await request(app).get(`${clinicBaseUrl}`);
      expect(getClinicsSpy).toHaveBeenCalled();
    });
  });

  describe("POST /", () => {
    const mockClinic = { id: 1, name: "ABC Clinic Pte Ltd" } as Clinic;
    let createClinicSpy: jest.SpyInstance;
    const clinicAttrs = getClinicAttrs();
    beforeAll(() => {
      createClinicSpy = jest.spyOn(ClinicService, "create").mockResolvedValue(mockClinic);
    });

    describe("success", () => {
      it("calls ClinicStaffsService.create", async () => {
        await request(app).post(`${clinicBaseUrl}`).send(clinicAttrs);
        expect(createClinicSpy).toHaveBeenCalled();
      });

      it("returns statusCode 201", async () => {
        const result = await request(app).post(`${clinicBaseUrl}`).send(clinicAttrs);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });

      it("returns the clinic in the body", async () => {
        const result = await request(app).post(`${clinicBaseUrl}`).send(clinicAttrs);
        expect(result.body).toEqual(mockClinic);
      });
    });
  });
});
