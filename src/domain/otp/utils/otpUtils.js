import { VALID_TYPES } from "../config/constants"

/**
 * Checks if otpToken is valid
 * @param {Object} otpTokenData - { otpToken, otp_type, [username] }
 * @returns {Promise<Object>} - server response
 */
export function isValidOtp(otpTokenData) {
    if (!otpTokenData)
        throw new Error(`otpTokenData's empty in otpUtils.isValidOtp().`);

    if (!otpTokenData.type)
        throw new Error(`type's value is empty in otpUtils.isValidOtp().`);

    if (!VALID_TYPES.includes(otpTokenData.type))
        throw new Error(`type's value is invalid ('${otpTokenData.type}') in otpUtils.isValidOtp().`);

    if ("username" in otpTokenData) {
        if (!otpTokenData.username)
            throw new Error(`username's value is empty in otpUtils.isValidOtp().`);
    }
}