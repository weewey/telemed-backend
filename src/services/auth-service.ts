import { authClient, UserPermissions } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

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
}
