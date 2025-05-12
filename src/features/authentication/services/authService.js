import { API } from './../../../common/config/api'

// Objeto con funciones de autenticacion
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
      // Se guardan los datos del usuario en memoria
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
      // Se guardan los datos del usuario en memoria
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
      // La cookie ha sido invalidada por el backend
    } catch (error) {
      console.error('Error durante el logout:', error);
      // Incluso si hay error, consideramos el logout como exitoso del lado del cliente
    }
  },

  /**
   * Realiza una petición de prueba para verificar si el usuario está autenticado
   * mediante el manejo de errores 401.
   * No requiere un endpoint específico.
   * 
   * @returns {Promise<boolean>} - true si está autenticado
   */
  checkSession: async () => {
    try {
      await API.get('/auth/check');
      return true; // Si no hay error 401/403, está autenticado
    } catch (error) {
      if (error.response && error.response.status === 401 || error.response.status === 403) {
        return false; // Error 401/403 = No autenticado
      }
      // Para otros errores, asumimos que sigue autenticado (puede ser un error de red)
      return true;
    }
  },

  /**
   * Comprueba si el usuario tiene un rol específico.
   * 
   * @param {string} role - Rol a verificar
   * @param {Object} user - Datos del usuario
   * @returns {boolean} - true si tiene el rol
   */
  hasRole: (role, user) => {
    if (!user || !user.role) return false;
    return user.role === role;
  },
  
  /**
   * Comprueba si el usuario es administrador.
   * 
   * @param {Object} user - Datos del usuario
   * @returns {boolean} - true si es administrador
   */
  isAdmin: (user) => {
    return authService.hasRole('ADMINISTRADOR', user);
  },
  
  /**
   * Comprueba si el usuario es moderador.
   * 
   * @param {Object} user - Datos del usuario
   * @returns {boolean} - true si es moderador
   */
  isModerator: (user) => {
    return authService.hasRole('MODERADOR', user);
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