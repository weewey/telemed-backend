import Doctor, {DoctorAttributes} from "../../src/models/doctor";
import {clinicFactory} from "../factories";
import {ValidationError} from "sequelize";
import QueueStatus from "../../src/queue_status";
import Queue from "../../src/models/queue";
import {v4 as generateUUID} from "uuid";

describe("Doctor", () => {
    const doctorIdsToBeDeleted: Array<number> = []
    const getDoctorAttrs = (): DoctorAttributes => {
        return {
            authId: generateUUID(), email: `${generateUUID()}@gmail.com`, firstName: "first name",
            lastName: "last", mobileNumber: generateUUID(), onDuty: false
        }
    }

    afterAll(async () => {
        await Doctor.destroy({where: {id: doctorIdsToBeDeleted}})
    })

    describe("valid", () => {
        it("should create when it has all valid attributes", async () => {
            const doctor = await Doctor.create(getDoctorAttrs())
            expect(doctor).toBeDefined()

            doctorIdsToBeDeleted.push(doctor.id)
        })

        describe('when the doctor has a queue', () => {
            let clinicId: number;
            let queueId: number;
            let doctor: Doctor

            beforeEach(async () => {
                const clinic = await clinicFactory.build()
                clinicId = clinic.id
                const queueAttributes = {
                    "clinicId": clinicId,
                    "createdAt": new Date(Date.now()),
                    "updatedAt": new Date(Date.now()),
                    "status": QueueStatus.CLOSED,
                    "startedAt": new Date(Date.now()),
                    "closedAt": new Date(Date.now())
                }
                const queue = await Queue.create(queueAttributes)
                queueId = queue.id
            });


            it("should associate correctly to queue", async () => {
                try {
                    doctor = await Doctor.create({...getDoctorAttrs(), queueId: queueId})
                } catch (e) {
                    console.log(JSON.stringify(e))
                }

                const foundDoctor = await Doctor.findOne({where: {id: doctor.id}, include: Queue})
                expect(foundDoctor?.queue?.id).toEqual(queueId)

                doctorIdsToBeDeleted.push(doctor.id)
            })
        });
    })

    describe('invalid', () => {
        it('should return an error when the email is not valid', async () => {
            await expect(Doctor.create({...getDoctorAttrs(), email: "email"})).rejects
                .toThrowError(ValidationError)
        });

        it('should return an error when the firstName is not valid', async () => {
            await expect(Doctor.create({...getDoctorAttrs(), firstName: "1234"})).rejects
                .toThrowError(ValidationError)
        });

        it('should return an error when the lastName is not valid', async () => {
            await expect(Doctor.create({...getDoctorAttrs(), lastName: "1234"})).rejects
                .toThrowError(ValidationError)
        });
    });
});