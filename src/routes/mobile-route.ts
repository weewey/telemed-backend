import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import MobileService from "../services/mobile-service";

export const mobileRoute = Router();

mobileRoute.use(express.json());

mobileRoute.post("/send-verification-token",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mobileNumber } = req.body;

    const verificationInstance = await MobileService.verifyPhoneNumber(mobileNumber);

    res.status(StatusCodes.OK).json(verificationInstance.toJSON());
  }));

mobileRoute.post("/verify-token",
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mobileNumber, token } = req.body;

    const verificationCheckInstance = await MobileService.isVerificationCodeValid(mobileNumber, token);

    if (verificationCheckInstance.valid) {
      res.status(StatusCodes.OK).json(verificationCheckInstance.toJSON());
    }

    res.status(StatusCodes.BAD_REQUEST).json(verificationCheckInstance.toJSON());
  }));
