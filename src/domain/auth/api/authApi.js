import api from "@/api/api";
import { BASE_URL } from "@/domain/auth/config/constants"

const loginRequest = (credentials) => {
  return api.post(`${BASE_URL}/`, credentials);
};

const confirmAccount = (userData) => {
  return api.post(`${BASE_URL}/confirmAccount`, userData);
};

const loginOtp = (otpTokenEvent) => {
  return api.post(`${BASE_URL}/otp`, otpTokenEvent);
};

const recoverAccount = (userData) => {
  return api.post(`${BASE_URL}/recover`, userData);
};

const recoverAccountOtp = (userData) => {
  return api.post(`${BASE_URL}/recoverOtp`, userData);
};

const refreshToken = (jwt_token) => {
  return api.post(`${BASE_URL}/refresh`, jwt_token);
};

export {
  loginRequest, loginOtp,
  confirmAccount,
  recoverAccount, recoverAccountOtp,
  refreshToken
};