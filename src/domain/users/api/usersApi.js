import api from "@/api/api";
import { BASE_URL } from "@/domain/users/config/constants"

const register = async (userData) => {
    return api.post(`${BASE_URL}/`, userData);
};

export {
  register
};