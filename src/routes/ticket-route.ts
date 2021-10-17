import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import TicketService from "../services/ticket-service";
import { validateRequest } from "./validate-request";
import { ticketCreateRules } from "../validation-rules/ticket-create-rule";
import { ticketIdRule, ticketUpdateRules } from "../validation-rules/ticket-update-rule";
import { StatusCodes } from "http-status-codes";
import { FindAllTicketAttributes } from "../respository/ticket-repository";
import { ticketGetRules } from "../validation-rules/ticket-get-rule";
import Queue from "../models/queue";
import Clinic from "../models/clinic";
import Patient from "../models/patient";
import Doctor from "../models/doctor";

export const ticketRoute = Router();

ticketRoute.use(express.json());

ticketRoute.post("/",
  validateRequest(ticketCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { patientId, queueId, clinicId, type } = req.body;

    const ticket = await TicketService.create({ patientId, queueId, clinicId, type });

    res.status(StatusCodes.CREATED).json(ticket);
  }));

ticketRoute.put("/:ticketId",
  validateRequest(ticketUpdateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.ticketId;
    const updateAttributes = { id, ...req.body };

    await TicketService.update(updateAttributes);
    res.status(StatusCodes.NO_CONTENT).send();
  }));

ticketRoute.get("/:ticketId",
  validateRequest(ticketIdRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { ticketId } = req.params;

    const ticket = await TicketService.get(Number(ticketId), { include: [
      { model: Queue, include: [ { model: Doctor } ] },
      { model: Clinic },
      { model: Patient },
    ] });
    res.status(StatusCodes.OK).json(ticket);
  }));

ticketRoute.get("/",
  validateRequest(ticketGetRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { clinicId, status, patientId, queueId } = req.query;
    const findAllTicketAttributes = {
      ...(clinicId && { clinicId: Number(clinicId) }),
      ...(queueId && { queueId: Number(queueId) }),
      ...(patientId && { patientId: Number(patientId) }),
      ...(status && { status }),
    } as FindAllTicketAttributes;

    const tickets = await TicketService.findAll(findAllTicketAttributes);
    res.status(StatusCodes.OK).json(tickets);
  }));
