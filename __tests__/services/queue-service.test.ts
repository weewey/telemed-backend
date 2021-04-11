import {QueueAttributes} from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import QueueService from "../../src/services/queue-service";
import BusinessError from "../../src/errors/business-error";
import { Errors } from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";

describe("QueueService", ()=> {
    describe("#create", ()=>{
        const queueAttr: QueueAttributes = {
            clinicId: 1,
            status: QueueStatus.INACTIVE
        }

        it("should create and return a queue", async () => {
            const mockQueue = { id: 1 } as any;
            jest.spyOn(QueueRepository, "create").mockResolvedValue(
                mockQueue
            )
            const queueResult = await QueueService.create(queueAttr);

            expect(queueResult).toEqual(mockQueue)
        })

        it("should throw CLINIC_NOT_FOUND business error when there is no associated clinic id", async () => {
            jest.spyOn(QueueRepository, "create").mockRejectedValue({ message: "failed to create", code: Errors.CLINIC_NOT_FOUND.code });

            await expect(QueueService.create(queueAttr)).rejects.toThrow(new BusinessError(Errors.CLINIC_NOT_FOUND.message, Errors.CLINIC_NOT_FOUND.code))
        })
    })
})