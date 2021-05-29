import { authClient, Role } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";

export default class AuthService {
  public static async setPermissions(authId: string, role: Role, clinicId?: number): Promise<void> {
    const userPermissions = clinicId ? { role, clinicId } : { role };
    try {
      await authClient.setPermissions(authId, userPermissions);
    } catch (e) {
      const errorMessage = `Failed to set role: ${role} on authId: ${authId} in Firebase. ${e.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}
