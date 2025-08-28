// Simple Jest configuration for ES modules
export default {
  preset: null,
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],
  transform: {},
  extensionsToTreatAsEsm: [".js"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{js,astro}",
    "!src/**/*.test.js",
    "!src/**/*.config.js",
  ],
  coverageDirectory: "tests/coverage",
  coverageReporters: ["text", "lcov", "html"],
  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],
};
