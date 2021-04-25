import {sequelize, initDB} from "../../src/utils/db-connection";

beforeAll(async () => {
    await initDB();
});

afterAll(async () => {
    await sequelize.close();
});