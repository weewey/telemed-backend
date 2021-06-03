import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import ClinicService from "../services/clinic-service";
import { clinicCreateRule } from "../validation-rules/clinic-create-rule";
import { validateRequest } from "./validate-request";

export const clinicRoute = Router();

clinicRoute.use(express.json());

clinicRoute.get("/:clinicId",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { clinicId } = req.params;
    const clinicInfo = await ClinicService.getClinicById(clinicId);
    if (clinicInfo) {
      res.json(clinicInfo);
    } else {
      res.status(404).send();
    }
  }));

clinicRoute.get("/",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const clinics = await ClinicService.getClinics();
    res.json(clinics);
  }));

clinicRoute.post("/",
  validateRequest(clinicCreateRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { name, imageUrl, lat, long, address, postalCode, email, phoneNumber } = req.body;

    const clinic = await ClinicService.create({
      name,
      imageUrl,
      lat,
      long,
      address,
      postalCode,
      email,
      phoneNumber,
    });

    res.status(StatusCodes.CREATED).json(clinic);
  }));
