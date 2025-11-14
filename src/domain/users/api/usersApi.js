import api from "@/api/api";
import { BASE_URL } from "@/domain/users/config/constants"

const register = async (userData) => {
    return api.post(`${BASE_URL}/`, userData);
};



// New endpoints (auth required)
export const getMe = async () => api.get(`${BASE_URL}/`);
export const updateMe = async (payload) => api.put(`${BASE_URL}/`, payload);


export {
  register
};