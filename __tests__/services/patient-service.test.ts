import Patient from "../../src/models/patient";
import PatientRepository, { PatientAttributes } from "../../src/respository/patient-repository";
import TechnicalError from "../../src/errors/technical-error";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import PatientService from "../../src/services/patient-service";
import AuthService from "../../src/services/auth-service";
import { Role } from "../../src/clients/auth-client";
import NotFoundError from "../../src/errors/not-found-error";

describe("Patient service", () => {
  describe("#create", () => {
    const authId = "service-auth-Id";
    const patientId = 1;
    const patientAttributes: PatientAttributes = {
      firstName: "firstName",
      lastName: "lastName-service",
      email: "email-service@gmail.com",
      authId,
      mobileNumber: "91110001",
      dateOfBirth: "1992-1-1",
    };

    beforeEach(() => {
      jest.spyOn(PatientRepository, "create").mockResolvedValue({ authId, id: patientId } as Patient);
      jest.spyOn(AuthService, "setPermissions").mockResolvedValue(undefined);
    });

    afterEach(jest.restoreAllMocks);

    it("should call patient repository #create", async () => {
      await PatientService.create(patientAttributes);

      expect(PatientRepository.create).toHaveBeenCalledWith(patientAttributes);
    });

    it("should call AuthService.setPermissions", async () => {
      await PatientService.create(patientAttributes);

      expect(AuthService.setPermissions).toHaveBeenCalledWith(
        { authId: patientAttributes.authId,
          role: Role.PATIENT,
          patientId },
      );
    });

    describe("Error scenarios", () => {
      it("should throw TechnicalError when PatientRepository.create throw unknown error", async () => {
        jest.spyOn(PatientRepository, "create").mockRejectedValueOnce(new TechnicalError());

        await expect(PatientService.create(patientAttributes)).rejects.toThrowError(TechnicalError);
      });

      it("should throw FIELD_ALREADY_EXISTS error when repo throws error with FIELD_ALREADY_EXISTS", async () => {
        jest.spyOn(PatientRepository, "create").mockRejectedValueOnce(
          new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "field alry exists"),
        );

        await expect(PatientService.create(patientAttributes)).rejects.toMatchObject(
          { code: Errors.FIELD_ALREADY_EXISTS.code,
            message: "field alry exists" },
        );
      });

      it("should throw VALIDATION_ERROR error when repo throws error with VALIDATION_ERROR", async () => {
        jest.spyOn(PatientRepository, "create").mockRejectedValueOnce(
          new RepositoryError(Errors.VALIDATION_ERROR.code, "field validation error"),
        );

        await expect(PatientService.create(patientAttributes)).rejects.toMatchObject(
          { code: Errors.VALIDATION_ERROR.code,
            message: "field validation error" },
        );
      });

      describe("when AuthService.setPermissions errors", () => {
        let spy: jest.SpyInstance;
        const mockPatient = { id: 1, destroy: () => {} } as Patient;

        beforeEach(() => {
          jest.spyOn(PatientRepository, "create").mockResolvedValue(mockPatient);
          jest.spyOn(AuthService, "setPermissions").mockRejectedValue(new Error("test"));
          spy = jest.spyOn(mockPatient, "destroy").mockResolvedValue(undefined);
        });

        it("should call patient.destroy", async () => {
          await expect(PatientService.create(patientAttributes)).rejects.toThrowError(Error);
          expect(spy).toBeCalled();
        });

        it("should bubble the error from AuthService.setPermissions", async () => {
          await expect(PatientService.create(patientAttributes))
            .rejects
            .toThrowError(new Error("test"));
        });

        describe("when patient.destroy errors", () => {
          it("should throw TechnicalError", async () => {
            spy = jest.spyOn(mockPatient, "destroy").mockRejectedValue(new Error("cannot delete"));
            await expect(PatientService.create(patientAttributes))
              .rejects
              .toThrowError(new TechnicalError("Error deleting patient " +
                  "after failure to setPermissions on AuthService. PatientId: 1 cannot delete"));
          });
        });
      });
    });
  });

  describe("getPatientById", () => {
    it("should return patient from patientRepo", async () => {
      const patient = { id: 1 } as Patient;
      jest.spyOn(PatientRepository, "getById").mockResolvedValue(patient);
      const actualPatient = await PatientService.getPatientById(1);
      expect(actualPatient).toEqual(patient);
    });

    it("should throw notFoundError if patient is null", async () => {
      jest.spyOn(PatientRepository, "getById").mockResolvedValue(null);
      await expect(PatientService.getPatientById(1)).rejects.toThrowError(NotFoundError);
    });
  });
});
