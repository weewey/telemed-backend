import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth-service";
import { StatusCodes } from "http-status-codes";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authToken = req.get("Authorization");
  if (authToken) {
    try {
      await AuthService.verifyJwt(authToken);
      next();
      return;
    } catch (e) {
      res.status(e.status).json({ "error": { "message": e.message } });
    }
  }
  res.status(StatusCodes.UNAUTHORIZED).json({ "error": { "message": "Missing Authorization Header" } });
};
