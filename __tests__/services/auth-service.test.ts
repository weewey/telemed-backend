import AuthService from "../../src/services/auth-service";
import { authClient, Role } from "../../src/clients/auth-client";
import TechnicalError from "../../src/errors/technical-error";

describe("AuthService", () => {
  const authId = "authId";
  const role = Role.Patient;

  describe("#setRole", () => {
    it("should call authClient.setRole", async () => {
      const spy = jest.spyOn(authClient, "setRole").mockResolvedValue(undefined);
      await AuthService.setRole(authId, role);
      expect(spy).toBeCalledWith(authId, role);
    });

    describe("when it errors", () => {
      it("should return TechnicalError", async () => {
        jest.spyOn(authClient, "setRole")
          .mockRejectedValue(new Error("firebase error"));
        await expect(AuthService.setRole(authId, role)).rejects
          .toEqual(new TechnicalError("Failed to set role: PATIENT on authId: authId in Firebase. firebase error"));
      });
    });
  });
});
