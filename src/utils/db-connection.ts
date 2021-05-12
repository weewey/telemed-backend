import { Sequelize } from "sequelize-typescript";
import dbConfig from "../config/config";
import EnvConfig from "../config/env-config";
import path from "path";
import { Logger } from "../logger";
import { get } from "lodash";

const dbProps = (): any => {
  return get(dbConfig, EnvConfig.nodeEnvironment, {});
};

export const sequelize = new Sequelize(dbProps());
const modelsPath = path.resolve(__dirname, "../models");
Logger.info(`loading models from ${modelsPath}`);
sequelize.addModels([ modelsPath ]);

export const initDB = async (): Promise<void> => {
  Logger.info("Initializing DB connection");
  await sequelize.authenticate()
    .then(() => {
      Logger.info("DB Connection has been established successfully");
    })
    .catch((err) => {
      Logger.error("Unable to connect to the database:", err);
      throw new Error(err);
    });
};
