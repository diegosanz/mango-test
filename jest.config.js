module.exports = {
  preset: "jest-puppeteer",
  globals: {
    URL: "http://localhost:8080",
  },
  testMatch: ["**/(test|e2e)/**/*.test.js"],
  verbose: true,
};
