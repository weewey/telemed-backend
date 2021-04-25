import Queue, {QueueAttributes} from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import QueueService from "../../src/services/queue-service";
import BusinessError from "../../src/errors/business-error";
import {Errors} from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";
import RepositoryError from "../../src/errors/repository-error";

describe("QueueService", () => {
    beforeEach(jest.clearAllMocks)

    describe("#create", () => {
        const queueAttr: QueueAttributes = {
            clinicId: 1,
            status: QueueStatus.INACTIVE
        }

        it("should create and return a queue", async () => {
            const mockQueue = {id: 1} as any;
            jest.spyOn(QueueRepository, "create").mockResolvedValue(
                mockQueue
            )
            const queueResult = await QueueService.create(queueAttr);

            expect(queueResult).toEqual(mockQueue)
        })

        it("should throw CLINIC_NOT_FOUND business error when there is no associated clinic id", async () => {
            jest.spyOn(QueueRepository, "create").mockRejectedValue(new RepositoryError(Errors.CLINIC_NOT_FOUND.code));

            await expect(QueueService.create(queueAttr)).rejects.toThrow(new BusinessError(Errors.CLINIC_NOT_FOUND.message,
                Errors.CLINIC_NOT_FOUND.code))
        })

        describe("when a clinic already has an existing queue", () => {
            it("should not allow the same clinic to create a new queue", async () => {
                const mockActiveQueue = {id: 1, status: QueueStatus.ACTIVE, clinicId: 1} as Queue
                jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValue([mockActiveQueue]);

                await expect(QueueService.create(queueAttr)).rejects.toThrow(
                    new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message,
                        Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code))
            })
        })
    })

    describe("#getQueuesByClinicAndStatus", ()=>{
        const clinicId = 1
        const queueStatus = QueueStatus.ACTIVE

        it('should call QueueRespository#getByClinicIdAndStatus',  async ()=> {
            jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValue([]);
            await QueueService.getQueuesByClinicAndStatus(clinicId, queueStatus)

            expect(QueueRepository.getByClinicIdAndStatus).toHaveBeenCalledTimes(1)
            expect(QueueRepository.getByClinicIdAndStatus).toHaveBeenCalledWith(clinicId, queueStatus)
        });

    })
})