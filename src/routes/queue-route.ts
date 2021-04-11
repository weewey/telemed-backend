import {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import QueueService from '../services/queue-service'

export const queueRoute = Router()

const express = require('express');
const { body, checkSchema } = require('express-validator');
queueRoute.use(express.json());

queueRoute.post("/"),
    body('clinicId').isNumeric({no_symbols:true}).escape(), // validate clinic_id is numeric
    asyncHandler(async (req: Request, res: Response): Promise<void> =>{
        const queueInfo = await QueueService.createQueue(req.body.clinicId) 
        queueInfo ? res.json(queueInfo) : res.status(404).send();
    }
);

queueRoute.put("/:queueId/status/:targetStatus"),
    checkSchema({
        queueID:{
            in:['params'],
            errorMessage: 'invalid queueId',
            isNumeric: true,
            escape: true,
        },
        targetStatus:{
            in:['params'],
            errorMessage: 'invalid target status',
            isString: true,
            // custom validator to check for valid status string
            custom: {options: (value: string) =>{
                if (value == 'ACTIVE' || value == 'INACTIVE' || value == 'CLOSED'){
                    return true 
                }
                throw new Error('Invalid Status');
            }},
            escape: true,
        },
    }),
    asyncHandler(async (req: Request, res: Response): Promise<void> =>{
        const changeQueueStatusInfo = await QueueService.changeQueueStatus(req.params.targetStatus, req.params.targetStatus)
        changeQueueStatusInfo ? res.json(changeQueueStatusInfo) : res.status(404).send();
    }
);

queueRoute.post("/join"),
    body('queueId').isNumeric({no_symbols:true}).escape(), // validate clinic_id is numeric
    body('patientId').isNumeric({no_symbols:true}).escape(),
    // DB side validation (custom validator here)
    asyncHandler(async (req: Request, res: Response): Promise<void> =>{
        const queueInfo = await QueueService.joinQueue(req.body.queueId, req.body.patientId)
        queueInfo ? res.json(queueInfo) : res.status(404).send();
    }
);