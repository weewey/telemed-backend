import Patient from "../models/patient";
import patientRepository from "../respository/patient-repository";
import { Errors } from "../errors/error-mappings";
import TechnicalError from "../errors/technical-error";
import BusinessError from "../errors/business-error";
export interface PatientAttributes {
    firstName: any;
    lastName: any;
    email: any;
    authId: any;
    mobileNumber: any;
}

class PatientService {

    public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
        let patient;
        try {
            patient = await patientRepository.create(patientAttributes)
        } catch (error) {
            if (error.message === Errors.UNABLE_TO_CREATE_PATIENT_AS_FIELD_EXISTS.code) {
                throw new BusinessError(
                    Errors.UNABLE_TO_CREATE_PATIENT_AS_FIELD_EXISTS.message,
                    Errors.UNABLE_TO_CREATE_PATIENT_AS_FIELD_EXISTS.code)
            }
            throw new TechnicalError(Errors.UNABLE_TO_CREATE_QUEUE.message, Errors.UNABLE_TO_CREATE_QUEUE.code)
        }
        return patient;

    }
}

export default PatientService;