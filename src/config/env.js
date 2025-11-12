import Constants from "expo-constants";

const extra = Constants.expoConfig.extra;
export default {
  apiUrl: extra.API_URL,
  useMocks: String(extra.USE_MOCKS).toLowerCase() === "true",
};
