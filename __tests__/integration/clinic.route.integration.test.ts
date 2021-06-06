import { StatusCodes } from "http-status-codes";
import request from "supertest";
import app from "../../src/app";
import { Errors } from "../../src/errors/error-mappings";
import { destroyClinicById, getClinicAttrs } from "../helpers/clinic-helpers";

describe("#Patient Component", () => {
  const CLINIC_PATH = "/api/v1/clinics";

  describe("#POST /clinic", () => {
    const clinicIdsToDestroy: number[] = [];
    const clinicAttrs = getClinicAttrs();

    afterAll(async () => {
      await destroyClinicById(clinicIdsToDestroy);
    });

    it("should create Patient successfully", async () => {
      const response = await request(app)
        .post(CLINIC_PATH)
        .send(clinicAttrs)
        .expect(StatusCodes.CREATED);

      expect(response.body).toEqual(expect.objectContaining({
        id: expect.any(Number),
        name: clinicAttrs.name,
        imageUrl: clinicAttrs.imageUrl,
        lat: clinicAttrs.lat,
        long: clinicAttrs.long,
        address: clinicAttrs.address,
        postalCode: clinicAttrs.postalCode,
        email: clinicAttrs.email,
        phoneNumber: clinicAttrs.phoneNumber,
      }));
      clinicIdsToDestroy.push(response.body.id);
    });

    describe("Error Scenarios", () => {
      it.each([
        [ [ "email" ], { email: "repeatedEmail@qdoc.com" } ],
        [ [ "name", "postalCode" ], { name: "repeated clinic", postalCode: "123456" } ],
      ])("should throw error when creating clinic with [%s] that already exists", async (fieldNames, field) => {
        await request(app).post(CLINIC_PATH).send({ ...getClinicAttrs(), ...field });

        const response = await request(app)
          .post(CLINIC_PATH)
          .send({ ...getClinicAttrs(), ...field })
          .expect(StatusCodes.BAD_REQUEST);

        const errorFields = fieldNames.join(" ");
        const errorMessage = fieldNames.map(v => `${v} must be unique`).join(" ");

        expect(response.body).toMatchObject({
          error: {
            message: `Unable to create clinic. Fields: [${errorFields} ], message: [${errorMessage} ]`,
            code: Errors.FIELD_ALREADY_EXISTS.code,
          },
        });

        clinicIdsToDestroy.push(response.body.id);
      });
    });
  });
});
