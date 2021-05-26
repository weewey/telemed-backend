import app from "../../src/app";
import request from "supertest";
import ClinicStaffsService from "../../src/services/clinic-staffs-service";
import ClinicStaffs from "../../src/models/clinic-staffs";
import { StatusCodes } from "http-status-codes";
import { ClinicStaffsAttributes } from "../../src/respository/clinic-staffs-repository";

describe("ClinicStaffs Route", () => {
  const clinicStaffsBaseUrl = "/api/v1/clinic-staffs";
  const clinicStaffsAttrs: ClinicStaffsAttributes = {
    firstName: "first name",
    lastName: "last name",
    email: "email@email.com",
    authId: "authId",
    mobileNumber: "999",
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
  });
});
