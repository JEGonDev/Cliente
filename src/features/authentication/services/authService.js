import { API } from '../../../common/config/api'

/**
 * Servicio simplificado de autenticación que trabaja con cookies HTTP-only
 * y mantiene compatibilidad con el sistema existente.
 */
export const authService = {
  /**
   * Inicia sesión enviando credenciales al servidor.
   * El backend establece una cookie HTTP-only con el JWT.
   * 
   * @param {Object} credentials - Credenciales {username, password}
   * @returns {Promise<Object>} - Datos del usuario autenticado
   */
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      console.log('Login exitoso:', response.data);
      return response.data;

    } catch (error) {
      console.error('Error durante el login:', error);
      throw error;
    }
  },

  /**
   * Registra un nuevo usuario y establece la sesión.
   * 
   * @param {Object} userData - Datos del usuario para registro
   * @returns {Promise<Object>} - Datos del usuario registrado
   */
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw error;
    }
  },

  /**
   * Registra un nuevo administrador (requiere autenticación previa como admin).
   * 
   * @param {Object} userData - Datos del usuario administrador
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  registerAdmin: async (userData) => {
    try {
      const response = await API.post('/auth/admin/register', userData);
      return response.data;
    } catch (error) {
      console.error('Error durante el registro de admin:', error);
      throw error;
    }
  },

  /**
   * Cierra la sesión del usuario.
   * El backend invalidará la cookie JWT.
   * 
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Error durante el logout:', error);
    }
  },

  /**
   * Realiza una petición de prueba para verificar si el usuario está autenticado.
   * Usa un endpoint de tu aplicación que requiera autenticación.
   * 
   * @returns {Promise<boolean>} - true si está autenticado
   */
  checkSession: async () => {
    try {
      await API.get('/auth/check');
      return true;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return false;
      }
      // Lanzamos el error para que el contexto decida qué hacer
      throw error;
    }
  },

  /**
   * Solicita recuperación de contraseña.
   * 
   * @param {string} email - Email del usuario
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  forgotPassword: async (email) => {
    try {
      const response = await API.post('/auth/forgot-password', null, {
        params: { email }
      });
      return response.data;
    } catch (error) {
      console.error('Error al solicitar recuperación de contraseña:', error);
      throw error;
    }
  },

  /**
   * Reinicia contraseña con token.
   * 
   * @param {Object} passwordResetData - Datos para reinicio de contraseña
   * @returns {Promise<Object>} - Respuesta del servidor
   */
  resetPassword: async (passwordResetData) => {
    try {
      const response = await API.post('/auth/reset-password', passwordResetData);
      return response.data;
    } catch (error) {
      console.error('Error al reiniciar la contraseña:', error);
      throw error;
    }
  }
};