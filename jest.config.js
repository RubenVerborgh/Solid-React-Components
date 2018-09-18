module.exports = {
  clearMocks: true,
  collectCoverage: true,
  setupFiles: [
    "<rootDir>/test/setup.js",
  ],
  testMatch: [
    "<rootDir>/test/**/*-test.(js|jsx)",
  ],
};
