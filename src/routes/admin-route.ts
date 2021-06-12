import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "./validate-request";
import AdminService from "../services/admin-service";
import { usersCreateRule } from "../validation-rules/users-create-rule";

export const adminRoute = Router();

adminRoute.use(express.json());

adminRoute.post("/",
  validateRequest(usersCreateRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { firstName, lastName, email, authId, mobileNumber, queueId, clinicId } = req.body;

    const adminAttrs = { firstName,
      lastName,
      email,
      authId,
      mobileNumber,
      queueId,
      clinicId };
    const admin = await AdminService.create(adminAttrs);

    res.status(StatusCodes.CREATED).json(admin);
  }));
