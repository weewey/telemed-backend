import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import TicketService from "../services/ticket-service";
import { validateRequest } from "./validate-request";
import { ticketCreateRules } from "../validation-rules/ticket-create-rule";
import { ticketUpdateRules } from "../validation-rules/ticket-update-rule";
import { StatusCodes } from "http-status-codes";

export const ticketRoute = Router();

ticketRoute.use(express.json());

ticketRoute.post("/",
  validateRequest(ticketCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { patientId, queueId, clinicId } = req.body;

    const ticket = await TicketService.create({ patientId, queueId, clinicId });

    res.status(StatusCodes.CREATED).json(ticket);
  }));

ticketRoute.put("/:ticketId",
  validateRequest(ticketUpdateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.queueId;
    const updateAttributes = { id, ...req.body };

    await TicketService.update(updateAttributes);
    res.status(StatusCodes.NO_CONTENT).send();
  }));
