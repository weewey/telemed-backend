import Clinic, { ClinicAttributes } from "../models/clinic";
import ClinicRepository from "../respository/clinic-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
import NotFoundError from "../errors/not-found-error";
import { Errors } from "../errors/error-mappings";

class ClinicService {
  public static async create(clinicAttributes: ClinicAttributes): Promise<Clinic> {
    return this.createClinic(clinicAttributes);
  }

  private static async createClinic(clinicAttributes: ClinicAttributes): Promise<Clinic> {
    try {
      return await ClinicRepository.create(clinicAttributes);
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  public static async getClinicById(id: string): Promise<Clinic | null> {
    try {
      const clinic = await Clinic.scope("currentQueueWithDoctor").findByPk(id);
      if (clinic === null) {
        throw new NotFoundError(Errors.ENTITY_NOT_FOUND.code,
          Errors.ENTITY_NOT_FOUND.message);
      }
      return clinic;
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }

  public static async getClinics(): Promise<Clinic[]> {
    try {
      return await Clinic.scope("currentQueueWithDoctor").findAll();
    } catch (e) {
      throw mapRepositoryErrors(e);
    }
  }
}

export default ClinicService;
