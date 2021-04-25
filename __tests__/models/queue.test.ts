import QueueStatus from "../../src/queue_status";
import Queue from "../../src/models/queue";
import {clinicFactory} from "../factories";
import Clinic from "../../src/models/clinic";
import {ForeignKeyConstraintError} from "sequelize";

describe("Queue", () => {
    let clinicId: number;
    const toBeDeletedQueueIds: number[] = []
    let queueAttributes: Partial<Queue>

    beforeAll(async () => {
        const clinic = await clinicFactory.build()
        clinicId = clinic.id
        queueAttributes = {
            "clinicId": clinicId,
            "createdAt": new Date(Date.now()),
            "updatedAt": new Date(Date.now()),
            "status": QueueStatus.CLOSED,
            "startedAt": new Date(Date.now()),
            "closedAt": new Date(Date.now())
        }
    })

    afterAll(async () => {
        console.log(toBeDeletedQueueIds)
        await Clinic.destroy({where: {id: clinicId}})
        await Queue.destroy({where: {id: toBeDeletedQueueIds}})
    })

    describe("valid", () => {
        it("should create when it has all valid attributes", async () => {
            const queue = await Queue.create(queueAttributes)
            expect(queue).toBeDefined()

            toBeDeletedQueueIds.push(queue.id)
        })

        it("should auto increment id", async () => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const queue1 = await Queue.create(queueAttributes)
            const queue2 = await Queue.create(queueAttributes)

            expect(queue1.id + 1).toEqual(queue2.id)

            toBeDeletedQueueIds.push(queue1.id, queue2.id)
        })
    })


    describe("invalid queue attributes", () => {
        describe("when status is not supported", () => {
            it("should throw an error", async () => {
                const queueAttributesWithInvalidStatus = {...queueAttributes, status: "invalid-status"}
                await expect(Queue.create(queueAttributesWithInvalidStatus))
                    .rejects.toThrow('invalid input value for enum "enum_Queues_status": "invalid-status"')
            })
        })

        describe("when clinic id is not found", () => {
            it("should throw an error", async () => {
                const queueAttributesWithClinicNotFound = {...queueAttributes, clinicId: 888}
                await expect(Queue.create(queueAttributesWithClinicNotFound))
                    .rejects.toThrow(`insert or update on table "Queues" violates foreign key constraint "Queues_clinicId_fkey"`)
            })

            it("should throw an error with sequelize foreign key error", async () => {
                const queueAttributesWithClinicNotFound = {...queueAttributes, clinicId: 888}
                await expect(Queue.create(queueAttributesWithClinicNotFound)).rejects.toThrow(ForeignKeyConstraintError)
            })
        })

    })

});