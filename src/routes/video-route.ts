import asyncHandler from "express-async-handler";
import express, { Request, Response, Router } from "express";
import { StatusCodes } from "http-status-codes";
import VideoService from "../services/video-service";
import { validateRequest } from "./validate-request";
import { videoTokenCreateRules } from "../validation-rules/video-token-create-rule";

export const videoRoute = Router();

videoRoute.use(express.json());

videoRoute.post("/token",
  validateRequest(videoTokenCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { identity, room } = req.body;

    const token = await VideoService.generateToken(identity, room);

    res.status(StatusCodes.CREATED).json({ token });
  }));
