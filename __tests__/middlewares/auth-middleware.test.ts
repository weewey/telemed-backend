/* eslint-disable @typescript-eslint/no-unused-vars */
import { authMiddleware } from "../../src/middlewares/auth-middleware";
import { Request, Response } from "express";
import AuthService from "../../src/services/auth-service";
import { auth } from "firebase-admin/lib/auth";
import UnauthenticatedError from "../../src/errors/unauthenticated-error";
import DecodedIdToken = auth.DecodedIdToken;

describe("authMiddleware", () => {
  const authenticatedReq = { get: (key: string) => { return "auth"; } } as Request;
  const unauthenticatedReq = { get: (key: string) => { return ""; } } as Request;
  const mockResJson = { json: (body: string) => {} };
  const res = { status: (code: Number) => {
    return mockResJson;
  } } as unknown as Response;
  const next = jest.fn();

  describe("success", () => {
    beforeEach(() => {
      jest.spyOn(AuthService, "verifyJwt").mockResolvedValue({} as DecodedIdToken);
    });

    it("should call next", async () => {
      await authMiddleware(authenticatedReq, res, next);
      expect(next).toBeCalled();
    });
  });

  describe("errors", () => {
    describe("when AuthService errors", () => {
      beforeEach(() => {
        jest.spyOn(AuthService, "verifyJwt").mockRejectedValue(new UnauthenticatedError("unauthenticated message"));
      });

      it("should call res.status with the expected", async () => {
        const spy = jest.spyOn(mockResJson, "json").mockReturnValue();
        await authMiddleware(authenticatedReq, res, next);
        expect(spy).toBeCalledWith({ "error": {
          "message": "unauthenticated message",
          "type": "authentication",
        } });
      });
    });
  });

  describe("when the authToken is missing", () => {
    it("should call res.status with the expected", async () => {
      const spy = jest.spyOn(mockResJson, "json").mockReturnValue();
      await authMiddleware(unauthenticatedReq, res, next);
      expect(spy).toBeCalledWith({
        "error": {
          "message": "Missing authorization header",
          "type": "authentication",
        },
      });
    });
  });
});
