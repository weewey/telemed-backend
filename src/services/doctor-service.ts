import Doctor from "../models/doctor";
import DoctorRepository from "../respository/doctor-repository";
import {Errors} from "../errors/error-mappings";
import BusinessError from "../errors/business-error";
import TechnicalError from "../errors/technical-error";
import NotFoundError from "../errors/not-found-error";

export interface DoctorAttributes {
    firstName: string,
    lastName: string,
    email: string,
    authId: string,
    mobileNumber: string,
    onDuty: boolean,
    queueId?: number,
    clinicId?: number,
}

class DoctorService {
    public static async create(doctorAttributes: DoctorAttributes): Promise<Doctor> {
        try {
            return await DoctorRepository.create(doctorAttributes)
        } catch (e) {
            if (e.message === Errors.UNABLE_TO_CREATE_DOCTOR_VALIDATION_OR_UNIQUENESS_ERROR.code) {
                throw new BusinessError(Errors.UNABLE_TO_CREATE_DOCTOR_VALIDATION_OR_UNIQUENESS_ERROR.code,
                    Errors.UNABLE_TO_CREATE_DOCTOR_VALIDATION_OR_UNIQUENESS_ERROR.message)
            }
            if (e.message === Errors.ASSOCIATED_ENTITY_NOT_FOUND.code) {
                throw new NotFoundError(Errors.ASSOCIATED_ENTITY_NOT_FOUND.message,
                    Errors.ASSOCIATED_ENTITY_NOT_FOUND.code)
            }
            throw new TechnicalError(Errors.UNABLE_TO_CREATE_DOCTOR.message,
                Errors.UNABLE_TO_CREATE_DOCTOR.code)
        }
    }
}

export default DoctorService;