import * as api from "@/domain/users/api/usersApi";
import { getResponseCodes } from "@/utils/httpCodeParser";
import { isValidUsername, isValidPassword } from "@/domain/auth/utils/authUtils"

export const UsersService = {
  /**
   * Requests to create an account (can be used without being logged-in)
   * @param {Object} userData - { username, password, first_name, last_name, telephone, contact_email }
   * @returns {Promise<Object>} - server response
   */
  async register(userData) {
    if (!userData)
      throw new Error("Por favor, completa el formulario.");

    isValidUsername(userData.username)
    isValidPassword(userData.password)
    
    if (!userData.first_name) 
      throw new Error("Por favor, ingresa tu nombre.");

    if (!userData.last_name) 
      throw new Error("Por favor, ingresa tu apellido.");

    if (!userData.telephone) 
      throw new Error("Por favor, ingresa tu número de teléfono.");
    
    const telephoneLength = userData.telephone.length
    if (telephoneLength < 8 || telephoneLength > 14)
      throw new Error(`El número de teléfono que ingresó tiene ${telephoneLength} caracteres y debe tener entre 8 y 14.`);

    if (!/^\d+$/.test(userData.telephone))
      throw new Error("El número de teléfono solo puede contener números.");

    if (!userData.contact_email) 
      throw new Error("Por favor, ingresa tu email.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.contact_email))
      throw new Error("Por favor, ingresa un email válido.");

    try{
      const data = await api.register(userData);
      return data;
    } catch(e){
      const { status, specificCode } = getResponseCodes(e);

      if (status == 400 && specificCode == "0410")
        throw new Error("El usuario ingresado ya existe.")

      throw new Error("No se pudo procesar la solicitud. Por favor, intenta de nuevo más tarde.");
    }
  }
  ,
  /**
   * Get current user information
   */
  async getMe() {
    try {
      const res = await api.getMe();
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      throw new Error("No pudimos obtener tus datos.");
    }
  }
  ,
  /**
   * Update current user information
   * @param {Object} payload
   */
  async updateMe(payload) {
    try {
      const res = await api.updateMe(payload);
      return res?.data ?? res;
    } catch (e) {
      const { status } = getResponseCodes(e);
      if (status === 400) throw new Error("Revisá los datos ingresados.");
      if (status === 401) throw new Error("Sesión expirada. Iniciá sesión nuevamente.");
      throw new Error("No pudimos actualizar tus datos.");
    }
  }
}