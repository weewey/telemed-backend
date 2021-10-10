import MessageBodyGenerator, { MessageTemplateType } from "../../src/utils/message-body-generator";
import { queueFactory } from "../factories/queue";
import { ticketFactory } from "../factories/ticket";
import { doctorFactory } from "../factories/doctor";
import { patientFactory } from "../factories/patient";
import EnvConfig from "../../src/config/env-config";

describe("MessageBodyGenerator", () => {
  const currentTicket = ticketFactory.instantiate({ id: 1 });
  const secondPendingTicket = ticketFactory.instantiate();
  const doctor = doctorFactory.instantiate();
  const queue = queueFactory.instantiate({
    currentTicketId: currentTicket.id,
    currentTicket,
  });
  const patient = patientFactory.instantiate();

  beforeAll(() => {
    secondPendingTicket.patient = patient;
    queue.currentTicket = currentTicket;
    queue.currentTicket.patient = patient;
  });

  describe("when the message template type is reaching soon", () => {
    it("should return the expected message body", async () => {
      const message = await MessageBodyGenerator.generate(MessageTemplateType.REACHING_SOON,
        secondPendingTicket, doctor);
      expect(message).toEqual(`Hi ${patient.firstName}.
Your queue ticket on QDOC for Dr ${doctor.lastName} is 2 tickets away from getting called`);
    });
  });

  describe("when the message template type is current ticket", () => {
    beforeEach(() => {
      jest.spyOn(currentTicket, "reload").mockResolvedValue(currentTicket);
      jest.spyOn(EnvConfig, "qdocPortalBaseUrl", "get").mockReturnValue("https://qdoc.sg");
    });
    it("should return the expected message body", async () => {
      const message = await MessageBodyGenerator.generate(MessageTemplateType.CURRENT_TICKET, currentTicket, doctor);
      expect(message).toEqual(`Hi ${patient.firstName}.
Dr ${doctor.lastName} is ready to see you now. Please head to https://qdoc.sg/tickets/1 for more details`);
    });
  });
});
