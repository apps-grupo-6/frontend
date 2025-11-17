import api from "@/api/api";
import { BASE_URL } from "@/domain/auth/config/constants"

const login = (credentials) => {
  return api.post(`${BASE_URL}/`, credentials);
};

const confirmAccount = (userData) => {
  return api.post(`${BASE_URL}/confirmAccount`, userData);
};

const recoverAccount = (userData) => {
  return api.post(`${BASE_URL}/recover`, userData);
};

const refreshToken = (jwt_token) => {
  return api.post(`${BASE_URL}/refresh`, jwt_token);
};

export {
  login,
  confirmAccount,
  recoverAccount,
  refreshToken
};