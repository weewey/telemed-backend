import RepositoryError from "../../src/errors/repository-error";
import Clinic from "../../src/models/clinic";
import ClinicRepository from "../../src/respository/clinic-repository";
import clinicService from "../../src/services/clinic-service";
import * as handleRepositoryErrors from "../../src/services/helpers/handle-repository-errors";
import { getClinicAttrs } from "../helpers/clinic-helpers";
import { ModelCtor } from "sequelize/types/lib/model";
import NotFoundError from "../../src/errors/not-found-error";
import TechnicalError from "../../src/errors/technical-error";

describe("Clinic service", () => {
  beforeEach(jest.clearAllMocks);

  describe("#create", () => {
    it("should call ClinicRepository.create with the right params", async () => {
      const clinicAttrs = getClinicAttrs();
      const spy = jest.spyOn(ClinicRepository, "create").mockResolvedValue(
        {} as Clinic,
      );
      await clinicService.create(clinicAttrs);
      expect(spy).toBeCalledWith(clinicAttrs);
    });

    describe("when ClinicStaffsRepository errors", () => {
      it("should call mapRepositoryErrors with the error thrown by ClinicRepository", async () => {
        const clinicAttrs = getClinicAttrs();
        jest.spyOn(ClinicRepository, "create").mockRejectedValue(
          new RepositoryError("error-code", "message"),
        );
        const spy = jest.spyOn(handleRepositoryErrors, "mapRepositoryErrors");
        await expect(clinicService.create(clinicAttrs)).rejects.toThrowError();
        expect(spy).toBeCalledWith(new RepositoryError("error-code", "message"));
      });

      it("should throw error returned by mapRepositoryErrors", async () => {
        const clinicAttrs = getClinicAttrs();
        jest.spyOn(ClinicRepository, "create").mockRejectedValue(
          new RepositoryError("error-code", "message"),
        );
        await expect(clinicService.create(clinicAttrs))
          .rejects
          .toThrowError(new TechnicalError("message"));
      });
    });
  });

  describe("#getClinicById", () => {
    const clinic = { id: 1 } as Clinic;
    const scopeMock = { findByPk: (id: number) => {} } as ModelCtor<Clinic>;

    it("should call scope with the expected value", async () => {
      const scopeSpy = jest.spyOn(Clinic, "scope").mockReturnValue(scopeMock);
      jest.spyOn(scopeMock, "findByPk").mockResolvedValue(clinic);
      await clinicService.getClinicById("1");

      expect(scopeSpy).toHaveBeenCalledWith("currentQueueWithDoctor");
    });

    it("should call findByPk", async () => {
      jest.spyOn(Clinic, "scope").mockReturnValue(scopeMock);
      const findByPk = jest.spyOn(scopeMock, "findByPk").mockResolvedValue(clinic);
      await clinicService.getClinicById("1");

      expect(findByPk).toHaveBeenCalled();
    });

    describe("when the clinic is not found", () => {
      it("should throw NotFoundError", async () => {
        jest.spyOn(Clinic, "scope").mockReturnValue(scopeMock);
        jest.spyOn(scopeMock, "findByPk").mockResolvedValue(null);
        await expect(clinicService.getClinicById("1"))
          .rejects
          .toThrowError(NotFoundError);
      });
    });

    describe("when there is not unexpected error", () => {
      it("should throw NotFoundError", async () => {
        jest.spyOn(Clinic, "scope").mockReturnValue(scopeMock);
        jest.spyOn(scopeMock, "findByPk").mockRejectedValue(new Error("test"));
        await expect(clinicService.getClinicById("1"))
          .rejects
          .toThrowError(TechnicalError);
      });
    });
  });

  describe("#getClinics", () => {
    let findAllSpy: jest.SpyInstance;

    it("should call Clinic.findAll", async () => {
      findAllSpy = jest.spyOn(Clinic, "findAll").mockResolvedValue([]);
      await clinicService.getClinics();

      expect(findAllSpy).toHaveBeenCalled();
    });
  });
});
