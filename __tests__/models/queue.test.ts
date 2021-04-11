import QueueStatus from "../../src/queue_status";
import Queue from "../../src/models/queue";
import {clinicFactory} from "../factories";
import Clinic from "../../src/models/clinic";

describe("Queue", () => {
    const queueId = 999;
    const clinicId = 1

    beforeAll(async () => {
        await Clinic.destroy({where: {id: clinicId}})
        await clinicFactory.build({id: clinicId})
    })

    afterEach(() => {
        Queue.destroy({where: {id: queueId}});
    })

    afterAll(async () => {
        await Clinic.destroy({where: {id: clinicId}})
    })


    const queueAttributes: Partial<Queue> = {
        "id": queueId, "clinicId": clinicId,
        "createdAt": new Date(Date.now()),
        "updatedAt": new Date(Date.now()),
        "status": QueueStatus.CLOSED,
        "startedAt": new Date(Date.now()),
        "closedAt": new Date(Date.now())
    }

    it("should be valid", async () => {
        const queue = await Queue.create(queueAttributes)
        expect(queue.id).toEqual(queueId)
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
        })

    })

});