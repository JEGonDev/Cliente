import { API } from './../../../common/config/api'

// Objeto con funciones de autenticacion
export const authService = {
  // Registro: envía {username, password, …}
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      const { token, user } = response.data;
      // Almacenamos token y datos del usuario
      localStorage.setItem('jwtToken', token);
      return { token, user };
    } catch (error) {
      console.error('Error durante el registro:', error);
      throw error;
    }
  },

  // Registro usuario administrador (requiere autenticación previa como administrador)
  registerAdmin: async (userData) => {
    try {
      // Obtener el token para la autorización
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No hay sesión activa o no tienes permisos suficientes');
      }
      
      // Configurar la cabecera de autorización
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await API.post('/auth/admin/register', userData, config);
      return response.data;
    } catch (error) {
      console.error('Error durante el registro de admin:', error);
      throw error;
    }
  },

  // Login: envía {username, password}, recibe {token, user}
  login: async (credentials) => {
    try {
      const response = await API.post('/auth/login', credentials);
      const { token, user } = response.data;
      // Almacena el JWT en localStorage
      localStorage.setItem('jwtToken', token);
      return { token, user };
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error;
    }
  },

  // Logout: borra el JWT y la sesión
  logout: () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  },

  // Comprueba si hay sesión activa
  isAuthenticated: () => {
    return !!localStorage.getItem('jwtToken');
  },
  
  // Obtiene el usuario actual
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
  
  // Comprueba si el usuario actual tiene rol de administrador
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.authorities && 
          user.authorities.some(auth => auth === 'ADMINISTRADOR');
  }
};