const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

module.exports = ({ config }) => ({
  ...config,
  extra: {
    API_URL: process.env.API_URL,
    USE_MOCKS: process.env.USE_MOCKS || "false",
  },
});
