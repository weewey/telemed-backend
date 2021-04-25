import Queue from "../../src/models/queue"
import QueueStatus from "../../src/queue_status"

export const createQueue = (
    clinicId = 191919, status =  QueueStatus.INACTIVE, startedAt = new Date()): Promise<Queue> => {
    return Queue.create({ clinicId, status, startedAt });
}

export const destroyQueueById = async (id: number): Promise<void> => {
    await Queue.destroy({ where: { id } });
}

export const getQueueById = (id: number): Promise<Queue | null> => {
    return Queue.findByPk(id);
}