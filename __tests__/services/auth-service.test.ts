import AuthService from "../../src/services/auth-service";
import { authClient, Role } from "../../src/clients/auth-client";
import TechnicalError from "../../src/errors/technical-error";

describe("AuthService", () => {
  const authId = "authId";
  const role = Role.PATIENT;
  const clinicId = 1;

  describe("#setPermissions", () => {
    it("should call authClient.setPermissions with the right params", async () => {
      const spy = jest.spyOn(authClient, "setPermissions").mockResolvedValue(undefined);
      await AuthService.setPermissions(authId, role, clinicId);
      expect(spy).toBeCalledWith(authId, { role, clinicId });
    });

    describe("when there is no clinicId", () => {
      it("should call authClient.setPermissions with no clinicId", async () => {
        const spy = jest.spyOn(authClient, "setPermissions").mockResolvedValue(undefined);
        await AuthService.setPermissions(authId, role);
        expect(spy).toBeCalledWith(authId, { role });
      });

      it("should call authClient.setPermissions with no clinicId when clinicId is undefined", async () => {
        const spy = jest.spyOn(authClient, "setPermissions").mockResolvedValue(undefined);
        await AuthService.setPermissions(authId, role, undefined);
        expect(spy).toBeCalledWith(authId, { role });
      });
    });

    describe("when it errors", () => {
      it("should return TechnicalError", async () => {
        jest.spyOn(authClient, "setPermissions")
          .mockRejectedValue(new Error("firebase error"));
        await expect(AuthService.setPermissions(authId, role)).rejects
          .toEqual(new TechnicalError("Failed to set role: PATIENT on authId: authId in Firebase. firebase error"));
      });
    });
  });
});
