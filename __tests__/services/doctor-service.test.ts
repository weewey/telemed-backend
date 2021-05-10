import DoctorRepository from "../../src/respository/doctor-repository";
import Doctor from "../../src/models/doctor";
import DoctorService, {DoctorAttributes} from "../../src/services/doctor-service";
import {v4 as generateUUID} from "uuid";
import RepositoryError from "../../src/errors/repository-error";
import {Errors} from "../../src/errors/error-mappings";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import NotFoundError from "../../src/errors/not-found-error";

describe('Doctor Service', () => {
    const getDoctorAttrs = (overrideAttrs?: Partial<DoctorAttributes>): DoctorAttributes => {
        return {
            authId: generateUUID(), email: `${generateUUID()}@gmail.com`, firstName: "first name",
            lastName: "last", mobileNumber: generateUUID(), onDuty: false,
            ...overrideAttrs
        }
    }

    it('should call DoctorRepository.create with the right params', async () => {
        const spy = jest.spyOn(DoctorRepository, "create").mockResolvedValue({} as Doctor)
        const doctorAttrs = getDoctorAttrs()
        await DoctorService.create(doctorAttrs)
        expect(spy).toBeCalledWith(doctorAttrs)
    });

    describe('when DoctorRepository errors', () => {
        it('should throw BusinessError when the error is due to uniqueness/validation', async () => {
            jest.spyOn(DoctorRepository, "create").mockRejectedValue(
                new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "message"))
            const doctorAttrs = getDoctorAttrs()
            await expect(DoctorService.create(doctorAttrs)).rejects.toThrowError(BusinessError)
        });

        it('should throw NotFoundError when the error is due to associated entity not found', async () => {
            jest.spyOn(DoctorRepository, "create").mockRejectedValue(
                new RepositoryError(Errors.ENTITY_NOT_FOUND.code, "not found"))
            const doctorAttrs = getDoctorAttrs()
            await expect(DoctorService.create(doctorAttrs)).rejects.toThrowError(NotFoundError)
        });

        it('should throw TechnicalError when it encounters other errors', async () => {
            jest.spyOn(DoctorRepository, "create").mockRejectedValue(
                new RepositoryError("other error code", "message"))
            const doctorAttrs = getDoctorAttrs()
            await expect(DoctorService.create(doctorAttrs)).rejects.toThrowError(TechnicalError)
        });
    });
});