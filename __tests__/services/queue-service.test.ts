import Queue, {QueueAttributes, QueueAttributesWithId} from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import QueueService from "../../src/services/queue-service";
import BusinessError from "../../src/errors/business-error";
import {Errors} from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";
import RepositoryError from "../../src/errors/repository-error";
import NotFoundError from "../../src/errors/not-found-error";
import TechnicalError from "../../src/errors/technical-error";

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

        describe('Error scenarios', () => {
            it("should throw 400 business error QUEUE_CREATION_NO_CLOSED_STATUS when status in request is Closed", async () => {
                await expect(QueueService.create({ ...queueAttr, status: QueueStatus.CLOSED })).rejects.toThrow(
                    new BusinessError(Errors.QUEUE_CREATION_NO_CLOSED_STATUS.message, Errors.QUEUE_CREATION_NO_CLOSED_STATUS.code))
            })

            it("should throw 404 NotFound error CLINIC_NOT_FOUND when there is no associated clinic id", async () => {
                jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValue([]);
                jest.spyOn(QueueRepository, "create").mockRejectedValue(new RepositoryError(Errors.CLINIC_NOT_FOUND.code));

                await expect(QueueService.create(queueAttr)).rejects.toThrow(new NotFoundError(Errors.CLINIC_NOT_FOUND.message,
                    Errors.CLINIC_NOT_FOUND.code))
            })

            it(`should throw 400 business error UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS and not allow the
                    same clinic to create a new queue`, async () => {
                const mockActiveQueue = {id: 1, status: QueueStatus.ACTIVE, clinicId: 1} as Queue
                jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValue([mockActiveQueue]);

                await expect(QueueService.create(queueAttr)).rejects.toThrow(
                    new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.message,
                        Errors.UNABLE_TO_CREATE_QUEUE_AS_ACTIVE_QUEUE_EXISTS.code))
            })


            it("should throw 500 Technical error UNABLE_TO_CREATE_QUEUE when creating queue fails, not due to known reasons", async () => {
                jest.spyOn(QueueRepository, "getByClinicIdAndStatus").mockResolvedValue([]);
                jest.spyOn(QueueRepository, "create").mockRejectedValue(new Error("some DB problem"));

                await expect(QueueService.create(queueAttr)).rejects.toThrow(new TechnicalError(Errors.UNABLE_TO_CREATE_QUEUE.message,
                    Errors.UNABLE_TO_CREATE_QUEUE.code))
            })


        });
    })

    describe("#update", () => {
        const queueAttr: QueueAttributesWithId = {
            id: 333,
            clinicId: 1,
            status: QueueStatus.INACTIVE
        }

        it("should update if there is an existing queue given queue id", async () => {
            jest.spyOn(QueueRepository, "update").mockResolvedValue();
            await QueueService.update(queueAttr);

            expect(QueueRepository.update).toHaveBeenCalledTimes(1);
            expect(QueueRepository.update).toHaveBeenCalledWith(queueAttr);

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