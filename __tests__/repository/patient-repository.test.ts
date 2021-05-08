import Patient from "../../src/models/patient";
import { PatientAttributes } from "../../src/services/patient-service";
import PatientRepository from "../../src/respository/patient-repository";
import { UniqueConstraintError, ValidationErrorItem } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";

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

        it("should throw repository error when faced with DB unique constraint error during create", async () => {
            jest.spyOn(Patient, "create").mockRejectedValue(new UniqueConstraintError({
                errors: [ new ValidationErrorItem() ]
            }));

            await expect(PatientRepository.create).rejects.toThrow(RepositoryError)
        })


        it("should throw error as is when DB throws non-unique constraint error", async () => {
            jest.spyOn(Patient, "create").mockRejectedValue(new Error);

            await expect(PatientRepository.create).rejects.toThrow(Error)
        })
    });

})