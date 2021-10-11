import app from "../../src/app";
import request from "supertest";
import ClinicStaffsService from "../../src/services/clinic-staffs-service";
import ClinicStaff from "../../src/models/clinic-staff";
import { StatusCodes } from "http-status-codes";
import { ClinicStaffAttributes } from "../../src/respository/clinic-staff-repository";
import { omit } from "lodash";
import { Logger } from "../../src/logger";

describe("ClinicStaff Route", () => {
  const clinicStaffBaseUrl = "/api/v1/clinic-staffs";
  const clinicStaffAttrs: ClinicStaffAttributes = {
    firstName: "first name",
    lastName: "last name",
    email: "email@email.com",
    authId: "authId",
    mobileNumber: "123456789",
    dateOfBirth: "1990-01-01",
  };
  const mockClinicStaff = { id: 1, firstName: "Monk", lastName: "Wong" } as ClinicStaff;

  describe("POST /", () => {
    let createClinicStaffsSpy: jest.SpyInstance;
    beforeAll(() => {
      createClinicStaffsSpy = jest.spyOn(ClinicStaffsService, "create").mockResolvedValue(mockClinicStaff);
    });

    describe("success", () => {
      it("calls ClinicStaffsService.create", async () => {
        await request(app).post(`${clinicStaffBaseUrl}`).send(clinicStaffAttrs);
        expect(createClinicStaffsSpy).toHaveBeenCalled();
      });

      it("returns statusCode 201", async () => {
        const result = await request(app).post(`${clinicStaffBaseUrl}`).send(clinicStaffAttrs);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });

      it("returns the staff in the body", async () => {
        const result = await request(app).post(`${clinicStaffBaseUrl}`).send(clinicStaffAttrs);
        expect(result.body).toEqual(mockClinicStaff);
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
          const clinicStaffAttrsWithMissingKey = omit(clinicStaffAttrs, missingField);
          const response = await request(app).post(clinicStaffBaseUrl)
            .send(clinicStaffAttrsWithMissingKey)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: missingField, reason: `${missingField} must be present` } ] });
        });
      });
    });
  });
});
