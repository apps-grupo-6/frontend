import api from "@/api/api";
import { BASE_URL } from "@/domain/users/config/constants"

const register = async (userData) => {
  return api.post(`${BASE_URL}/`, userData);
};

const getMe = async () => {
  return api.get(`${BASE_URL}/`);
};

const updateMe = async (payload) => {
  return api.put(`${BASE_URL}/`, payload);
};

export {
  register, 
  getMe, 
  updateMe
};