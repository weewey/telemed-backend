'use strict';

const password = process.env.DB_PASSWORD;
const minPoolSize = process.env.DB_MIN_POOL_SIZE ?
    parseInt(process.env.DB_MIN_POOL_SIZE, 10) : 10;

const maxPoolSize = process.env.DB_MAX_POOL_SIZE ?
    parseInt(process.env.DB_MAX_POOL_SIZE, 10) : 50;

const defaultConfig = {
    username: "postgres",
    host: "localhost",
    password,
    database: "qdoc",
    dialect: "postgres",
    pool: {
        min: minPoolSize,
        max: maxPoolSize
    }
};

const username = process.env.DB_SERVER_NAME ?
    `${process.env.DB_USER}@${process.env.DB_SERVER_NAME}` :
    process.env.DB_USER;

const environmentConfig = {
    username,
    host: process.env.DB_HOST,
    password,
    database: process.env.DB_DATABASE,
};
const currentConfig = defaultConfig;

const mergeConfigs = (defaultConfig, overriderConfig) => {
    const finalConfig = {};
    Object.keys(defaultConfig).forEach((property) => {
        finalConfig[property] = overriderConfig[property] ? overriderConfig[property] : defaultConfig[property]
    });
    return finalConfig;
};

const baseConfig = mergeConfigs(currentConfig, environmentConfig);

module.exports = {
    local: baseConfig,
    test: {
        ...baseConfig,
        logging: false
    },
    dev: {
        ...baseConfig,
        ...{
            ssl: true,
            dialectOptions: {
                ssl: true
            },
        }
    },
    prod: {
        ...baseConfig,
        ...{
            ssl: true,
            dialectOptions: {
                ssl: true
            },
        }
    }
};
