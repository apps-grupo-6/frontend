import api from "@/api/api";
import { BASE_URL } from "@/domain/otp/config/constants"

const createOtp = async (otp) => {
    return api.post(`${BASE_URL}/`, otp);
};

const resendOtp = (userData) => {
    return api.post(`${BASE_URL}/resend`, userData);
};

const checkOtp = (otpData) => {
    return api.post(`${BASE_URL}/check`, otpData);
};

const deleteOtp = (id) => {
    return api.delete(`${BASE_URL}/${id}`);
}

export {
  createOtp,
  resendOtp,
  checkOtp,
  deleteOtp
};