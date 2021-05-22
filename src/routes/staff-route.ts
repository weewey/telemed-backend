import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import StaffService from "../services/staff-service";
import { validateRequest } from "./validate-request";
import { staffCreateRule } from "../validation-rules/staff-create-rule";

export const staffRoute = Router();

staffRoute.use(express.json());

staffRoute.post("/",
  validateRequest(staffCreateRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, authId, mobileNumber, clinicId } = req.body;

    const staff = await StaffService.create({ firstName,
      lastName,
      email,
      authId,
      mobileNumber,
      clinicId });

    res.status(StatusCodes.CREATED).json(staff);
  }));
