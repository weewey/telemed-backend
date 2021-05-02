import { UniqueConstraintError } from "sequelize";
import Patient from "../../src/models/patient";

import { v4 as generateUUID } from "uuid";

describe("Patient", () => {
    const firstName = "patient-model-test";
    const getPatientDetails = (
        email = `${generateUUID()}@gmail.com`, authId = generateUUID()) => {
        return {
            firstName,
            lastName: "patient-last-name",
            email,
            authId
        }
    }

    afterAll(async () => {
        await Patient.destroy({ where: { firstName }})
    })

    describe("valid", () => {
        it("should create when it has all valid attributes", async () => {
            const patient = await Patient.create(getPatientDetails())
            expect(patient).toBeDefined();
        })

        it("should auto increment id", async () => {

            const patient1 = await Patient.create(getPatientDetails())
            const patient2 = await Patient.create(getPatientDetails())

            expect(patient1.id + 1).toEqual(patient2.id);
        })
    })


    describe("invalid", () => {
        describe('should throw sequelize unique key constraint error', () => {
            it("when inserting authId that exists in DB", async () => {
                const patientWithAuthId12345 = getPatientDetails(`${generateUUID()}@gmail.com`, "12345");
                await Patient.create(patientWithAuthId12345);

                await expect(Patient.create(patientWithAuthId12345)).rejects.toThrow(UniqueConstraintError)
            })

            it("when inserting email that exists in DB", async () => {
                const patientWithEmail12345 = getPatientDetails("12345@gmail.com", generateUUID());
                await Patient.create(patientWithEmail12345);

                await expect(Patient.create(patientWithEmail12345)).rejects.toThrow(UniqueConstraintError)
            })
        });

    })

});