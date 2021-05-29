import * as admin from "firebase-admin";

export enum Role {
  Patient = "PATIENT",
  Doctor = "DOCTOR",
  ClinicStaff = "CLINIC-STAFF",
}

export interface UserPermissions {
  role: Role,
  clinicId?: number
}

export class AuthClient {
  private firebaseAuthAdmin: admin.auth.Auth;

  constructor() {
    this.firebaseAuthAdmin = admin.initializeApp().auth();
  }

  public async setPermissions(authId: string, permissions: UserPermissions): Promise<void> {
    await this.firebaseAuthAdmin.setCustomUserClaims(authId, { ...permissions });
  }
}

export const authClient = new AuthClient();
