import Patient from "../../src/models/patient";
import { PatientAttributes } from "../../src/services/patient-service";
import PatientRepository from "../../src/respository/patient-repository";

describe("PatientRepository", () => {

    const patientAttributes: PatientAttributes = {
        firstName: "firstName",
        lastName: "lastName-repository",
        email: "email-repository@gmail.com",
        authId: "repository-auth-Id",
        mobileNumber: "91110000",
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('#create', function () {
        it("should call Patient#create", async () => {
            jest.spyOn(Patient, "create").mockResolvedValue();
            await PatientRepository.create(patientAttributes)

            expect(Patient.create).toHaveBeenCalledTimes(1);
            expect(Patient.create).toBeCalledWith(patientAttributes);
        })
    });

})