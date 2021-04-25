import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import ClinicService from '../services/clinic-service'

export const clinicRoute = Router()

clinicRoute.get("/:clinicId",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
            const {clinicId} = req.params;
            const clinicInfo = await ClinicService.getClinicById(clinicId)
            clinicInfo ? res.json(clinicInfo) : res.status(404).send();
        }
    ));

clinicRoute.get("/",
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
            const clinics = await ClinicService.getClinics();
            res.json(clinics);
        }
    ));