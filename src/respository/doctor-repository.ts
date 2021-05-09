import {DoctorAttributes} from "../services/doctor-service";
import Doctor from "../models/doctor";
import {ForeignKeyConstraintError, UniqueConstraintError, ValidationError} from "sequelize";
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
            if (error instanceof UniqueConstraintError) {
                const {errorFields, errorMessage} = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors)
                const message = `Unable to create doctor. Fields: [${errorFields}], message: [${errorMessage}]`;
                Logger.error(message)
                throw new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, message);
            }
            if (error instanceof ValidationError) {
                const {errorFields, errorMessage} = mapSequelizeErrorsToErrorFieldsAndMessage(error.errors)
                const message = `Unable to create doctor. Fields: [ ${errorFields}], message: [ ${errorMessage}]`;
                Logger.error(message)
                throw new RepositoryError(Errors.VALIDATION_ERROR.code, message);
            }
            if (error instanceof ForeignKeyConstraintError) {
                const message = `Unable to create doctor ${error.fields} ${error.message}}`;
                Logger.error(message)
                throw new RepositoryError(Errors.ASSOCIATED_ENTITY_NOT_PRESENT.code, message);
            }
            throw error;
        }
        return doctor;
    }
}

export default DoctorRepository;