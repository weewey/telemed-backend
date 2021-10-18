import { queueFactory } from "../factories/queue";
import MobileService from "../../src/services/mobile-service";
import PatientsNotificationService from "../../src/services/patients-notification-service";
import { ticketFactory } from "../factories/ticket";
import Patient from "../../src/models/patient";
import MessageBodyGenerator from "../../src/utils/message-body-generator";
import Doctor from "../../src/models/doctor";
import TicketService from "../../src/services/ticket-service";
import EnvConfig from "../../src/config/env-config";

describe("PatientsNotificationService", () => {
  const queue = queueFactory.instantiate();
  const currentTicket = ticketFactory.instantiate();
  const pendingTicket = ticketFactory.instantiate();
  const currentTicketWithPatient = currentTicket;

  beforeEach(jest.resetAllMocks);

  describe("#notifyQueueCurrentTicketUpdate", () => {
    beforeEach(() => {
      currentTicketWithPatient.patient = { mobileNumber: "123" } as Patient;
      queue.currentTicket = currentTicket;
      queue.doctor = {} as Doctor;
      jest.spyOn(currentTicket, "reload").mockResolvedValue(currentTicketWithPatient);
      jest.spyOn(MessageBodyGenerator, "generate").mockReturnValue("current ticket message body");
    });

    it("should call MobileService with the expected", async () => {
      const spy = jest.spyOn(MobileService, "sendMessage").mockResolvedValue();
      await PatientsNotificationService.notifyQueueCurrentTicketUpdate(queue);
      expect(spy).toBeCalledWith("123", "current ticket message body");
    });

    describe("when MobileService errors", () => {
      it("should not raise an error", async () => {
        jest.spyOn(MobileService, "sendMessage").mockRejectedValue(new Error(""));
        await expect(PatientsNotificationService.notifyQueueCurrentTicketUpdate(queue))
          .resolves
          .not
          .toThrowError();
      });
    });
  });

  describe("#notifyQueuePendingTicketUpdate", () => {
    beforeEach(() => {
      pendingTicket.id = 1;
      pendingTicket.patient = { mobileNumber: "456" } as Patient;
      queue.pendingTicketIdsOrder = [ 2, 3, pendingTicket.id ];
      queue.doctor = {} as Doctor;
      jest.spyOn(TicketService, "get").mockResolvedValue(pendingTicket);
      jest.spyOn(MessageBodyGenerator, "generate").mockReturnValue("reaching soon ticket message body");
    });

    describe("when the queue pendingTicketsId count is more than the EnvConfig.pendingTicketNumToNotify", () => {
      beforeEach(() => {
        jest.spyOn(EnvConfig, "pendingTicketNumToNotify", "get").mockReturnValue(2);
      });
      it("should call MobileService with the expected", async () => {
        const spy = jest.spyOn(MobileService, "sendMessage").mockResolvedValue();
        await PatientsNotificationService.notifyQueuePendingTicketUpdate(queue);
        expect(spy).toBeCalledWith("456", "reaching soon ticket message body");
      });
    });

    describe("when the queue pendingTicketsId count is less than the EnvConfig.pendingTicketNumToNotify", () => {
      beforeEach(() => {
        jest.spyOn(EnvConfig, "pendingTicketNumToNotify", "get").mockReturnValue(5);
      });
      it("should not call MobileService.sendMessage", async () => {
        const spy = jest.spyOn(MobileService, "sendMessage").mockResolvedValue();
        await PatientsNotificationService.notifyQueuePendingTicketUpdate(queue);
        expect(spy).not.toBeCalled();
      });
    });

    describe("when MobileService errors", () => {
      it("should not raise an error", async () => {
        jest.spyOn(MobileService, "sendMessage").mockRejectedValue(new Error(""));
        await expect(PatientsNotificationService.notifyQueuePendingTicketUpdate(queue))
          .resolves
          .not
          .toThrowError();
      });
    });
  });
});
