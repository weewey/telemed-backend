import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import BusinessError from "../errors/business-error";
import { Errors } from "../errors/error-mappings";
import QueueService from "../services/queue-service";
import QueueStatus from "../queue_status";
import TicketService from "../services/ticket-service";
import TicketStatus from "../ticket_status";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "./validate-request";
import { ticketCreateRules } from "../validation-rules/ticket-create-rule";

export const ticketRoute = Router();

ticketRoute.use(express.json());

ticketRoute.post("/",
  validateRequest(ticketCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { patientId, queueId, clinicId } = req.body;
    const queues = await QueueService.getQueuesByClinicAndStatus(clinicId, QueueStatus.ACTIVE);
    if (queues.length === 0) {
      throw new BusinessError(Errors.QUEUE_NOT_FOUND.message,
        Errors.QUEUE_NOT_FOUND.code);
    }
    const queueDispNum = queues.find(queue => queue.id === queueId)?.latestGeneratedTicketDisplayNumber;
    if (queueDispNum) {
      const dispNum = queueDispNum + 1;
      const ticketAttr = { patientId, status: TicketStatus.WAITING, queueId, displayNumber: dispNum, clinicId };
      const ticketInfo = await TicketService.create(ticketAttr);
      res.status(StatusCodes.CREATED).json(ticketInfo);
    }
    throw new BusinessError(Errors.ENTITY_NOT_FOUND.message,
      Errors.ENTITY_NOT_FOUND.code);
  }));
