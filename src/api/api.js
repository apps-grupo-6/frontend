import axios from "axios";
import env from "@/config/env";
import { logApiResponse } from "@/core/logger";

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => {
    logApiResponse(response)
    return response.data;
  },
  (error) => {
    logApiResponse(error)
    return Promise.reject(error);
  }
);

export default api;