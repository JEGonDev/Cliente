import { API } from './../../../common/config/api'
import {jwtDecode} from 'jwt-decode'

// Objeto con funciones de autenticacion
export const authService = {
  // Registro: envía {username, password, …}
  register: async (userData) => {
    try {
      const response = await API.post('/auth/register', userData);
      const { token } = response.data;
      // Almacenamos token
      localStorage.setItem('jwtToken', token);
      // Decodificar y almacenar datos del usuario
      const decodedToken = jwtDecode(token);
      localStorage.setItem('user', JSON.stringify({
        username: decodedToken.sub,
        authorities: [decodedToken.role]
      }));
      return { token };
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
      const { token } = response.data;
      // Almacena el JWT en localStorage
      localStorage.setItem('jwtToken', token);
      
      // Decodificar el token y almacenar información del usuario
      const decodedToken = jwtDecode(token);
      localStorage.setItem('user', JSON.stringify({
        username: decodedToken.sub,
        authorities: [decodedToken.role]
      }));
      
      return { 
        token,
        user: {
          username: decodedToken.sub,
          authorities: [decodedToken.role]
        }
      };
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
    const token = localStorage.getItem('jwtToken');
    if (!token) return false;
    
    try {
      // Verificar si el token ha expirado
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decodedToken.exp < currentTime) {
        // Token expirado, limpiar almacenamiento
        authService.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar token:', error);
      return false;
    }
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
  },
  
  // Comprueba si el usuario actual tiene rol de moderador
  isModerator: () => {
    const user = authService.getCurrentUser();
    return user && user.authorities && 
          user.authorities.some(auth => auth === 'MODERADOR');
  },
  
  // Comprueba si el usuario actual tiene un rol específico
  hasRole: (role) => {
    const user = authService.getCurrentUser();
    return user && user.authorities && 
          user.authorities.some(auth => auth === role);
  },

  // Obtener el JWT actual (útil para preparar la transición a cookies)
  getToken: () => {
    return localStorage.getItem('jwtToken');
  },

  // Analiza el token JWT sin validarlo
  parseToken: (token) => {
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error al parsear token:', error);
      return null;
    }
  },

  // Solicitar recuperación de contraseña
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

  // Reiniciar contraseña con token
  resetPassword: async (passwordResetData) => {
    try {
      const response = await API.post('/auth/reset-password', passwordResetData);
      return response.data;
    } catch (error) {
      console.error('Error al reiniciar la contraseña:', error);
      throw error;
    }
  },
};