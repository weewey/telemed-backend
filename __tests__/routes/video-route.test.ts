import request from "supertest";
import app from "../../src/app";
import { StatusCodes } from "http-status-codes";
import VideoService from "../../src/services/video-service";
import { omit } from "lodash";
import { Logger } from "../../src/logger";

describe("VideoRoute", () => {
  const mobileBaseUrl = "/api/v1/video";

  beforeAll(() => {
    jest.spyOn(Logger, "error").mockImplementation(() => {});
  });

  describe("POST /token", () => {
    it("should call video service with the right params", async () => {
      jest.spyOn(VideoService, "generateToken").mockResolvedValue("token");

      const response = await request(app)
        .post(`${mobileBaseUrl}/token`)
        .send({ identity: "user", room: "room" });

      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({ token: "token" });
    });

    describe("error scenarios", () => {
      const generateTokenRequest = {
        "identity": "identity",
        "room": "room",
      };
      it.each([
        [ "identity" ],
        [ "room" ],
      ])("should throw validation error when field (%s) does not exist", async (missingField) => {
        const generateTokenRequestWithMissingField = omit(generateTokenRequest, missingField);
        const response = await request(app).post(`${mobileBaseUrl}/token`)
          .send(generateTokenRequestWithMissingField)
          .expect(StatusCodes.BAD_REQUEST);

        expect(response.body.error).toMatchObject({ invalidParams: [
          { name: missingField, reason: `${missingField} must be present` } ] });
      });
    });
  });
});
