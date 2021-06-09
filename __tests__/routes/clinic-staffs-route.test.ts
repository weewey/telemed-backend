import app from "../../src/app";
import request from "supertest";
import ClinicStaffsService from "../../src/services/clinic-staffs-service";
import ClinicStaffs from "../../src/models/clinic-staffs";
import { StatusCodes } from "http-status-codes";
import { ClinicStaffsAttributes } from "../../src/respository/clinic-staffs-repository";
import { omit } from "lodash";
import { Logger } from "../../src/logger";

describe("ClinicStaffs Route", () => {
  const clinicStaffsBaseUrl = "/api/v1/clinic-staffs";
  const clinicStaffsAttrs: ClinicStaffsAttributes = {
    firstName: "first name",
    lastName: "last name",
    email: "email@email.com",
    authId: "authId",
    mobileNumber: "123456789",
  };
  const mockClinicStaffs = { id: 1, firstName: "Monk", lastName: "Wong" } as ClinicStaffs;

  describe("POST /", () => {
    let createClinicStaffsSpy: jest.SpyInstance;
    beforeAll(() => {
      createClinicStaffsSpy = jest.spyOn(ClinicStaffsService, "create").mockResolvedValue(mockClinicStaffs);
    });

    describe("success", () => {
      it("calls ClinicStaffsService.create", async () => {
        await request(app).post(`${clinicStaffsBaseUrl}`).send(clinicStaffsAttrs);
        expect(createClinicStaffsSpy).toHaveBeenCalled();
      });

      it("returns statusCode 201", async () => {
        const result = await request(app).post(`${clinicStaffsBaseUrl}`).send(clinicStaffsAttrs);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });

      it("returns the staff in the body", async () => {
        const result = await request(app).post(`${clinicStaffsBaseUrl}`).send(clinicStaffsAttrs);
        expect(result.body).toEqual(mockClinicStaffs);
      });
    });

    describe("error scenarios", () => {
      beforeEach(() => {
        jest.spyOn(Logger, "error").mockImplementation(() => {});
      });
      describe("route validation errors", () => {
        it.each([
          [ "firstName" ],
          [ "lastName" ],
          [ "email" ],
          [ "authId" ],
          [ "mobileNumber" ],
        ])("should throw validation error when field does not exist (%s)", async (missingField) => {
          const clinicStaffAttrsWithMissingKey = omit(clinicStaffsAttrs, missingField);
          const response = await request(app).post(clinicStaffsBaseUrl)
            .send(clinicStaffAttrsWithMissingKey)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: missingField, reason: `${missingField} must be present` } ] });
        });
      });
    });
  });
});
