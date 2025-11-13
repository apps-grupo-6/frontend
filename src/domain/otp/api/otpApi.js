import api from "@/api/api";
import { BASE_URL } from "@/domain/otp/config/constants"

const startOtp = async (otp) => {
    return api.post(`${BASE_URL}/`, otp);
};

const resendOtp = (userData) => {
    return api.post(`${BASE_URL}/resend`, userData);
};

export {
  startOtp,
  resendOtp
};