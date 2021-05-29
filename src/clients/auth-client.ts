import * as admin from "firebase-admin";

export enum Role {
  Patient = "PATIENT",
  Doctor = "DOCTOR",
  ClinicStaff = "CLINIC-STAFF",
}

export class AuthClient {
  private firebaseAuthAdmin: admin.auth.Auth;

  constructor() {
    this.firebaseAuthAdmin = admin.initializeApp().auth();
  }

  public async setRole(authId: string, role: Role): Promise<void> {
    await this.firebaseAuthAdmin.setCustomUserClaims(authId, { role });
  }
}

export const authClient = new AuthClient();
