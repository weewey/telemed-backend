import express, {Router} from "express";
import {clinicRoute} from "./routes/clinic-route";
import {initDB} from "./utils/db-connection";
import {Logger} from "./logger";

const port = process.env.API_PORT || 3000;

initDB()
    .catch((err) => Logger.error("Failed connecting to DB.", err));

const app: express.Application = express();

const apiV1Router = Router();

app.use("/api/v1", apiV1Router)
apiV1Router.use("/clinic", clinicRoute);

app.listen(port, (): void => {
    Logger.info(`app running on port ${port}`)
});