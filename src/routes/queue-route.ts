import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import QueueService from '../services/queue-service'
import QueueStatus from "../queue_status";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "./validate-request";
import { queueUpdateRules } from "../validation-rules/queue-update-rule";
import { queueCreateRules } from "../validation-rules/queue-create-rule";

export const queueRoute = Router()

queueRoute.use(express.json());

queueRoute.post("/",
    validateRequest(queueCreateRules),
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const { clinicId } = req.body;
        const queueAttr = { clinicId, status: QueueStatus.INACTIVE };
        const queueInfo = await QueueService.create(queueAttr);
        res.status(StatusCodes.CREATED).json(queueInfo);
    }
));

queueRoute.put("/:queueId",
    validateRequest(queueUpdateRules),
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
        const id = req.params.queueId;
        const updateAttributes = { id, ...req.body };

        await QueueService.update(updateAttributes);
        res.status(StatusCodes.NO_CONTENT).send();
    }
));

// queueRoute.post("/join",
//     body('queueId').isNumeric({no_symbols:true}).escape(), // validate clinic_id is numeric
//     body('patientId').isNumeric({no_symbols:true}).escape(),
//     // DB side validation (custom validator here)
//     asyncHandler(async (req: Request, res: Response): Promise<void> =>{
//         const queueInfo = await QueueService.joinQueue(req.body.queueId, req.body.patientId)
//         queueInfo ? res.json(queueInfo) : res.status(404).send();
//     }
// ));