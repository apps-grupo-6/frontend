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
      const data = await api.login(credentials);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);
      
      if (status == 400 && specificCode == "0411")
        throw new Error("La cuenta no está activada.");

      if (status == 400 && specificCode == "0412")
        throw new Error("La cuenta está bloqueada. Si crees que se trata de un error, contacta al soporte.");

      if (status == 404 || (status == 400 && specificCode == "0410"))
        throw new Error("Usuario o contraseña invalidos.");
      
      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  },

  /**
   * Requests to confirm user's account (can be used without being logged-in)
   * Does not validate if it's an valid username because register does it already
   * @param {Object} userData - { username }
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
   * @param {Object} userData - { username, [new_password] }
   * @returns {Promise<Object>} - server response
   */
  async recoverAccount(userData) {
    isValidUsername(userData.username)

    try{
      const data = await api.recoverAccount(userData);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);

      if (status == 404 && specificCode == "0404")
        throw new Error("El usuario ingresado no existe.");

      if (status == 400 && specificCode == "0410")
        throw new Error("La cuenta está bloqueada. Si crees que se trata de un error, contacta al soporte.");
      
      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  },

  async refreshToken() {
    return await api.refreshToken();
  },

  async logout() {
    return await api.logout();
  },
};
