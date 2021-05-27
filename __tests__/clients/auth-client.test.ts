import { AuthClient, Role } from "../../src/clients/auth-client";
import * as admin from "firebase-admin";

jest.mock("firebase-admin");

describe("AuthClient", () => {
  describe("setRole", () => {
    let authClient: AuthClient;
    const authId = "authId";
    const mockFirebaseAuthAdmin = { setCustomUserClaims:
          (uid, customUserClaims) => {} } as admin.auth.Auth;
    const mockFirebaseAdmin = { auth: () => mockFirebaseAuthAdmin } as admin.app.App;

    beforeEach(() => {
      jest.spyOn(admin, "initializeApp").mockReturnValue(mockFirebaseAdmin);
      authClient = new AuthClient();
    });

    it("should call setCustomUserClaims with the right params", async () => {
      const spy = jest.spyOn(mockFirebaseAuthAdmin, "setCustomUserClaims").mockResolvedValue(undefined);
      await authClient.setRole(authId, Role.ClinicStaff);
      expect(spy).toBeCalledWith(authId, { role: Role.ClinicStaff });
    });
  });
});
