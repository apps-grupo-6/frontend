const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

module.exports = ({ config }) => ({
  ...config,
  plugins: [
    "expo-secure-store",
    "expo-local-authentication"
  ],
  android: {
    ...config.android,
    config: {
      googleMaps: {
        apiKey: process.env.GOOGLE_MAPS_API_KEY,
      },
    },
  },
  extra: {
    API_URL: process.env.API_URL,
    eas: {
      projectId: process.env.EAS_PROJECT_ID,
    }
  },
});