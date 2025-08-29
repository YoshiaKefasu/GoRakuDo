// Jest configuration for CommonJS with jsdom support
module.exports = {
  preset: null,
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  transform: {},
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^astro:content$": "<rootDir>/tests/mocks/astro-content.js",
    "^fs/promises$": "<rootDir>/tests/mocks/fs-promises.js",
    "^path$": "<rootDir>/tests/mocks/path.js",
  },
  collectCoverageFrom: [
    "src/**/*.{js,astro}",
    "!src/**/*.test.js",
    "!src/**/*.config.js",
  ],
  coverageDirectory: "tests/coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};
