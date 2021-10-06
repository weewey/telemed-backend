import { NextFunction, Request, Response } from "express";
import AuthService from "../services/auth-service";
import { StatusCodes } from "http-status-codes";
import { ApiErrorType } from "../errors/api-error-type";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const authToken = req.get("Authorization");
  if (authToken) {
    try {
      await AuthService.verifyJwt(authToken);
      next();
      return;
    } catch (e) {
      res.status(e.status).json({ "error": { "message": e.message, "type": e.type } });
      return;
    }
  }
  res.status(StatusCodes.UNAUTHORIZED)
    .json({ "error": { "message": "Missing authorization header", "type": ApiErrorType.authentication } });
};
