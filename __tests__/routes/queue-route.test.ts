import request from "supertest";
import app from "../../src/app";
import QueueService from "../../src/services/queue-service";
import Queue from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import BusinessError from "../../src/errors/business-error";
import {Errors} from "../../src/errors/error-mappings";
import {StatusCodes} from "http-status-codes";

describe('Queues Route', function () {
    const queuesPath = '/api/v1/queues';
    const clinicId = 1
    const queue = {id: 1, clinicId, status: QueueStatus.INACTIVE} as Queue

    beforeEach(jest.clearAllMocks);

    describe('POST /queues', function () {
        it("should return 201 with the expected body", async () => {
            jest.spyOn(QueueService, "create").mockResolvedValue(queue);
            await request(app).post(queuesPath)
                .send({clinicId})
                .expect(StatusCodes.CREATED)
                .expect(queue)
        });

        it("calls QueueService#create with the expected params", async () => {
            jest.spyOn(QueueService, "create").mockResolvedValue(queue);
            const expectedQueueAttr = {clinicId, status: QueueStatus.INACTIVE}

            await request(app).post(queuesPath)
                .send({clinicId})

            expect(QueueService.create).toHaveBeenCalledTimes(1);
            expect(QueueService.create).toHaveBeenCalledWith(expectedQueueAttr);
        });

        describe('when the clinicId is numeric string', () => {
            it("should call QueueService with the clinicId in numeric", async () => {
                jest.spyOn(QueueService, "create").mockResolvedValue(queue);
                await request(app).post(queuesPath)
                    .send({clinicId: '1'})
                const expectedQueueAttr = {clinicId, status: QueueStatus.INACTIVE}
                expect(QueueService.create).toHaveBeenCalledTimes(1);
                expect(QueueService.create).toHaveBeenCalledWith(expectedQueueAttr);
            })
        });

        describe('when the clinicId is not a valid number', () => {
            it("should return BAD_REQUEST with the expected body", async () => {
                await request(app).post(queuesPath)
                    .send({clinicId: "asd"})
                    .expect(StatusCodes.BAD_REQUEST)
                    .expect({error_message: 'Invalid value: clinicId'})
            })
        });

        describe('when the clinicId is not found in the DB', () => {
            it("should return NOT_FOUND with the expected body", async () => {
                jest.spyOn(QueueService, "create").mockRejectedValue(new BusinessError(Errors.CLINIC_NOT_FOUND.message, Errors.CLINIC_NOT_FOUND.code));
                await request(app).post(queuesPath)
                    .send({clinicId: 2})
                    .expect(StatusCodes.NOT_FOUND)
                    .expect({error_message: 'Clinic not found.'})
            })
        });

        describe('when the clinicId is not found in the DB', () => {
            it("should return NOT_FOUND with the expected body", async () => {
                jest.spyOn(QueueService, "create").mockRejectedValue(new BusinessError(Errors.CLINIC_NOT_FOUND.message, Errors.CLINIC_NOT_FOUND.code));
                await request(app).post(queuesPath)
                    .send({clinicId: 2})
                    .expect(StatusCodes.NOT_FOUND)
                    .expect({error_message: 'Clinic not found.'})
            })
        });

        describe('when the queue is not created due to DB error', () => {
            it("should return INTERNAL_SERVER_ERROR with the expected body", async () => {
                jest.spyOn(QueueService, "create").mockRejectedValue(new BusinessError(Errors.UNABLE_TO_CREATE_QUEUE.message, Errors.UNABLE_TO_CREATE_QUEUE.code));
                await request(app).post(queuesPath)
                    .send({clinicId: 2})
                    .expect(StatusCodes.INTERNAL_SERVER_ERROR)
                    .expect({error_message: 'Unable to create queue.'})
            })
        });

    });

    describe('PUT /queues', () => {

        describe('Successful scenarios', () => {
            const queueId = 4560956;
            const QUEUES_PUT_PATH =`${queuesPath}/${queueId}`
            it('should return 204 with the expected body', async () => {
                jest.spyOn(QueueService, "update").mockResolvedValue();
                await request(app).put(QUEUES_PUT_PATH)
                    .send({status: QueueStatus.ACTIVE})
                    .expect(StatusCodes.NO_CONTENT)
                    .expect("")
            });

            it.each([
                [ 123, "ACTIVE" ],
                [ 1234567, "INACTIVE" ],
                [ 123456789, "CLOSED" ],
                [ 123, "active" ],
                [ 4, "InActive" ],
                [ 9324, "Closed" ]
            ])("should call QueueService#update with the expected params for queueId (%s) and status (%s)", async (queueIdNo, status) => {
                jest.spyOn(QueueService, "update").mockResolvedValue();
                const expectedQueueAttr = { id: queueIdNo, status: status.toUpperCase() }

                await request(app).put(`${queuesPath}/${queueIdNo}`)
                .send({ status })

                expect(QueueService.update).toHaveBeenCalledTimes(1);
                expect(QueueService.update).toHaveBeenCalledWith(expectedQueueAttr);
            });
        });

        describe('Error scenarios', () => {

            const queueIdCanOnlyContainNumbers = "Queue Id must contain only numbers.";
            const queueIdNoLongerThanMaxLength = "Queue Id length should not be longer than 9."
            it.each([
                [ "234ggs24", queueIdCanOnlyContainNumbers ],
                [ "42532543532453345235", queueIdNoLongerThanMaxLength ],
                [ "abcfd", queueIdCanOnlyContainNumbers],
            ])('should return 400 when queueId in params has incorrect format (%s)', async (queueId, errorReason) => {
                const QUEUES_PUT_PATH =`${queuesPath}/${queueId}`
                jest.spyOn(QueueService, "update").mockResolvedValue();
                const response = await request(app).put(QUEUES_PUT_PATH)
                    .send({status: QueueStatus.ACTIVE})
                    .expect(StatusCodes.BAD_REQUEST)

                    expect(response.body).toMatchObject({
                        id: expect.anything(),
                        invalidParams: [ { name: "queueId", reason: errorReason } ],
                        type:"validation",
                      })
            });

            const statusNotAllowed = "Status should contain only either ACTIVE / CLOSED / INACTIVE";
            it.each([
                [ "status", statusNotAllowed ],
                [ "OPEN", statusNotAllowed ],
                [ "STARTED", statusNotAllowed],
            ])('should return 400 when queueId in params has incorrect format (%s)', async (status, errorReason) => {
                const QUEUES_PUT_PATH =`${queuesPath}/${144}`
                jest.spyOn(QueueService, "update").mockResolvedValue();
                const response = await request(app).put(QUEUES_PUT_PATH)
                    .send({status})
                    .expect(StatusCodes.BAD_REQUEST)

                    expect(response.body).toMatchObject({
                        id: expect.anything(),
                        invalidParams: [ { name: "status", reason: errorReason } ],
                        type:"validation",
                      })
            });

        });

    });
});