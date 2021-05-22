import app from "../../src/app";
import request from "supertest";
import StaffService from "../../src/services/staff-service";
import Staff from "../../src/models/staff";
import { StatusCodes } from "http-status-codes";
import { StaffAttributes } from "../../src/respository/staff-repository";

describe("Staffs Route", () => {
  const staffsBaseUrl = "/api/v1/staffs";
  const staffAttrs: StaffAttributes = {
    firstName: "first name",
    lastName: "last name",
    email: "email@email.com",
    authId: "authId",
    mobileNumber: "999",
  };
  const mockStaff = { id: 1, firstName: "Monk", lastName: "Wong" } as Staff;

  describe("POST /", () => {
    let createStaffSpy: jest.SpyInstance;
    beforeAll(() => {
      createStaffSpy = jest.spyOn(StaffService, "create").mockResolvedValue(mockStaff);
    });

    describe("success", () => {
      it("calls StaffService.create", async () => {
        await request(app).post(`${staffsBaseUrl}`).send(staffAttrs);
        expect(createStaffSpy).toHaveBeenCalled();
      });

      it("returns statusCode 201", async () => {
        const result = await request(app).post(`${staffsBaseUrl}`).send(staffAttrs);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });

      it("returns the staff in the body", async () => {
        const result = await request(app).post(`${staffsBaseUrl}`).send(staffAttrs);
        expect(result.body).toEqual(mockStaff);
      });
    });
  });
});
