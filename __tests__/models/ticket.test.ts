import Ticket, {TicketAttributes} from "../../src/models/ticket";
import Patient from "../../src/models/patient";
import {clinicFactory} from "../factories";
import QueueStatus from "../../src/queue_status";
import TicketStatus from "../../src/ticket_status";
import Queue from "../../src/models/queue";
import {v4 as generateUUID} from "uuid";

describe("Ticket", () => {
    const ticketIdsToBeDeleted: Array<number> = []
    let clinicId: number;
    let queueId: number;
    let patientId: number;
    const getTicketAttrs = (overrideAttrs?: Partial<TicketAttributes>): TicketAttributes => {
        return {
            patientId: patientId,
            status: TicketStatus.WAITING,
            queueId: queueId,
            clinicId: clinicId,
            ...overrideAttrs
        }
    }

    beforeEach(async () => {
        const clinic = await clinicFactory.build()
        clinicId = clinic.id
        const queueAttributes = {
            "clinicId": clinicId,
            "createdAt": new Date(Date.now()),
            "updatedAt": new Date(Date.now()),
            "status": QueueStatus.CLOSED,
            "startedAt": new Date(Date.now()),
            "closedAt": new Date(Date.now())
        }
        const queue = await Queue.create(queueAttributes)
        queueId = queue.id
        
        const patientDetails =  {
                firstName: "patientModelTest",
                lastName: "patientLastName",
                email: `${generateUUID()}@gmail.com`,
                authId: generateUUID(),
                mobileNumber: generateUUID(),
        }
        const patient = await Patient.create(patientDetails)
        patientId = patient.id

    });

    afterAll(async () => {
        await Ticket.destroy({where: {id: ticketIdsToBeDeleted}})
    })

    describe("valid", () => {

        it("should create when it has all valid attributes", async () => {
            const ticket = await Ticket.create(getTicketAttrs({displayNumber: 1}))
            expect(ticket).toBeDefined()
            ticketIdsToBeDeleted.push(ticket.id)
        })
    })
    describe("invalid", () => {
        it("should fail when displayNumber is null", async () => {
            await expect(Ticket.create(getTicketAttrs()))
            .rejects.toThrowError("notNull Violation: Ticket.displayNumber cannot be null")
        })
    })
});