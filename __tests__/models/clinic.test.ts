import { omit } from "lodash";
import { UniqueConstraintError, ValidationError } from "sequelize";
import Clinic from "../../src/models/clinic";
import { getClinicAttrs } from "../helpers/clinic-helpers";

describe("Clinic", () => {
  const clinicIdsToBeDeleted: Array<number> = [];

  afterAll(async () => {
    await Clinic.destroy({ where: { id: clinicIdsToBeDeleted } });
  });

  describe("valid", () => {
    it("should create when it has all valid attributes", async () => {
      const clinicAttrs = getClinicAttrs();
      const clinic = await Clinic.create(clinicAttrs);
      expect(clinic).toBeDefined();

      clinicIdsToBeDeleted.push(clinic.id);
    });
  });

  describe("invalid scenarios", () => {
    describe("Uniqueness Errors", () => {
      let clinic1: Clinic;
      const clinic1Attrs = getClinicAttrs();
      beforeAll(async () => {
        clinic1 = await Clinic.create(clinic1Attrs);
      });

      afterAll(() => {
        clinicIdsToBeDeleted.push(clinic1.id);
      });

      it("should return UniqueConstraintError when the phoneNumber is not unique", async () => {
        const clinic2Attrs = getClinicAttrs({ phoneNumber: clinic1.phoneNumber });
        await expect(Clinic.create(clinic2Attrs))
          .rejects
          .toThrowError(UniqueConstraintError);
      });

      it("should return UniqueConstraintError when the email is not unique", async () => {
        const clinic2Attrs = getClinicAttrs({ email: clinic1.email });
        await expect(Clinic.create(clinic2Attrs))
          .rejects
          .toThrowError(UniqueConstraintError);
      });
    });

    describe("ValidationError", () => {
      it("should return ValidationError when the email is not valid", async () => {
        const clinicAttrs = getClinicAttrs({ email: "invalid-email" });
        await expect(Clinic.create(clinicAttrs))
          .rejects
          .toEqual(new ValidationError("Validation error: Invalid email"));
      });

      it("should return ValidationError when the imageUrl is not valid url", async () => {
        const clinicAttrs = getClinicAttrs({ imageUrl: "invalid-url" });
        await expect(Clinic.create(clinicAttrs))
          .rejects
          .toEqual(new ValidationError("Validation error: Invalid imageUrl"));
      });

      it("should return Validation error when lat is invalid", async () => {
        const clinicAttrs = getClinicAttrs({ lat: -91 });
        await expect(Clinic.create(clinicAttrs))
          .rejects
          .toEqual(new ValidationError("Validation error: Validation min on lat failed"));
      });

      it("should return Validation error when long is invalid", async () => {
        const clinicAttrs = getClinicAttrs({ long: 181 });
        await expect(Clinic.create(clinicAttrs))
          .rejects
          .toEqual(new ValidationError("Validation error: Validation max on long failed"));
      });
    });

    it.each([ [ "lat" ],
      [ "long" ] ])("should return an error when %s is null", async (field) => {
      const clinicAttrs = omit(getClinicAttrs(), field);
      await expect(Clinic.create(clinicAttrs))
        .rejects
        .toEqual(new ValidationError(`notNull Violation: Clinic.${field} cannot be null`));
    });
  });
});
