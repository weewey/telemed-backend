import Clinic from "../../src/models/clinic";
import clinicService from "../../src/services/clinic-service";

describe("Clinic service", () => {
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
