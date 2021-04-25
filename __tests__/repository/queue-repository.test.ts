import Queue, {QueueAttributes} from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import {ForeignKeyConstraintError} from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import {Errors} from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";


describe("QueueRepository", () => {

    const queueAttr: QueueAttributes = {
        clinicId: 1,
        status: QueueStatus.INACTIVE
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('#create', function () {
        it("should call Queue#create", async () => {
            jest.spyOn(Queue, "create").mockResolvedValue();
            await QueueRepository.create(queueAttr)

            expect(Queue.create).toHaveBeenCalledTimes(1);
            expect(Queue.create).toBeCalledWith(queueAttr);
        })

        describe('Error scenarios', () => {
            it("should return CLINIC_NOT_FOUND error when there is no associated foreign key Clinic Id", async () => {
                jest.spyOn(Queue, "create").mockRejectedValue(new ForeignKeyConstraintError({}));

                await expect(QueueRepository.create(queueAttr)).rejects.toThrow(RepositoryError);
                await expect(QueueRepository.create(queueAttr)).rejects.toThrow(Errors.CLINIC_NOT_FOUND.code);
            })
        });
    });

    describe('#get', function () {
        const mockQueue = {id: 1, status: QueueStatus.ACTIVE, clinicId: 1} as Queue

        describe('when status is passed in', function () {
            it("should call Queue#findAll with the right params", async () => {
                jest.spyOn(Queue, "findAll").mockResolvedValue([mockQueue]);

                await QueueRepository.getByClinicIdAndStatus(mockQueue.clinicId, mockQueue.status)

                expect(Queue.findAll).toHaveBeenCalledTimes(1);
                expect(Queue.findAll).toBeCalledWith({
                    where: {
                        clinicId: mockQueue.clinicId,
                        status: mockQueue.status,
                    }
                });
            })
        });

        describe('when no status is passed in', function () {
            it('should get all queues by clinic id', async () => {
                jest.spyOn(Queue, "findAll").mockResolvedValue([mockQueue]);

                await QueueRepository.getByClinicIdAndStatus(mockQueue.clinicId)

                expect(Queue.findAll).toHaveBeenCalledTimes(1);
                expect(Queue.findAll).toBeCalledWith(
                    {
                        where: {
                            clinicId: mockQueue.clinicId
                        }
                    });
            });
        });

    });


})