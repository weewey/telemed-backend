import {QueueAttributes} from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import QueueService from "../../src/services/queue-service";
import QueueRepository from "../../src/respository/queue_repository";


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
    })
})