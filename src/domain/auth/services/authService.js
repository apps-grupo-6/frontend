import * as api from "@/domain/auth/api/authApi";
import { getResponseCodes } from "@/utils/httpCodeParser";
import { isValidUsername, isValidPassword } from "@/domain/auth/utils/authUtils"

export const AuthService = {
  /**
   * Requests to login (can be used without being logged-in)
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>} - server response
   */
  async login(credentials) {
    if (!credentials)
      throw new Error("Por favor, ingresa un usuario y contraseña.");
    
    isValidUsername(credentials.username)
    isValidPassword(credentials.password)
    
    try{
      const data = await api.loginRequest(credentials);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      
      if (status == 400 && specificCode == "0411")
        throw new Error("La cuenta no está activada.");

      if (status == 404 || (status == 400 && specificCode == "0410"))
        throw new Error("Usuario o contraseña invalidos.");
      

      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  },
  /**
   * Requests to use otp_token as MFA (can be used without being logged-in)
   * @param {Object} otp_token - { username, otp_token }
   * @returns {Promise<Object>} - server response
   */
  async loginOtp(userData) {
    if (!userData || !userData.otp_token)
      throw new Error("Por favor, ingresa tu código de acceso.");

    try{
      const data = await api.loginOtp(userData);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      
      if (status == 400 && specificCode == "0410")
        throw new Error("El código ingresado ya expiró. Solicita un nuevo.");
      
      if (status == 404)
        throw new Error("El código ingresado es inválido.");

      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  },

  /**
   * Requests to confirm user's account (it's required to be logged-in)
   * @param {Object} userData - { username, otpToken }
   * @returns {Promise<Object>} - server response
   */
  async confirmAccount(userData) {
    try{
      const data = await api.confirmAccount(userData);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      
      if (status == 400 && specificCode == "0410")
        throw new Error("El código ingresado ya expiró. Solicita un nuevo.");
      
      if (status == 404)
        throw new Error("El código ingresado es inválido.");

      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  },

  /**
   * Requests to recover user's account (can be used without being logged-in)
   * @param {Object} username - { username }
   * @returns {Promise<Object>} - server response
   */
  async recoverAccount(username) {
    isValidUsername(username.username)

    try{
      const data = await api.recoverAccount(username);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);

      if (status == 404 && specificCode == "0404")
        throw new Error("El usuario ingresado no existe.");

      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  },

  /**
   * Requests to update account's password (can be used without being logged-in)
   * @param {Object} userData - { username, new_password, otp_token }
   * @returns {Promise<Object>} - server response
   */
  async recoverAccountOtp(userData) {
    try{
      const data = await api.recoverAccountOtp(userData);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      
      if (status == 400 && specificCode == "0410")
        throw new Error("El código ingresado ya expiró. Solicita un nuevo.");
      
      if (status == 404 && specificCode == "0405")
        throw new Error("El código ingresado es inválido.");

      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  },
  /**
   * Requests to refresh user's jwtToken
   * @param {Object} jwtToken - { jwtToken }
   * @returns {Promise<Object>} - server response
   */
  async refreshToken(jwtToken) {
    const data = await api.refreshToken(jwtToken);
    return data;
  },
};
