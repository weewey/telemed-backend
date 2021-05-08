import {DoctorAttributes} from "../services/doctor-service";
import Doctor from "../models/doctor";
import {UniqueConstraintError, ValidationError} from "sequelize";
import {Logger} from "../logger";
import RepositoryError from "../errors/repository-error";
import {Errors} from "../errors/error-mappings";
import {mapSequelizeErrorsToErrorFieldsAndMessage} from "../utils/helpers";

class DoctorRepository {

    public static async create(doctorAttributes: DoctorAttributes): Promise<Doctor> {
        let doctor: Doctor;
        try {
            doctor = await Doctor.create(doctorAttributes)
        } catch (error) {
            if (error instanceof UniqueConstraintError || error instanceof ValidationError) {
                const {errorFields, errorMessage} = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors)
                Logger.error(`Unable to create doctor ${errorFields} ${errorMessage}`)
                throw new RepositoryError(Errors.UNABLE_TO_CREATE_DOCTOR_VALIDATION_OR_UNIQUENESS_ERROR.code);
            }
            throw error;
        }
        return doctor;
    }
}

export default DoctorRepository;