import express, {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import {StatusCodes} from "http-status-codes";
import DoctorService from "../services/doctor-service";
import {validateRequest} from "./validate-request";
import {doctorCreateRule} from "../validation-rules/doctor-create-rule";

export const doctorRoute = Router();

doctorRoute.use(express.json());

doctorRoute.post("/",
    validateRequest(doctorCreateRule),
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
            const { firstName, lastName, onDuty, email, authId, mobileNumber, queueId, clinicId } = req.body;
            const doctorAttrs = { firstName, lastName, onDuty, email, authId, mobileNumber, queueId, clinicId };

            const doctor = await DoctorService.create(doctorAttrs);

            res.status(StatusCodes.CREATED).json(doctor);
        }
    ));