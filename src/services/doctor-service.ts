import Doctor from "../models/doctor";
import DoctorRepository from "../respository/doctor-repository";
import { mapRepositoryErrors } from "./helpers/handle-repository-errors";

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
        return this.createDoctor(doctorAttributes);
    }

    private static async createDoctor(doctorAttributes: DoctorAttributes): Promise<Doctor> {
        try {
            return await DoctorRepository.create(doctorAttributes)
        } catch (e) {
            throw mapRepositoryErrors(e);
        }
    }
}

export default DoctorService;