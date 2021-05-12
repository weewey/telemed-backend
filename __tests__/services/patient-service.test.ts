import Patient from "../../src/models/patient";
import patientService from "../../src/services/patient-service";
import patientRepository, { PatientAttributes } from "../../src/respository/patient-repository";

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
  });
});
