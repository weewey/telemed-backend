import request from "supertest";
import app from "../../src/app";
import MobileService from "../../src/services/mobile-service";
import { VerificationInstance } from "twilio/lib/rest/verify/v2/service/verification";
import { VerificationCheckInstance } from "twilio/lib/rest/verify/v2/service/verificationCheck";
import { StatusCodes } from "http-status-codes";
import BusinessError from "../../src/errors/business-error";

describe("MobileRoute", () => {
  const mobileBaseUrl = "/api/v1/mobile";
  describe("POST /send-verification-token", () => {
    describe("success", () => {
      it("calls MobileService.verifyMobileNumber", async () => {
        jest.spyOn(MobileService, "verifyMobileNumber")
          .mockResolvedValue({ toJSON: () => {} } as VerificationInstance);

        const verifyMobileNumberRequest = { mobileNumber: "123" };
        const response = await request(app)
          .post(`${mobileBaseUrl}/send-verification-token`)
          .send(verifyMobileNumberRequest);

        expect(response.status).toEqual(StatusCodes.OK);
      });
    });
  });

  describe("POST /verify-token", () => {
    describe("success", () => {
      it("returns 200", async () => {
        jest.spyOn(MobileService, "checkVerificationCode")
          .mockResolvedValue({ toJSON: () => {}, valid: true } as VerificationCheckInstance);

        const isVerificationCodeValidRequest = { mobileNumber: "123", token: "1" };
        const response = await request(app).post(`${mobileBaseUrl}/verify-token`)
          .send(isVerificationCodeValidRequest);

        expect(response.status).toEqual(StatusCodes.OK);
      });
    });

    describe("error", () => {
      it("returns 400", async () => {
        jest.spyOn(MobileService, "checkVerificationCode")
          .mockRejectedValue(new BusinessError("code", "message"));

        const isVerificationCodeValidRequest = { mobileNumber: "123", token: "1" };
        const response = await request(app).post(`${mobileBaseUrl}/verify-token`)
          .send(isVerificationCodeValidRequest);

        expect(response.status)
          .toEqual(StatusCodes.BAD_REQUEST);
      });
    });
  });
});
