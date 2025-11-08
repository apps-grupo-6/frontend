import axios from "axios";
import env from "@/config/env";
import { logApiResponse } from "@/core/logger";

const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  },
});

api.interceptors.response.use(
  (response) => {
    logApiResponse(response)
    return response.data;
  },
  async (error) => {
    logApiResponse(error)
    const response = error.response.status;

    if (response === 401 || response === 403) {          
      await logout();
    }

    return Promise.reject(error);
  }
);

export default api;