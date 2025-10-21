import * as api from "@/domain/otp/api/otpApi";
import { VALID_TYPES } from "../config/constants"

export const OtpService = {
  /**
   * Requests to create an otp_token by type (it's required to be logged-in)
   * @param {Object} credentials - { type }
   * @returns {Promise<Object>} - server response
   */
  async createOtp(type) {
    if (!type){
      throw new Error(`type's value is empty in otpService.createOtp().`);
    }

    if (!VALID_TYPES.includes(type)) {
      throw new Error(`type's value is invalid ('${type}') in otpService.createOtp().`);
    }

    console.log("ok")
    const data = await api.createOtp({type});
    return data;
  },

  /**
   * Requests to resend an otp_token type (can be used without being logged-in)
   * @param {Object} credentials - { username, type }
   * @returns {Promise<Object>} - server response
   */
  async resendOtp(userData) {
    if (!userData){
      throw new Error(`userData's empty in otpService.resendOtp().`);
    }

    if (!userData.type){
      throw new Error(`type's value is empty in otpService.resendOtp().`);
    }

    if (!VALID_TYPES.includes(userData.type)) {
      throw new Error(`type's value is invalid ('${type}') in otpService.resendOtp().`);
    }

    const data = await api.createOtp(type);
    return data;
  }
}