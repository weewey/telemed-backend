import Queue from "../models/queue";
import Patient from "../models/patient";
import MessageBodyGenerator, { MessageTemplateType } from "../utils/message-body-generator";
import MobileService from "./mobile-service";
import EnvConfig from "../config/env-config";
// eslint-disable-next-line import/no-cycle
import TicketService from "./ticket-service";
import { Logger } from "../logger";

export default class PatientsNotificationService {
  public static async notifyQueueCurrentTicketUpdate(queueEagerLoadedWithDoctor: Queue): Promise<void> {
    const doctor = queueEagerLoadedWithDoctor.doctors[0];
    const { currentTicket } = queueEagerLoadedWithDoctor;
    const currentTicketWithPatient = await currentTicket.reload({ include: Patient });
    const currentTicketMessageBody = MessageBodyGenerator.generate(
      MessageTemplateType.CURRENT_TICKET, currentTicketWithPatient, doctor,
    );
    try {
      await MobileService.sendMessage(currentTicketWithPatient.patient.mobileNumber, currentTicketMessageBody);
    } catch (e) {
      Logger.error(`MobileService.sendMessage errored with notifyQueueCurrentTicketUpdate: ${e.message}`);
    }
  }

  public static async notifyQueuePendingTicketUpdate(queueEagerLoadedWithDoctor: Queue): Promise<void> {
    if (queueEagerLoadedWithDoctor.pendingTicketIdsOrder.length < (EnvConfig.pendingTicketNumToNotify + 1)) {
      return;
    }
    const doctor = queueEagerLoadedWithDoctor.doctors[0];
    const ticketIdToNotify = queueEagerLoadedWithDoctor.pendingTicketIdsOrder[EnvConfig.pendingTicketNumToNotify - 1];
    const ticketToNotify = await TicketService.get(ticketIdToNotify, { include: Patient });
    const reachingSoonTicketMessageBody = MessageBodyGenerator.generate(MessageTemplateType.REACHING_SOON,
      ticketToNotify, doctor);
    try {
      await MobileService.sendMessage(ticketToNotify.patient.mobileNumber, reachingSoonTicketMessageBody);
    } catch (e) {
      Logger.error(`MobileService.sendMessage errored with notifyQueuePendingTicketUpdate: ${e.message}`);
    }
  }
}
