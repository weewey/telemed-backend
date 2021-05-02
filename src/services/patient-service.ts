import Patient from "../models/patient";
import patientAttributes from "../respository/patient-repository";

export interface PatientAttributes {
    firstName: any;
    lastName: any;
    email: any;
    authId: any;
    mobileNumber: any;
}

class PatientService {

    public static async create(patient: PatientAttributes): Promise<Patient> {
        return patientAttributes.create(patient)
    }
}

export default PatientService;