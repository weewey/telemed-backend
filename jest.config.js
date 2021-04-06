process.env.TZ='Asia/Singapore';

module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    "./src/**",
    "!./src/**/*.json"
  ],
  coveragePathIgnorePatterns: [
    "<rootDir>/src/app.ts",
    "<rootDir>/src/server.ts",
    "<rootDir>/src/migrations/*",
    "<rootDir>/src/utils/db-connection.ts",
    "<rootDir>/src/config/*"
  ],
  coverageDirectory: "coverage",
  setupFilesAfterEnv: [ "<rootDir>/__tests__/helpers/setup.ts" ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60
    }
  },
  reporters: [
    "default",
    [ "./node_modules/jest-html-reporter", {
      "pageTitle": "Test Report"
    } ]
  ],
  testEnvironment: "node",
  testMatch: [ "**/__tests__/**/*.test.[jt]s?(x)" ],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/coverage/",
    "<rootDir>/dist/",
    "<rootDir>/__tests__/__mocks__",
    "<rootDir>/__tests__/mock-data/"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
