import RepositoryError from "../../src/errors/repository-error";
import Clinic from "../../src/models/clinic";
import ClinicRepository from "../../src/respository/clinic-repository";
import clinicService from "../../src/services/clinic-service";
import * as handleRepositoryErrors from "../../src/services/helpers/handle-repository-errors";
import { getClinicAttrs } from "../helpers/clinic-helpers";
describe("Clinic service", () => {
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
        jest.spyOn(handleRepositoryErrors, "mapRepositoryErrors").mockReturnValue(
          new Error("MockError"),
        );
        await expect(clinicService.create(clinicAttrs)).rejects.toThrowError(new Error("MockError"));
      });
    });
  });

  describe("#getClinicById", () => {
    let findByPkSpy: jest.SpyInstance;

    it("should call Clinic.findByPk", async () => {
      findByPkSpy = jest.spyOn(Clinic, "findByPk").mockResolvedValue(null);
      await clinicService.getClinicById("1");

      expect(findByPkSpy).toHaveBeenCalled();
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
