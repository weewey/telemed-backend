import Patient from "../../src/models/patient";
import patientService from "../../src/services/patient-service";
import patientRepository, { PatientAttributes } from "../../src/respository/patient-repository";
import TechnicalError from "../../src/errors/technical-error";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";

describe("Patient service", () => {
  describe("#create", () => {
    const patientAttributes: PatientAttributes = {
      firstName: "firstName",
      lastName: "lastName-service",
      email: "email-service@gmail.com",
      authId: "service-auth-Id",
      mobileNumber: "91110001",
    };
    it("should call patient repository #create", async () => {
      jest.spyOn(patientRepository, "create").mockResolvedValue({} as Patient);
      await patientService.create(patientAttributes);

      expect(patientRepository.create).toHaveBeenCalledTimes(1);
      expect(patientRepository.create).toHaveBeenCalledWith(patientAttributes);
    });

    describe("Error scenarios", () => {
      it("should throw TechnicalError when patientRepository.create throw unknown error", async () => {
        jest.spyOn(patientRepository, "create").mockRejectedValueOnce(new TechnicalError());

        await expect(patientService.create(patientAttributes)).rejects.toThrowError(TechnicalError);
      });

      it("should throw FIELD_ALREADY_EXISTS error when repo throws error with FIELD_ALREADY_EXISTS", async () => {
        jest.spyOn(patientRepository, "create").mockRejectedValueOnce(
          new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "field alry exists"),
        );

        await expect(patientService.create(patientAttributes)).rejects.toMatchObject(
          { code: Errors.FIELD_ALREADY_EXISTS.code,
            message: "field alry exists" },
        );
      });

      it("should throw VALIDATION_ERROR error when repo throws error with VALIDATION_ERROR", async () => {
        jest.spyOn(patientRepository, "create").mockRejectedValueOnce(
          new RepositoryError(Errors.VALIDATION_ERROR.code, "field validation error"),
        );

        await expect(patientService.create(patientAttributes)).rejects.toMatchObject(
          { code: Errors.VALIDATION_ERROR.code,
            message: "field validation error" },
        );
      });
    });
  });
});
