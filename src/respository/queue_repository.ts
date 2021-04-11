import Queue, {QueueAttributes} from "../models/queue";

class QueueRepository {

    public static async create(queueAttr: QueueAttributes): Promise<Queue> {
        return Queue.create(queueAttr)
    }
}

export default QueueRepository;