module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "<rootDir>/src/**/*.(js|jsx)",
  ],
  setupFiles: [
    "<rootDir>/test/setup.js",
  ],
  testMatch: [
    "<rootDir>/test/**/*-test.(js|jsx)",
  ],
};
