import * as admin from "firebase-admin";
import { auth } from "firebase-admin/lib/auth";
import DecodedIdToken = auth.DecodedIdToken;

export enum Role {
  PATIENT = "PATIENT",
  DOCTOR = "DOCTOR",
  CLINIC_STAFF = "CLINIC_STAFF",
  ADMIN = "ADMIN",
}

export interface UserPermissions {
  authId: string
  role: Role
  clinicId?: number
  doctorId?: number
  patientId?: number
  adminId?: number
  clinicStaffId?: number
}

export class AuthClient {
  private firebaseAuthAdmin: admin.auth.Auth;

  constructor() {
    this.firebaseAuthAdmin = admin.initializeApp({}).auth();
  }

  public async setPermissions(userPermissions: UserPermissions): Promise<void> {
    const { authId, ...userClaims } = userPermissions;
    await this.firebaseAuthAdmin.setCustomUserClaims(authId, userClaims);
  }

  public async verifyJwt(token: string): Promise<DecodedIdToken> {
    return this.firebaseAuthAdmin.verifyIdToken(token);
  }
}

export const authClient = new AuthClient();
