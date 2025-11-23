import api from "@/api/api";
import { BASE_URL } from "@/domain/auth/config/constants"

const login = (credentials) => {
  return api.post(`${BASE_URL}/`, credentials);
};

const confirmAccount = (userData) => {
  return api.post(`${BASE_URL}/confirm-account`, userData);
};

const recoverAccount = (userData) => {
  return api.post(`${BASE_URL}/recover`, userData);
};

const refreshToken = (jwt_token) => {
  return api.post(`${BASE_URL}/refresh`, jwt_token);
};

const logout = async () => {
  return await api.post(`${BASE_URL}/logout`);
};

export {
  login,
  confirmAccount,
  recoverAccount,
  refreshToken,
  logout
};