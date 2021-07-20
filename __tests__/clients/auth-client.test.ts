import { AuthClient, Role } from "../../src/clients/auth-client";
import * as admin from "firebase-admin";

describe("AuthClient", () => {
  describe("#setPermissions", () => {
    let authClient: AuthClient;
    const authId = "authId";
    const mockFirebaseAuthAdmin = { setCustomUserClaims:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (uid, customUserClaims) => {} } as admin.auth.Auth;
    const mockFirebaseAdmin = { auth: () => mockFirebaseAuthAdmin } as admin.app.App;
    const userPermissions = { authId, role: Role.PATIENT, clinicId: 1 };

    beforeEach(() => {
      jest.spyOn(admin, "initializeApp").mockReturnValue(mockFirebaseAdmin);
      authClient = new AuthClient();
    });

    it("should call setCustomUserClaims with the right params", async () => {
      const spy = jest.spyOn(mockFirebaseAuthAdmin, "setCustomUserClaims").mockResolvedValue(undefined);
      await authClient.setPermissions(userPermissions);
      expect(spy).toBeCalledWith(authId, { role: Role.PATIENT, clinicId: 1 });
    });
  });
});
