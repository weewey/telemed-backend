import express, {Router} from "express";
import {clinicRoute} from "./routes/clinic-route";

const port = process.env.API_PORT || 3000;

const app: express.Application = express();

const apiV1Router = Router();

app.use("/api/v1", apiV1Router)
apiV1Router.use("/clinic", clinicRoute);

app.listen(port, (): void => {
    console.log(`app running on port ${port}`)
});