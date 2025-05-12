import axios from 'axios';
import { Storage } from '../../storage/Storage';

// Creamos una instancia base de Axios para toda la app.
//    - baseURL: punto de entrada de tu backend (configurable vía .env)
//    - timeout: tiempo máximo de espera (ms)
//    - headers: headers por defecto para todas las peticiones
export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true // Importante para enviar cookies en peticiones cross-origin
});

// Estado global para controlar redirecciones de sesión expirada
let isRefreshing = false;
let authRedirectCallback = null;

/**
 * Establece una función callback para manejar redirecciones por sesión expirada.
 * Esta función debe ser llamada desde el componente principal que pueda navegar.
 * 
 * @param {Function} callback - Función que redirecciona a la página de login
 */
export const setAuthRedirectCallback = (callback) => {
  authRedirectCallback = callback;
};

// Interceptor de petición: se ejecuta ANTES de cada llamada.
API.interceptors.request.use(
  config => {
    // Las cookies se envían automáticamente con withCredentials: true
    
    // Si hay un token almacenado, incluirlo en los headers
    const authToken = Storage.get('authToken');
    if (authToken) {
      config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta: maneja errores de autenticación y otros.
API.interceptors.response.use(
  response => response, // Todo OK - paso directamente la respuesta
  error => {
    // Manejar errores específicos de autenticación
    if (error.response && error.response.status === 401) {
      // Sesión expirada o usuario no autenticado
      console.warn('Sesión expirada o usuario no autenticado');
      
      // Evitar múltiples redirecciones
      if (!isRefreshing && authRedirectCallback) {
        isRefreshing = true;
        
        // Redirigir al login
        authRedirectCallback();
        
        // Resetear el flag después de un tiempo
        setTimeout(() => {
          isRefreshing = false;
        }, 1000);
      }
    }
    
    // Logging centralizado de errores
    if (error.response) {
      // El servidor respondió con un código de error
      console.error(
        `[API Error] Status: ${error.response.status} -`,
        error.response.data
      );
    } else if (error.request) {
      // La petición salió pero no hubo respuesta
      console.error('[API Error] No hubo respuesta:', error.request);
    } else {
      // Error al configurar la petición
      console.error('[API Error] Configuración fallida:', error.message);
    }
    
    return Promise.reject(error);
  }
);