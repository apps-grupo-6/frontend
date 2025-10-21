import * as api from "@/domain/auth/api/authApi";

export const AuthService = {
  /**
   * Requests to login (it's required to be logged-in)
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} - server response
   */
  async login(credentials) {
    if (!credentials){
      throw new Error("credentials' empty in authService.login().");
    }

    if (!credentials?.username) {
      throw new Error("username's value is empty in authService.login().");
    }

    if (!credentials?.password) {
      throw new Error("password's value is empty in authService.login().");
    }

    const data = await api.loginRequest(credentials);
    return data;
  },

  /**
   * Requests to confirm user's account (it's required to be logged-in)
   * @param {Object} userData - { username, otpToken }
   * @returns {Promise<Object>} - server response
   */
  async confirmAccount(userData) {
    if (!userData) {
      throw new Error("userData's empty in authService.confirmAccount().");
    }
    
    if (!userData?.username) {
      throw new Error("username's value is empty in authService.confirmAccount().");
    }

    if (!userData?.otpToken) {
      throw new Error("otpToken's value is empty in authService.confirmAccount().");
    }

    const data = await api.confirmAccount(userData);
    return data;
  },

  /**
   * Requests to use otpToken as MFA (can be used without being logged-in)
   * @param {Object} otpToken - { otpToken }
   * @returns {Promise<Object>} - server response
   */
  async loginOtp(otpToken) {
    if (!otpToken) {
      throw new Error("otpToken's empty in authService.loginOtp().");
    }

    const data = await api.loginOtp(otpToken);
    return data;
  },

  /**
   * Requests to recover user's account (can be used without being logged-in)
   * @param {Object} userData - { username, newPassword, otpToken }
   * @returns {Promise<Object>} - server response
   */
  async recoverAccount(userData) {
    if (!userData) {
      throw new Error("userData's empty in authService.recoverAccount().");
    }

    if (!userData?.username) {
      throw new Error("username's value is empty in authService.recoverAccount().");
    }

    if (!userData?.newPassword) {
      throw new Error("newPassword's value is empty in authService.recoverAccount().");
    }

    if (!userData?.otpToken) {
      throw new Error("otpToken's value is empty in authService.recoverAccount().");
    }

    const data = await api.recoverAccount(userData);
    return data;
  },

  /**
   * Requests to refresh user's jwtToken (it's required to be logged-in)
   * @param {Object} jwtToken - { jwtToken }
   * @returns {Promise<Object>} - server response
   */
  async refreshToken(jwtToken) {
    if (!jwtToken) {
      throw new Error("jwtToken's empty in authService.refreshToken().");
    }

    const data = await api.refreshToken(jwtToken);
    return data;
  },
};
