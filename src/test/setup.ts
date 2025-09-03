// Test setup file for Vitest
import '@testing-library/jest-dom';

// Global test setup
global.console = {
  ...console,
  // Uncomment to suppress console logs during tests
  // log: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
