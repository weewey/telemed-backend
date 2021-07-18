import { Factory } from "rosie";
import Queue from "../../src/models/queue";
import { randomInt } from "crypto";
import QueueStatus from "../../src/queue_status";
import { buildWrapper } from "./index";

const queue = Factory.define<Queue>("queue", Queue)
  .attr("clinicId", () => randomInt(1, 1000))
  .attr("status", () => QueueStatus.INACTIVE)
  .attr("latestGeneratedTicketDisplayNumber", () => 0)
  .attr("pendingTicketIdsOrder", () => [])
  .attr("startedAt", () => new Date(Date.now()))
  .attr("closedAt", () => new Date(Date.now()))
  .attr("createdAt", () => new Date(Date.now()))
  .attr("updatedAt", () => new Date(Date.now()));

export const queueFactory = buildWrapper<Queue>(queue);
