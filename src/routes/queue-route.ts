import express, { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import QueueService from "../services/queue-service";
import QueueStatus from "../queue_status";
import { StatusCodes } from "http-status-codes";
import { validateRequest } from "./validate-request";
import { queueIdRule, queueUpdateRules } from "../validation-rules/queue-update-rule";
import { queueCreateRules } from "../validation-rules/queue-create-rule";
import { getAllQueuesRule } from "../validation-rules/queue-get-rule";
import { FindAllQueueAttributes } from "../respository/queue-repository";

export const queueRoute = Router();

queueRoute.use(express.json());

queueRoute.post("/",
  validateRequest(queueCreateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { clinicId } = req.body;
    const queueAttr = { clinicId, status: QueueStatus.INACTIVE };
    const queueInfo = await QueueService.create(queueAttr);
    res.status(StatusCodes.CREATED).json(queueInfo);
  }));

queueRoute.put("/:queueId",
  validateRequest(queueUpdateRules),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.queueId;
    const updateAttributes = { id, ...req.body };

    await QueueService.update(updateAttributes);
    res.status(StatusCodes.NO_CONTENT).send();
  }));

queueRoute.get("/",
  validateRequest(getAllQueuesRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { clinicId, status } = req.query;
    const findAllQueuesParams = {
      ...(clinicId && { clinicId: Number(clinicId) }),
      ...(status && { status }),
    } as FindAllQueueAttributes;

    const queues = await QueueService.fetchAllQueues(findAllQueuesParams);
    res.status(StatusCodes.OK).json(queues);
  }));

queueRoute.get("/:queueId",
  validateRequest(queueIdRule),
  asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.queueId;
    const queue = await QueueService.getQueueById(Number(id));
    res.status(StatusCodes.OK).json(queue);
  }));
