/**
 * Checks if user's username is valid
 * @param {String} username - username
 * @returns {Promise<Object>} - server response
 */
export function isValidUsername(username) {
  if (!username)
    throw new Error("Por favor, ingresa un usuario.");

  const usernameLength = username.length
  if (usernameLength < 6 || usernameLength > 12)
    throw new Error(`El usuario que ingresó tiene ${usernameLength} caracteres y debe tener entre 6 y 12.`);
}

/**
 * Checks if user's password is valid
 * @param {String} password - password
 * @returns {Promise<Object>} - server response
 */
export function isValidPassword(password) {
  if (!password)
    throw new Error("Por favor, ingresa una contraseña.");

  const passwordLength = password.length
  if (passwordLength < 8 || passwordLength > 20)
    throw new Error(`La nueva contraseña que ingresó tiene ${passwordLength} caracteres y debe tener entre 8 y 20.`);
}