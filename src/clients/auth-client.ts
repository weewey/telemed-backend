import * as admin from "firebase-admin";

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  CLINIC_STAFF = "CLINIC_STAFF",
  ADMIN = "ADMIN",
}

export interface UserPermissions {
  role: Role,
  clinicId?: number
}

export class AuthClient {
  private firebaseAuthAdmin: admin.auth.Auth;

  constructor() {
    this.firebaseAuthAdmin = admin.initializeApp({ projectId: "project-id" }).auth();
  }

  public async setPermissions(authId: string, permissions: UserPermissions): Promise<void> {
    await this.firebaseAuthAdmin.setCustomUserClaims(authId, { ...permissions });
  }
}

export const authClient = new AuthClient();
