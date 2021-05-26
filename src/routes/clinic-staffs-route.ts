import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import ClinicStaffsService from "../services/clinic-staffs-service";
import { validateRequest } from "./validate-request";
import { clinicStaffsCreateRule } from "../validation-rules/clinic-staffs-create-rule";

export const clinicStaffsRoute = Router();

clinicStaffsRoute.use(express.json());

clinicStaffsRoute.post("/",
  validateRequest(clinicStaffsCreateRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, authId, mobileNumber, clinicId } = req.body;

    const staff = await ClinicStaffsService.create({ firstName,
      lastName,
      email,
      authId,
      mobileNumber,
      clinicId });

    res.status(StatusCodes.CREATED).json(staff);
  }));
