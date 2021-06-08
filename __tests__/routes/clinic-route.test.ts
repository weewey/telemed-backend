import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import Clinic from "../../src/models/clinic";
import ClinicService from "../../src/services/clinic-service";
import { getClinicAttrs } from "../helpers/clinic-helpers";
import { Logger } from "../../src/logger";
import { omit } from "lodash";

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
        await request(app).post(clinicBaseUrl).send(clinicAttrs);
        expect(createClinicSpy).toHaveBeenCalled();
      });

      it("returns statusCode 201", async () => {
        const result = await request(app).post(clinicBaseUrl).send(clinicAttrs);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });

      it("returns the clinic in the body", async () => {
        const result = await request(app).post(clinicBaseUrl).send(clinicAttrs);
        expect(result.body).toEqual(mockClinic);
      });

      it("should allow the imageUrl to be optional in the body", async () => {
        const clinicAttrsWithoutImageUrl = omit(clinicAttrs, "imageUrl");
        const result = await request(app).post(clinicBaseUrl).send(clinicAttrsWithoutImageUrl);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });
    });

    describe("error scenarios", () => {
      beforeEach(() => {
        jest.spyOn(Logger, "error").mockImplementation(() => {});
      });

      describe("route validation errors", () => {
        it.each([
          [ "name" ],
          [ "lat" ],
          [ "long" ],
          [ "address" ],
          [ "postalCode" ],
          [ "email" ],
          [ "phoneNumber" ],
        ])("should throw validation error when field does not exist (%s)", async (missingField) => {
          const clinicAttrsWithMissingKey = omit(clinicAttrs, missingField);
          const response = await request(app).post(clinicBaseUrl)
            .send(clinicAttrsWithMissingKey)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: missingField, reason: `${missingField} must be present` } ] });
        });

        it("should not allow lat that is above 90", async () => {
          const response = await request(app).post(clinicBaseUrl)
            .send({ ...clinicAttrs, lat: 91 })
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: "lat", reason: "lat must be between -90 and 90" } ] });
        });

        it("should not allow long that is above 180", async () => {
          const response = await request(app).post(clinicBaseUrl)
            .send({ ...clinicAttrs, long: 181 })
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: "long", reason: "long must be between -180 and 180" } ] });
        });
      });
    });
  });
});
