import { errorHandler } from "./errors/error-handler";
import express, {Router} from "express";
import { clinicRoute } from "./routes/clinic-route";
import { queueRoute } from "./routes/queue-route";
import { patientRoute } from "./routes/patient-route";

const app: express.Application = express();

const apiV1Router = Router();

app.use("/api/v1", apiV1Router)
apiV1Router.use("/clinics", clinicRoute);
apiV1Router.use("/queues", queueRoute);
apiV1Router.use("/patients", patientRoute);

app.use(errorHandler);

export default app;