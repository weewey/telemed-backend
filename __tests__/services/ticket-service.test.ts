import {TicketAttributes} from "../../src/models/ticket";
import TicketStatus from "../../src/ticket_status";
import TicketService from "../../src/services/ticket-service";
import {Errors} from "../../src/errors/error-mappings";
import TicketRepository from "../../src/respository/ticket-repository";
import RepositoryError from "../../src/errors/repository-error";
import NotFoundError from "../../src/errors/not-found-error";
import TechnicalError from "../../src/errors/technical-error";

describe("TicketService", () => {
    beforeEach(jest.clearAllMocks)

    describe("#create", () => {
        const ticketAttr: TicketAttributes = {
            patientId: 1,
            status: TicketStatus.WAITING,
            queueId: 1,
            displayNumber: 1,
            clinicId: 1,
        }

        it("should create and return a queue", async () => {
            const mockTicket = {id: 1} as any;
            jest.spyOn(TicketRepository, "create").mockResolvedValue(
                mockTicket
            )
            const ticketResult = await TicketService.create(ticketAttr);

            expect(ticketResult).toEqual(mockTicket)
        })

        describe('Error scenarios', () => {
            it("should throw 404 NotFound error ENTITY_NOT_FOUND when there is no associated patient / queue / clinic id", async () => {
                jest.spyOn(TicketRepository, "create").mockRejectedValue(new RepositoryError(Errors.ENTITY_NOT_FOUND.code, Errors.ENTITY_NOT_FOUND.message));
                await expect(TicketService.create(ticketAttr)).rejects.toThrow(new NotFoundError(Errors.ENTITY_NOT_FOUND.code,
                    Errors.ENTITY_NOT_FOUND.message))
            })

            it("should throw 404 NotFound error UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL when displayNumber is null", async () => {
                jest.spyOn(TicketRepository, "create").mockRejectedValue(new RepositoryError(Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.code,
                    Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.message));
                await expect(TicketService.create(ticketAttr)).rejects.toThrow(new NotFoundError(Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.code,
                    Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.message))
            })


            it("should throw 500 Technical error UNABLE_TO_CREATE_QUEUE when QueueRepository.create fails, not due to known reasons", async () => {
                jest.spyOn(TicketRepository, "create").mockRejectedValue(new Error("some DB problem"));

                await expect(TicketService.create(ticketAttr)).rejects.toThrow(new TechnicalError("some DB problem"))
            })

        });
    })

})