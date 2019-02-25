module.exports = {
  clearMocks: true,
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
