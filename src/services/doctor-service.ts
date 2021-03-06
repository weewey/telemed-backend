import Doctor, { DoctorAttributes, DoctorAttributesWithId } from "../models/doctor";
import DoctorRepository, { FindAllDoctorAttributes } from "../respository/doctor-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import AuthService from "./auth-service";
import { Role, UserPermissions } from "../clients/auth-client";
import { Logger } from "../logger";
import TechnicalError from "../errors/technical-error";
import NotFoundError from "../errors/not-found-error";
import { Errors } from "../errors/error-mappings";
import { InstanceUpdateOptions } from "sequelize";

class DoctorService {
  public static async create(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    const doctor = await this.createDoctor(doctorAttributes);
    await this.setPermissions(doctor);
    return doctor;
  }

  public static async update(doctorAttributesWithId: Partial<DoctorAttributesWithId>,
    options?: InstanceUpdateOptions): Promise<Doctor> {
    try {
      return await DoctorRepository.update(doctorAttributesWithId, options);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  public static async findDoctors(findAllDoctorAttributes?: FindAllDoctorAttributes): Promise<Doctor[]> {
    try {
      return await DoctorRepository.findAll(findAllDoctorAttributes);
    } catch (e) {
      const errorMessage = `Error finding doctors with attrs: ${JSON.stringify(findAllDoctorAttributes)}`;
      Logger.error(`${errorMessage}: ${e.message}`);
      throw mapRepositoryErrors(e);
    }
  }

  public static async get(doctorId: number): Promise<Doctor> {
    const doctor = await DoctorRepository.get(doctorId);
    if (doctor == null) {
      throw new NotFoundError(Errors.DOCTOR_NOT_FOUND.code, Errors.DOCTOR_NOT_FOUND.message);
    }
    return doctor;
  }

  private static async createDoctor(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    try {
      return await DoctorRepository.create({ ...doctorAttributes });
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  private static async setPermissions(doctor: Doctor): Promise<void> {
    try {
      const userPermission = this.generateUserPermission(doctor);
      await AuthService.setPermissions(userPermission);
    } catch (e) {
      await this.deleteAppendErrorMessagePrefix(doctor,
        `Error deleting doctor after failure to setPermissions on AuthService. DoctorId: ${doctor.id}`);
      throw e;
    }
  }

  private static generateUserPermission(doctor: Doctor): UserPermissions {
    const permissions = {
      authId: doctor.authId,
      role: Role.DOCTOR,
      doctorId: doctor.id,
    };
    return doctor.clinicId ? { clinicId: doctor.clinicId, ...permissions } : permissions;
  }

  private static async deleteAppendErrorMessagePrefix(doctor: Doctor, errorMessagePrefix = ""): Promise<void> {
    try {
      return await doctor.destroy();
    } catch (error) {
      const errorMessage = `${errorMessagePrefix} ${error.message}`;
      Logger.error(errorMessage);
      throw new TechnicalError(errorMessage);
    }
  }
}

export default DoctorService;
