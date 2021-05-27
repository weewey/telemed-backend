const password = process.env.DB_PASSWORD;

const minPoolSize = process.env.DB_MIN_POOL_SIZE ?
  parseInt(process.env.DB_MIN_POOL_SIZE, 10) : 10;

const maxPoolSize = process.env.DB_MAX_POOL_SIZE ?
  parseInt(process.env.DB_MAX_POOL_SIZE, 10) : 50;

const firebaseConfig = process.env.FIREBASE_CONFIG;

const defaultConfig = {
  username: "postgres",
  host: "localhost",
  password,
  database: "qdoc",
  dialect: "postgres",
  pool: {
    min: minPoolSize,
    max: maxPoolSize,
  },
  firebaseConfig,
};

const username = process.env.DB_SERVER_NAME ?
  `${process.env.DB_USER}@${process.env.DB_SERVER_NAME}` :
  process.env.DB_USER;

const environmentConfig = {
  username,
  host: process.env.DB_HOST,
  password,
  database: process.env.DB_DATABASE,
  firebaseConfig,
};
const currentConfig = defaultConfig;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const mergeConfigs = (config, overriderConfig) => {
  const finalConfig = {};
  Object.keys(config).forEach((property) => {
    finalConfig[property] = overriderConfig[property] ? overriderConfig[property] : config[property];
  });
  return finalConfig;
};

const baseConfig = mergeConfigs(currentConfig, environmentConfig);

module.exports = {
  local: baseConfig,
  staging: {
    ...baseConfig,
  },
  test: {
    ...baseConfig,
    logging: false,
    database: "qdoc_test",
  },
  ci: {
    ...baseConfig,
    logging: false,
  },
  prod: {
    ...baseConfig,
  },
};
