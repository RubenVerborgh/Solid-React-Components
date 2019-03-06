module.exports = {
  collectCoverageFrom: [
    "<rootDir>/src/**/*.(js|jsx)",
  ],
  setupFilesAfterEnv: [
    "<rootDir>/test/setup.js",
  ],
  testMatch: [
    "<rootDir>/test/**/*-test.(js|jsx)",
  ],
};
