/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthClient, Role } from "../../src/clients/auth-client";
import * as admin from "firebase-admin";
import { auth } from "firebase-admin/lib/auth";
import DecodedIdToken = auth.DecodedIdToken;

describe("AuthClient", () => {
  let authClient: AuthClient;
  const authId = "authId";
  const mockFirebaseAdmin = { auth: () => mockFirebaseAuthAdmin } as admin.app.App;
  const mockFirebaseAuthAdmin = {
    setCustomUserClaims: (uid, customUserClaims) => {},
    verifyIdToken: (idToken: string, checkRevoked?: boolean) => {},
  } as admin.auth.Auth;
  const userPermissions = {
    authId,
    role: Role.PATIENT,
    clinicId: 1,
  };

  beforeEach(() => {
    jest.spyOn(admin, "initializeApp").mockReturnValue(mockFirebaseAdmin);
    authClient = new AuthClient();
  });

  describe("#setPermissions", () => {
    it("should call setCustomUserClaims with the right params", async () => {
      const spy = jest.spyOn(mockFirebaseAuthAdmin, "setCustomUserClaims").mockResolvedValue(undefined);
      await authClient.setPermissions(userPermissions);
      expect(spy).toBeCalledWith(authId, {
        role: Role.PATIENT,
        clinicId: 1,
      });
    });
  });

  describe("#verifyJwtToken", () => {
    it("should call verifyIdToken with the right params", async () => {
      const token = "1";
      const spy = jest.spyOn(mockFirebaseAuthAdmin, "verifyIdToken").mockResolvedValue({} as DecodedIdToken);
      await authClient.verifyJwt(token);
      expect(spy).toBeCalledWith(token);
    });
  });
});
