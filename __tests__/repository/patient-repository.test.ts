import Patient from "../../src/models/patient";
import PatientRepository, { PatientAttributes } from "../../src/respository/patient-repository";
import { UniqueConstraintError, ValidationErrorItem, ValidationError } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";

describe("PatientRepository", () => {
  const patientAttributes: PatientAttributes = {
    firstName: "firstName",
    lastName: "lastName-repository",
    email: "email-repository@gmail.com",
    authId: "repository-auth-Id",
    mobileNumber: "91110000",
    dateOfBirth: "1992-01-01",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("#create", () => {
    it("should call Patient#create", async () => {
      jest.spyOn(Patient, "create").mockResolvedValue();
      await PatientRepository.create(patientAttributes);

      expect(Patient.create).toHaveBeenCalledTimes(1);
      expect(Patient.create).toBeCalledWith(patientAttributes);
    });

    it("should throw repository error when faced with DB unique constraint error during create", async () => {
      jest.spyOn(Patient, "create").mockRejectedValue(new UniqueConstraintError({
        errors: [ new ValidationErrorItem() ],
      }));

      await expect(PatientRepository.create).rejects.toThrow(RepositoryError);
      await expect(PatientRepository.create).rejects.toMatchObject(
        expect.objectContaining({ code: Errors.FIELD_ALREADY_EXISTS.code }),
      );
    });

    it("should throw repository error when faced with DB validation error during create", async () => {
      jest.spyOn(Patient, "create").mockRejectedValue(
        new ValidationError("validation error", [ new ValidationErrorItem() ]),
      );

      await expect(PatientRepository.create).rejects.toThrow(RepositoryError);
      await expect(PatientRepository.create).rejects.toMatchObject(
        expect.objectContaining({ code: Errors.VALIDATION_ERROR.code }),
      );
    });

    it("should throw error as is when DB throws non-unique constraint error", async () => {
      jest.spyOn(Patient, "create").mockRejectedValue(new Error());

      await expect(PatientRepository.create).rejects.toThrow(Error);
    });
  });

  describe("getById", () => {
    it("should call Patient.findByPk", () => {
      const spy = jest.spyOn(Patient, "findByPk").mockResolvedValue(null);
      PatientRepository.getById(1);
      expect(spy).toBeCalledWith(1);
    });
  });
});
