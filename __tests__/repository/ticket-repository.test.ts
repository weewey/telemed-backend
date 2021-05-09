import Ticket, {TicketAttributes} from "../../src/models/ticket";
import TicketStatus from "../../src/ticket_status";
import {ForeignKeyConstraintError, ValidationErrorItem} from "sequelize";
import RepositoryError from "../../src/errors/repository-error";
import {Errors} from "../../src/errors/error-mappings";
import TicketRepository from "../../src/respository/ticket-repository";


describe("TicketRepository", () => {

    const ticketAttr: TicketAttributes = {
        patientId: 1,
        displayNumber:1,
        status: TicketStatus.WAITING,
        clinicId: 1,
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('#create', function () {
        it("should call Ticket#create", async () => {
            jest.spyOn(Ticket, "create").mockResolvedValue();
            await TicketRepository.create(ticketAttr)

            expect(Ticket.create).toHaveBeenCalledTimes(1);
            expect(Ticket.create).toBeCalledWith(ticketAttr);
        })

        describe('Error scenarios', () => {
            it("should return UNABLE_TO_CREATE_TICKET_AS_ID_NOT_FOUND error when there is no associated foreign key", async () => {
                jest.spyOn(Ticket, "create").mockRejectedValue(new ForeignKeyConstraintError({}));

                await expect(TicketRepository.create(ticketAttr)).rejects.toThrow(RepositoryError);
                await expect(TicketRepository.create(ticketAttr)).rejects.toThrow(Errors.UNABLE_TO_CREATE_TICKET_AS_ID_NOT_FOUND.code);
            })
            it("should return UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL error displayNumber is null", async () => {
                jest.spyOn(Ticket, "create").mockRejectedValue(new ValidationErrorItem());

                await expect(TicketRepository.create(ticketAttr)).rejects.toThrow(RepositoryError);
                await expect(TicketRepository.create(ticketAttr)).rejects.toThrow(Errors.UNABLE_TO_CREATE_TICKET_AS_DISPLAY_NUM_IS_NULL.code);
            })
        });
    });

    
})