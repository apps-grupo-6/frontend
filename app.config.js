const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    "expo-secure-store",
    "expo-local-authentication"
  ],
  extra: {
    API_URL: process.env.API_URL
  },
});