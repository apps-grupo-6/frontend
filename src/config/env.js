import { Platform } from "react-native";

const HOST = Platform.OS === "android" ? process.env.EXPO_PUBLIC_API_URL_ANDROID : process.env.EXPO_PUBLIC_API_URL_WEB;

export default {
  apiUrl: HOST,
};