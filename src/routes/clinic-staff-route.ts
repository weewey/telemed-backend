import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import ClinicStaffsService from "../services/clinic-staffs-service";
import { validateRequest } from "./validate-request";
import { usersCreateRule } from "../validation-rules/users-create-rule";

export const clinicStaffRoute = Router();

clinicStaffRoute.use(express.json());

clinicStaffRoute.post("/",
  validateRequest(usersCreateRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, authId, mobileNumber, clinicId, dateOfBirth } = req.body;

    const staff = await ClinicStaffsService.create({ firstName,
      lastName,
      email,
      authId,
      mobileNumber,
      dateOfBirth,
      clinicId });

    res.status(StatusCodes.CREATED).json(staff);
  }));
