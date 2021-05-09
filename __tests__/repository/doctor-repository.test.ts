import {DoctorAttributes} from "../../src/services/doctor-service";
import {v4 as generateUUID} from "uuid";
import DoctorRepository from "../../src/respository/doctor-repository";
import Doctor from "../../src/models/doctor";
import {ForeignKeyConstraintError, UniqueConstraintError, ValidationError, ValidationErrorItem} from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import {Logger} from "../../src/logger";
import {Errors} from "../../src/errors/error-mappings";

describe('Doctor Repository', () => {
    const getDoctorAttrs = (overrideAttrs?: Partial<DoctorAttributes>): DoctorAttributes => {
        return {
            authId: generateUUID(), email: `${generateUUID()}@gmail.com`, firstName: "first name",
            lastName: "last", mobileNumber: generateUUID(), onDuty: false,
            ...overrideAttrs
        }
    }

    beforeEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        jest.spyOn(Logger, "error").mockImplementation(() => {
        });
    })

    describe('success', () => {
        it('should call Doctor with the expected attributes', async () => {
            const doctorAttrs = getDoctorAttrs()
            const spy = jest.spyOn(Doctor, "create").mockResolvedValue()
            await DoctorRepository.create(doctorAttrs)
            expect(spy).toBeCalledWith(doctorAttrs)
        });
    });

    describe('errors', () => {
        describe('when it encounters UniqueConstraintError', () => {
            it('should return repository error', async () => {
                const doctorAttrs = getDoctorAttrs()
                jest.spyOn(Doctor, "create").mockRejectedValue(
                    new UniqueConstraintError({
                        errors: [new ValidationErrorItem("email must be unique",
                            "email", "email")]
                    }))
                await expect(DoctorRepository.create(doctorAttrs)).rejects.toThrowError(RepositoryError)
            });

            it('should return the expected error code', async () => {
                const doctorAttrs = getDoctorAttrs()
                jest.spyOn(Doctor, "create").mockRejectedValue(
                    new UniqueConstraintError({
                        errors: [new ValidationErrorItem("email must be unique",
                            "email", "email")]
                    }))
                await expect(DoctorRepository.create(doctorAttrs)).rejects.toThrowError(
                    Errors.UNABLE_TO_CREATE_DOCTOR_VALIDATION_OR_UNIQUENESS_ERROR.code
                )
            });
        });

        describe('when it encounters ValidationError', () => {
            it('should return repository error with the validation error code', async () => {
                const doctorAttrs = getDoctorAttrs({email: "123"})
                jest.spyOn(Doctor, "create").mockRejectedValue(
                    new ValidationError( "Validation isEmail on email failed",
                        [new ValidationErrorItem("email must be unique", "email")]
                    ))
                await expect(DoctorRepository.create(doctorAttrs)).rejects.toThrowError(
                    Errors.UNABLE_TO_CREATE_DOCTOR_VALIDATION_OR_UNIQUENESS_ERROR.code
                )
            });
        });

        describe('when it encounters ForeignKeyConstraintError', () => {
            it('should return repository error with associated entity not found error code', async () => {
                const doctorAttrs = getDoctorAttrs({email: "123"})
                jest.spyOn(Doctor, "create").mockRejectedValue(
                    new ForeignKeyConstraintError({message: "clinicId 1 not found", fields: ["clinicId"]}))
                await expect(DoctorRepository.create(doctorAttrs)).rejects.toThrowError(
                    Errors.ASSOCIATED_ENTITY_NOT_FOUND.code
                )
            });
        });
    });

});