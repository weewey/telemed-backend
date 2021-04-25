import request from "supertest";
import app from "../../src/app";
import QueueService from "../../src/services/queue-service";
import Queue from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import {StatusCodes} from "http-status-codes";

describe('Queue Route', function () {
    const queuesPath = '/api/v1/queues';
    const clinicId = 1
    const queue = {id: 1, clinicId, status: QueueStatus.INACTIVE} as Queue

    beforeEach(jest.clearAllMocks);

    describe('POST /queue', function () {
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

    });
});