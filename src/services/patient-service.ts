import Patient from "../models/patient";
import patientRepository from "../respository/patient-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";
export interface PatientAttributes {
    firstName: string;
    lastName: string;
    email: string;
    authId: string;
    mobileNumber: string;
}

class PatientService {

    public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
        try {
            return await patientRepository.create(patientAttributes)
        } catch (error) {
            throw mapRepositoryErrors(error);
        }
    }
}

export default PatientService;