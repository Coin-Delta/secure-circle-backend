export default {
  verbose: true,
  testEnvironment: "node",
  collectCoverage: true,
  setupFiles: ["dotenv/config"],
  collectCoverageFrom: [
    "src/**/*.js",
    "!**/__tests__/**",
    "!**/node_modules/**",
    "!**/coverage/**",
    "!**/tmp/**",
  ],
  coverageDirectory: "coverage/e2e",
};
