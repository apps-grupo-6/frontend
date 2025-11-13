import * as api from "@/domain/otp/api/otpApi";
import { VALID_TYPES } from "../config/constants"
import { getResponseCodes } from "@/utils/httpCodeParser";

export const OtpService = {
  /**
   * Requests to create an otp_token by type (it's required to be logged-in)
   * @param {Object} otp - { type }
   * @returns {Promise<Object>} - server response
   */
  async startOtp(otp) {
    if (!otp)
      throw new Error("otp is empty in otpService.startOtp().");

    if (!VALID_TYPES.includes(otp.type)) 
      throw new Error(`type's value is invalid ('${otp.type}') in otpService.startOtp().`);

    try{
      const data = await api.startOtp(otp);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);

    }
  },

  /**
   * Requests to resend an otp_token type (can be used without being logged-in)
   * @param {Object} credentials - { username, type }
   * @returns {Promise<Object>} - server response
   */
  async resendOtp(userData) {
    if (!userData)
      throw new Error(`userData's empty in otpService.resendOtp().`);

    if (!userData.type)
      throw new Error(`type's value is empty in otpService.resendOtp().`);

    if (!VALID_TYPES.includes(userData.type))
      throw new Error(`type's value is invalid ('${type}') in otpService.resendOtp().`);

    const data = await api.resendOtp(userData);
    return data;
  }
}