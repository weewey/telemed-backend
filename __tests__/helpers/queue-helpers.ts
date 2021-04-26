import Queue from "../../src/models/queue"
import QueueStatus from "../../src/queue_status"

export const createQueue = (
    clinicId = 191919, status =  QueueStatus.INACTIVE, startedAt = new Date()): Promise<Queue> => {
    return Queue.create({ clinicId, status, startedAt });
}

export const destroyQueueById = async (id: number): Promise<void> => {
    await Queue.destroy({ where: { id } });
}

export const destroyQueuesByIds = async (ids: number[]): Promise<void> => {
    await Queue.destroy({ where: { id: ids } });
}

export const getQueueById = (id: number): Promise<Queue | null> => {
    return Queue.findByPk(id);
}

export const getQueueIdsByClinicId = async (clinicId: number): Promise<number[]> => {
    const queues =  await Queue.findAll({ where: { clinicId }});
    return queues.map((queue) => queue.id )
}