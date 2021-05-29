import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import PatientService from "../services/patient-service";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "./validate-request";
import { patientCreateRules } from "../validation-rules/patient-create-rule";
import AuthService from "../services/auth-service";
import { Role } from "../clients/auth-client";

export const patientRoute = Router();

patientRoute.use(express.json());

patientRoute.post("/",
  validateRequest(patientCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, authId, mobileNumber } = req.body;
    const patientAttributes = { firstName, lastName, email, authId, mobileNumber };

    const patient = await PatientService.create(patientAttributes);
    await AuthService.setPermissions(authId, Role.Patient);

    res.status(StatusCodes.CREATED).json(patient);
  }));
