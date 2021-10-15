import Doctor, { DoctorAttributes, DoctorAttributesWithId } from "../models/doctor";
import {
  BaseError,
  ForeignKeyConstraintError,
  InstanceUpdateOptions,
  Op,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";
import { Logger } from "../logger";
import RepositoryError from "../errors/repository-error";
import { Errors } from "../errors/error-mappings";
import { mapSequelizeErrorToErrorMessage } from "../utils/helpers";
import NotFoundError from "../errors/not-found-error";
import { getQueryOps } from "./respository-helper";
import Clinic from "../models/clinic";

export interface FindAllDoctorAttributes {
  clinicId? :number,
  onDuty?: boolean,
  queueId?: number
}

class DoctorRepository {
  public static async create(doctorAttributes: DoctorAttributes): Promise<Doctor> {
    let doctor: Doctor;
    try {
      doctor = await Doctor.create(doctorAttributes);
    } catch (error) {
      throw this.handleCreateDoctorError(error);
    }
    return doctor;
  }

  public static async get(doctorId: number): Promise<Doctor|null> {
    return Doctor.findByPk(doctorId);
  }

  public static async findAll(findAllDoctorAttributes?: FindAllDoctorAttributes): Promise<Doctor[]> {
    if (findAllDoctorAttributes) {
      return Doctor.findAll({ where: {
        [Op.and]: getQueryOps<FindAllDoctorAttributes>(findAllDoctorAttributes),
      },
      include: Clinic });
    }
    return Doctor.findAll({ include: Clinic });
  }

  public static async update(doctorAttributesWithId: Partial<DoctorAttributesWithId>,
    options?: InstanceUpdateOptions): Promise<Doctor> {
    const { id, ...updateAttributes } = doctorAttributesWithId;
    const doctor = await Doctor.findByPk(id, options);
    if (!doctor) {
      throw new NotFoundError(Errors.ENTITY_NOT_FOUND.code, Errors.ENTITY_NOT_FOUND.message);
    }
    return doctor.update(updateAttributes, options);
  }

  private static handleCreateDoctorError(error: BaseError): RepositoryError {
    if (error instanceof UniqueConstraintError) {
      const message = mapSequelizeErrorToErrorMessage("Unable to create doctor", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
    }
    if (error instanceof ValidationError) {
      const message = mapSequelizeErrorToErrorMessage("Unable to create doctor", error.errors);
      Logger.error(message);
      throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
    }
    if (error instanceof ForeignKeyConstraintError) {
      const message = `Unable to create doctor ${error.fields} ${error.message}}`;
      Logger.error(message);
      throw new RepositoryError(Errors.ENTITY_NOT_FOUND.code, message);
    }
    throw error;
  }
}

export default DoctorRepository;
