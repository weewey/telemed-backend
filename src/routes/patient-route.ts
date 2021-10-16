import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import PatientService from "../services/patient-service";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "./validate-request";
import { patientCreateRules } from "../validation-rules/patient-create-rule";
import { patientIdRule } from "../validation-rules/patient-get-rule";

export const patientRoute = Router();

patientRoute.use(express.json());

patientRoute.post("/",
  validateRequest(patientCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, authId, mobileNumber, dateOfBirth } = req.body;
    const patientAttributes = { firstName, lastName, email, authId, mobileNumber, dateOfBirth };

    const patient = await PatientService.create(patientAttributes);

    res.status(StatusCodes.CREATED).json(patient);
  }));

patientRoute.get("/:patientId",
  validateRequest(patientIdRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { patientId } = req.params;
    const patient = await PatientService.getPatientById(Number(patientId));
    res.status(StatusCodes.OK).json(patient);
  }));
