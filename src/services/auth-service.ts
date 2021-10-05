import { authClient, UserPermissions } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";
import { auth } from "firebase-admin/lib/auth";
import UnauthenticatedError from "../errors/unauthenticated-error";
import DecodedIdToken = auth.DecodedIdToken;

export default class AuthService {
  public static async setPermissions(userPermissions: UserPermissions): Promise<void> {
    try {
      await authClient.setPermissions(userPermissions);
    } catch (e) {
      const errorMessage = `Failed to setPermission: ${JSON.stringify(userPermissions)} in Firebase. ${e.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }

  public static async verifyJwt(token: string): Promise<DecodedIdToken> {
    try {
      return await authClient.verifyJwt(token);
    } catch (e) {
      const errorMessage = `Failed to verify valid JWT Token: ${e.message}`;
      Logger.error(errorMessage);
      throw new UnauthenticatedError(errorMessage);
    }
  }
}
