import cors from "cors";
import express, { Router } from "express";
import { errorHandler } from "./errors/error-handler";
import { clinicRoute } from "./routes/clinic-route";
import { clinicStaffRoute } from "./routes/clinic-staff-route";
import { doctorRoute } from "./routes/doctor-route";
import { patientRoute } from "./routes/patient-route";
import { queueRoute } from "./routes/queue-route";
import { ticketRoute } from "./routes/ticket-route";
import { adminRoute } from "./routes/admin-route";
import { mobileRoute } from "./routes/mobile-route";

const app: express.Application = express();

app.use(cors());

const apiV1Router = Router();

app.use("/api/v1", apiV1Router);
apiV1Router.use("/clinics", clinicRoute);
apiV1Router.use("/queues", queueRoute);
apiV1Router.use("/patients", patientRoute);
apiV1Router.use("/doctors", doctorRoute);
apiV1Router.use("/clinic-staffs", clinicStaffRoute);
apiV1Router.use("/tickets", ticketRoute);
apiV1Router.use("/admins", adminRoute);
apiV1Router.use("/mobile", mobileRoute);

app.use(errorHandler);

export default app;
