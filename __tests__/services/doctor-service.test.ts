import DoctorRepository from "../../src/respository/doctor-repository";
import Doctor, { DoctorAttributes, DoctorAttributesWithId } from "../../src/models/doctor";
import DoctorService from "../../src/services/doctor-service";
import { v4 as generateUUID } from "uuid";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import BusinessError from "../../src/errors/business-error";
import TechnicalError from "../../src/errors/technical-error";
import NotFoundError from "../../src/errors/not-found-error";
import AuthService from "../../src/services/auth-service";
import { Role } from "../../src/clients/auth-client";

describe("Doctor Service", () => {
  const getDoctorAttrs = (overrideAttrs?: Partial<DoctorAttributes>): DoctorAttributes => {
    return {
      authId: generateUUID(),
      email: `${generateUUID()}@gmail.com`,
      firstName: "first name",
      lastName: "last",
      mobileNumber: generateUUID(),
      onDuty: false,
      dateOfBirth: "1990-01-01",
      ...overrideAttrs,
    };
  };

  describe("#create", () => {
    beforeEach(() => {
      jest.spyOn(AuthService, "setPermissions").mockResolvedValue(undefined);
    });
    it("should call DoctorRepository.create with the right params", async () => {
      const spy = jest.spyOn(DoctorRepository, "create").mockResolvedValue({} as Doctor);
      const doctorAttrs = getDoctorAttrs();
      await DoctorService.create(doctorAttrs);
      expect(spy).toBeCalledWith({ ...doctorAttrs });
    });
  });

  it("should call AuthService.setPermissions with the right params", async () => {
    const doctorAttrs = getDoctorAttrs();
    jest.spyOn(DoctorRepository, "create").mockResolvedValue({ authId: doctorAttrs.authId, id: 1 } as Doctor);
    const spy = jest.spyOn(AuthService, "setPermissions").mockResolvedValue(undefined);
    await DoctorService.create(doctorAttrs);
    expect(spy).toBeCalledWith(
      {
        authId: doctorAttrs.authId,
        role: Role.DOCTOR,
        doctorId: 1,
      },
    );
  });

  describe("when DoctorRepository errors", () => {
    it("should throw BusinessError when the error is due to uniqueness/validation", async () => {
      jest.spyOn(DoctorRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.FIELD_ALREADY_EXISTS.code, "message"),
      );
      const doctorAttrs = getDoctorAttrs();
      await expect(DoctorService.create(doctorAttrs)).rejects.toThrowError(BusinessError);
    });

    it("should throw NotFoundError when the error is due to associated entity not found", async () => {
      jest.spyOn(DoctorRepository, "create").mockRejectedValue(
        new RepositoryError(Errors.ENTITY_NOT_FOUND.code, "not found"),
      );
      const doctorAttrs = getDoctorAttrs();
      await expect(DoctorService.create(doctorAttrs)).rejects.toThrowError(NotFoundError);
    });

    it("should throw TechnicalError when it encounters other errors", async () => {
      jest.spyOn(DoctorRepository, "create").mockRejectedValue(
        new RepositoryError("other error code", "message"),
      );
      const doctorAttrs = getDoctorAttrs();
      await expect(DoctorService.create(doctorAttrs)).rejects.toThrowError(TechnicalError);
    });
  });

  describe("when AuthService.setPermissions errors", () => {
    const doctorAttrs = getDoctorAttrs();
    const mockDoctor = { authId: doctorAttrs.authId,
      id: 1,
      destroy: () => {} } as Doctor;

    beforeEach(() => {
      jest.spyOn(DoctorRepository, "create").mockResolvedValue(mockDoctor);
      jest.spyOn(AuthService, "setPermissions").mockRejectedValue(new Error("test"));
    });

    it("should call doctor.destroy", async () => {
      const spy = jest.spyOn(mockDoctor, "destroy")
        .mockResolvedValue(undefined);
      await expect(DoctorService.create(doctorAttrs)).rejects.toThrowError(Error);
      expect(spy).toBeCalled();
    });

    describe("when destroy doctor errors", () => {
      it("should throw TechnicalError", async () => {
        jest.spyOn(mockDoctor, "destroy")
          .mockRejectedValue(new TechnicalError("test"));
        await expect(DoctorService.create(doctorAttrs))
          .rejects
          .toEqual(new TechnicalError("Error deleting doctor after failure to setPermissions on " +
              "AuthService. DoctorId: 1 test"));
      });
    });
  });

  describe("#update", () => {
    const doctorAttrsWithId = { id: 111, clinicId: 1 } as Partial<DoctorAttributesWithId>;
    it("should call DoctorRepository.update", () => {
      const spy = jest.spyOn(DoctorRepository, "update").mockResolvedValue({} as Doctor);
      DoctorService.update(doctorAttrsWithId);
      expect(spy).toBeCalledWith(doctorAttrsWithId, undefined);
    });
  });

  describe("getDoctors", () => {
    it("should call Doctors.findAll", async () => {
      const spy = jest.spyOn(DoctorRepository, "findAll").mockResolvedValue([]);
      await DoctorService.findDoctors({ clinicId: 1 });
      expect(spy).toBeCalledWith({ clinicId: 1 });
    });
  });

  describe("#get", () => {
    const doctorId = 1;

    it("should call doctorRespository.get", async () => {
      const spy = jest.spyOn(DoctorRepository, "get").mockResolvedValue({} as Doctor);
      await DoctorService.get(doctorId);
      expect(spy).toBeCalledWith(doctorId);
    });
  });
});
