import express, {Router} from "express";
import {clinicRoute} from "./routes/clinic-route";
import {queueRoute} from "./routes/queue-route";

const app: express.Application = express();

const apiV1Router = Router();

app.use("/api/v1", apiV1Router)
apiV1Router.use("/clinics", clinicRoute);
apiV1Router.use("/queue", queueRoute);

export default app;