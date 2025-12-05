import * as api from "@/domain/otp/api/otpApi";
import { getResponseCodes } from "@/utils/httpCodeParser";
import { isValidOtp } from "../utils/otpUtils";

export const OtpService = {
  /**
   * Requests to create an otpToken by type (can be used without being logged-in)
   * @param {Object} otp - { username, type }
   * @returns {Promise<Object>} - server response
   */
  async createOtp(otp) {
    isValidOtp(otp);

    try{
      const data = await api.createOtp(otp);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      console.log(status, specificCode);
    }
  },

  /**
   * Requests to resend an otpToken type (can be used without being logged-in)
   * @param {Object} otp - { username, type }
   * @returns {Promise<Object>} - server response
   */
  async resendOtp(otp) {
    isValidOtp(otp);

    try{
      const data = await api.resendOtp(otp);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      console.log(status, specificCode);
    }
  },

  /**
   * Requests to check if an otpToken is valid (can be used without being logged-in)
   * @param {Object} otp - { username, type, otp_token }
   * @returns {Promise<Object>} - server response
   */
  async checkOtp(otp) {
    isValidOtp(otp);

    try{
      const data = await api.checkOtp(otp);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      console.log(status, specificCode);
    }
  },

  /**
   * Requests to delete an otpToken (can be used without being logged-in)
   * @param {string} id - otpToken id
   * @returns {Promise<Object>} - server response
   */
  async deleteOtp(id) {
    try{
      const data = await api.deleteOtp(id);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      console.log(status, specificCode);
    }
  }
}