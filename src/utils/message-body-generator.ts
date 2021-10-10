/* eslint-disable max-len */
import Doctor from "../models/doctor";
import EnvConfig from "../config/env-config";
import Ticket from "../models/ticket";

export enum MessageTemplateType {
  REACHING_SOON = "reaching_soon",
  CURRENT_TICKET = "current_ticket",
}

export default class MessageBodyGenerator {
  public static generate(
    messageTemplateType: MessageTemplateType,
    ticketWithPatientEagerLoaded: Ticket,
    doctor: Doctor,
  ): string {
    if (messageTemplateType === MessageTemplateType.REACHING_SOON) {
      return `Hi ${ticketWithPatientEagerLoaded.patient.firstName}.
Your queue ticket on QDOC for Dr ${doctor.lastName} is ${EnvConfig.pendingTicketNumToNotify} tickets away from getting called`;
    }
    return `Hi ${ticketWithPatientEagerLoaded.patient.firstName}.
Dr ${doctor.lastName} is ready to see you now. Please head to ${EnvConfig.qdocPortalBaseUrl}/tickets/${ticketWithPatientEagerLoaded.id} for more details`;
  }
}
