import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import MobileService from "../services/mobile-service";

export const mobileRoute = Router();

mobileRoute.use(express.json());

mobileRoute.post("/send-verification-token",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mobileNumber } = req.body;

    const checkVerificationToken = await MobileService.verifyMobileNumber(mobileNumber);

    res.json(checkVerificationToken);
  }));

mobileRoute.post("/verify-token",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mobileNumber, token } = req.body;

    const checkVerificationToken = await MobileService.checkVerificationCode(mobileNumber, token);

    res.json(checkVerificationToken);
  }));
