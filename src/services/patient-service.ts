import Patient from "../models/patient";
import patientRepository from "../respository/patient-repository";

export interface PatientAttributes {
    firstName: any;
    lastName: any;
    email: any;
    authId: any;
    mobileNumber: any;
}

class PatientService {

    public static async create(patient: PatientAttributes): Promise<Patient> {
        return patientRepository.create(patient)
    }
}

export default PatientService;