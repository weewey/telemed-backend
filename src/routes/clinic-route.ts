import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";

export const clinicRoute = Router()

clinicRoute.get("/:clinicId",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
            const {clinicId} = req.params;
            res.json({"clinicId": clinicId})
        }
    ));