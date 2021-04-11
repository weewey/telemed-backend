import QueueRepository from "../../src/respository/queue_repository";
import Queue, {QueueAttributes} from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";

jest.mock("../../src/models/queue")
describe("QueueRepository", () => {

    const queueAttr: QueueAttributes = {
        clinicId: 1,
        status: QueueStatus.INACTIVE
    }

    it("call Queue#create", async () => {
        await QueueRepository.create(queueAttr)

        expect(Queue.create).toHaveBeenCalledTimes(1);
        expect(Queue.create).toBeCalledWith(queueAttr);
    })
})