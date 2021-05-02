import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import PatientService from '../services/patient-service'
import { StatusCodes } from "http-status-codes";

export const patientRoute = Router()

patientRoute.use(express.json());

patientRoute.post("/",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { firstName, lastName, email, authId, mobileNumber } = req.body;
        const patientAttributes = { firstName, lastName, email, authId, mobileNumber };

        const patient = await PatientService.create(patientAttributes);

        res.status(StatusCodes.CREATED).json(patient);
    }
));