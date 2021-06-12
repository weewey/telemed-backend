import app from "../../src/app";
import request from "supertest";
import Admin from "../../src/models/admin";
import { StatusCodes } from "http-status-codes";
import { AdminAttributes } from "../../src/respository/admin-repository";
import { omit } from "lodash";
import { Logger } from "../../src/logger";
import AdminService from "../../src/services/admin-service";

describe("Admin Route", () => {
  const adminBaseUrl = "/api/v1/admins";
  const adminAttrs: AdminAttributes = {
    firstName: "first name",
    lastName: "last name",
    email: "email@email.com",
    authId: "authId",
    mobileNumber: "123456789",
  };
  const mockAdmin = { id: 1, firstName: "Monk", lastName: "Wong" } as Admin;

  describe("POST /", () => {
    let createAdminsSpy: jest.SpyInstance;
    beforeAll(() => {
      createAdminsSpy = jest.spyOn(AdminService, "create").mockResolvedValue(mockAdmin);
    });

    describe("success", () => {
      it("calls AdminsService.create", async () => {
        await request(app).post(`${adminBaseUrl}`).send(adminAttrs);
        expect(createAdminsSpy).toHaveBeenCalled();
      });

      it("returns statusCode 201", async () => {
        const result = await request(app).post(`${adminBaseUrl}`).send(adminAttrs);
        expect(result.status).toEqual(StatusCodes.CREATED);
      });

      it("returns the staff in the body", async () => {
        const result = await request(app).post(`${adminBaseUrl}`).send(adminAttrs);
        expect(result.body).toEqual(mockAdmin);
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
          const adminAttrsWithMissingKey = omit(adminAttrs, missingField);
          const response = await request(app).post(adminBaseUrl)
            .send(adminAttrsWithMissingKey)
            .expect(StatusCodes.BAD_REQUEST);

          expect(response.body.error).toMatchObject({ invalidParams: [
            { name: missingField, reason: `${missingField} must be present` } ] });
        });
      });
    });
  });
});
