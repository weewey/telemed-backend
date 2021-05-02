import Patient from "../models/patient";
import { PatientAttributes } from "../services/patient-service";

class PatientRepository {

    public static async create(patientAttributes: PatientAttributes): Promise<Patient> {
        return Patient.create(patientAttributes)
    }
}

export default PatientRepository;