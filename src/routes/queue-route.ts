import express, {Request, Response, Router} from "express";
import asyncHandler from "express-async-handler";
import QueueService from '../services/queue-service'
import QueueStatus from "../queue_status";
import {body, validationResult} from "express-validator";
import {StatusCodes} from "http-status-codes";
import { Errors } from "../errors/error-mappings";

export const queueRoute = Router()

queueRoute.use(express.json());

queueRoute.post("/",
    body('clinicId').isNumeric().toInt(),
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const errorMessage = errors.array().map((error) => `${error.msg}: ${error.param}`).join("")
                res.status(StatusCodes.BAD_REQUEST).json({error_message: errorMessage});
                return
            }
            const {clinicId} = req.body;
            const queueAttr = {clinicId, status: QueueStatus.INACTIVE};
            try {
                const queueInfo = await QueueService.create(queueAttr);
                res.status(StatusCodes.CREATED).json(queueInfo);
                return
            }catch (error){
                if(error.message === Errors.CLINIC_NOT_FOUND.message){
                    res.status(StatusCodes.NOT_FOUND).json({error_message: error.message})
                    return
                }else{
                    // need to review -- not in spec (case not handled in original spec REF: #25)
                    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error_message: error.message})
                    return
                }
            }
        }
    )
);

queueRoute.put("/",
    asyncHandler(async (req: Request, res: Response): Promise<void> =>{
        const queueUpdateAttributes = req.body;
        await QueueService.update(queueUpdateAttributes);
        res.status(204).send();
    }
));

// queueRoute.put("/:queueId/status/:targetStatus",
//     checkSchema({
//         queueID:{
//             in:['params'],
//             errorMessage: 'invalid queueId',
//             isNumeric: true,
//             escape: true,
//         },
//         targetStatus:{
//             in:['params'],
//             errorMessage: 'invalid target status',
//             isString: true,
//             // custom validator to check for valid status string
//             custom: {options: (value: string) =>{
//                 if (value == 'ACTIVE' || value == 'INACTIVE' || value == 'CLOSED'){
//                     return true
//                 }
//                 throw new Error('Invalid Status');
//             }},
//             escape: true,
//         },
//     }),
//     asyncHandler(async (req: Request, res: Response): Promise<void> =>{
//         const changeQueueStatusInfo = await QueueService.changeQueueStatus(req.params.targetStatus, req.params.targetStatus)
//         changeQueueStatusInfo ? res.json(changeQueueStatusInfo) : res.status(404).send();
//     }
// ));

// queueRoute.post("/join",
//     body('queueId').isNumeric({no_symbols:true}).escape(), // validate clinic_id is numeric
//     body('patientId').isNumeric({no_symbols:true}).escape(),
//     // DB side validation (custom validator here)
//     asyncHandler(async (req: Request, res: Response): Promise<void> =>{
//         const queueInfo = await QueueService.joinQueue(req.body.queueId, req.body.patientId)
//         queueInfo ? res.json(queueInfo) : res.status(404).send();
//     }
// ));