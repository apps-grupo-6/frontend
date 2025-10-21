import api from "@/api/api";
import { BASE_URL } from "@/domain/otp/config/constants"

const createOtp = async (type) => {
    console.log(type)
    return api.post(`${BASE_URL}/`, type);
};


const resendOtp = (userData) => {
    return api.post(`${BASE_URL}/resend`, userData);
};

export {
  createOtp,
  resendOtp
};