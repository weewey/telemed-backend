import { authClient, Role } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

export default class AuthService {
  public static async setRole(authId: string, role: Role): Promise<void> {
    try {
      await authClient.setRole(authId, role);
    } catch (e) {
      const errorMessage = `Failed to set role: ${role} on authId: ${authId} in Firebase. ${e.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}
