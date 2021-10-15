import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import DoctorService from "../services/doctor-service";
import { validateRequest } from "./validate-request";
import { doctorCreateRule } from "../validation-rules/doctor-create-rule";
import { doctorUpdateRule } from "../validation-rules/doctor-update-rule";
import { FindAllDoctorAttributes } from "../respository/doctor-repository";

export const doctorRoute = Router();

doctorRoute.use(express.json());

doctorRoute.post("/",
  validateRequest(doctorCreateRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const {
      firstName, lastName, onDuty, email, authId, mobileNumber, queueId, dateOfBirth, clinicId,
    } = req.body;

    const doctorAttrs = {
      firstName,
      lastName,
      email,
      authId,
      mobileNumber,
      queueId,
      clinicId,
      dateOfBirth,
      onDuty: onDuty || false,
    };
    const doctor = await DoctorService.create(doctorAttrs);

    res.status(StatusCodes.CREATED).json(doctor);
  }));

doctorRoute.put("/:doctorId",
  validateRequest(doctorUpdateRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.doctorId;
    const updateAttributes = { id, ...req.body };

    const doctor = await DoctorService.update(updateAttributes);
    res.status(StatusCodes.OK).json(doctor);
  }));

doctorRoute.get("/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { clinicId, onDuty, queueId } = req.query;
    const findAllDoctorAttributes = {
      ...(clinicId && { clinicId: Number(clinicId) }),
      ...(queueId && { queueId: Number(queueId) }),
      ...(onDuty && { onDuty: Boolean(onDuty) }),
    } as FindAllDoctorAttributes;
    if (findAllDoctorAttributes && Object.keys(findAllDoctorAttributes).length === 0) {
      const doctors = await DoctorService.findDoctors();
      res.status(StatusCodes.OK).json(doctors);
      return;
    }
    const doctors = await DoctorService.findDoctors(findAllDoctorAttributes);
    res.status(StatusCodes.OK).json(doctors);
  }));

doctorRoute.get("/:doctorId",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.doctorId;
    const doctor = await DoctorService.get(Number(id));
    res.status(StatusCodes.OK).json(doctor);
  }));
