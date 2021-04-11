import Queue, {QueueAttributes} from "../../src/models/queue";
import QueueStatus from "../../src/queue_status";
import { ForeignKeyConstraintError } from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import { Errors } from "../../src/errors/error-mappings";
import QueueRepository from "../../src/respository/queue-repository";


describe("QueueRepository", () => {

    const queueAttr: QueueAttributes = {
        clinicId: 1,
        status: QueueStatus.INACTIVE
    }

    it("should call Queue#create", async () => {
        jest.spyOn(Queue, "create").mockResolvedValue();
        await QueueRepository.create(queueAttr)

        expect(Queue.create).toHaveBeenCalledTimes(1);
        expect(Queue.create).toBeCalledWith(queueAttr);
    })

    describe('Error scenarios', () => {
        it("should return CLINIC_NOT_FOUND error when there is no associated foreign key Clinic Id", async () => {
            jest.spyOn(Queue, "create").mockRejectedValue(new ForeignKeyConstraintError({} as any));

            await expect(QueueRepository.create(queueAttr)).rejects.toThrow(RepositoryError);
            await expect(QueueRepository.create(queueAttr)).rejects.toThrow(Errors.CLINIC_NOT_FOUND.code);
        })
    });


})