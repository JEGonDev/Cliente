import {jwtDecode} from 'jwt-decode';

/**
 * Servicio para el manejo de tokens y cookies
 * Esta abstracción permite una fácil transición de localStorage a cookies en el futuro
 */
export const tokenService = {
  // Clave utilizada para almacenar el token
  TOKEN_KEY: 'jwtToken',
  
  // Clave utilizada para almacenar datos del usuario
  USER_KEY: 'user',
  
  /**
   * Guarda el token de autenticación
   * @param {string} token - Token JWT
   */
  setToken: (token) => {
    // ACTUAL: Usar localStorage
    localStorage.setItem(tokenService.TOKEN_KEY, token);
    
    // FUTURO: La versión futura usará cookies seguras
    // Cuando migremos a cookies, solo modificaremos esta función
    // document.cookie = `${tokenService.TOKEN_KEY}=${token}; path=/; secure; samesite=strict`;
  },
  
  /**
   * Obtiene el token actual
   * @returns {string|null} Token JWT o null si no existe
   */
  getToken: () => {
    // ACTUAL: Usar localStorage
    return localStorage.getItem(tokenService.TOKEN_KEY);
    
    // FUTURO: La versión futura obtendrá el token de cookies
    // const cookieValue = document.cookie
    //   .split('; ')
    //   .find(row => row.startsWith(`${tokenService.TOKEN_KEY}=`))
    //   ?.split('=')[1];
    // return cookieValue || null;
  },
  
  /**
   * Elimina el token (logout)
   */
  removeToken: () => {
    // ACTUAL: Usar localStorage
    localStorage.removeItem(tokenService.TOKEN_KEY);
    
    // FUTURO: La versión futura eliminará la cookie
    // document.cookie = `${tokenService.TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
  
  /**
   * Decodifica el token JWT (sin validar)
   * @param {string} token - Token JWT a decodificar
   * @returns {Object|null} Contenido decodificado del token o null si hay error
   */
  decodeToken: (token) => {
    if (!token) return null;
    
    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Error al decodificar token:', error);
      return null;
    }
  },
  
  /**
   * Extrae información del usuario del token JWT
   * @returns {Object|null} Datos del usuario o null si no hay token válido
   */
  getUserFromToken: () => {
    const token = tokenService.getToken();
    if (!token) return null;
    
    try {
      const decoded = tokenService.decodeToken(token);
      if (!decoded) return null;
      
      // Crear objeto de usuario a partir del token
      return {
        username: decoded.sub,
        authorities: [decoded.role],
        // Podemos agregar más campos según lo que contenga el token
        exp: decoded.exp,
        iat: decoded.iat
      };
    } catch (error) {
      console.error('Error al obtener usuario del token:', error);
      return null;
    }
  },
  
  /**
   * Verifica si el token actual es válido (no expirado)
   * @returns {boolean} true si el token es válido, false si no
   */
  isTokenValid: () => {
    const token = tokenService.getToken();
    if (!token) return false;
    
    try {
      const decoded = tokenService.decodeToken(token);
      if (!decoded || !decoded.exp) return false;
      
      // Verificar expiración
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.error('Error al validar token:', error);
      return false;
    }
  },
  
  /**
   * Guarda datos del usuario
   * @param {Object} userData - Datos del usuario a guardar
   */
  setUserData: (userData) => {
    if (!userData) return;
    
    // ACTUAL: Usar localStorage
    localStorage.setItem(tokenService.USER_KEY, JSON.stringify(userData));
    
    // FUTURO: Podría usar cookies o sessionStorage según necesidad
  },
  
  /**
   * Obtiene los datos del usuario almacenados
   * @returns {Object|null} Datos del usuario o null si no hay datos
   */
  getUserData: () => {
    // ACTUAL: Usar localStorage
    const userStr = localStorage.getItem(tokenService.USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error al parsear datos de usuario:', error);
      return null;
    }
  },
  
  /**
   * Elimina los datos del usuario
   */
  removeUserData: () => {
    // ACTUAL: Usar localStorage
    localStorage.removeItem(tokenService.USER_KEY);
    
    // FUTURO: Eliminará cookies si es necesario
  },
  
  /**
   * Verifica si el usuario actual tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean} true si el usuario tiene el rol, false si no
   */
  hasRole: (role) => {
    const userData = tokenService.getUserData();
    if (!userData || !userData.authorities) return false;
    
    return userData.authorities.includes(role);
  },
  
  /**
   * Verifica si el usuario es administrador
   * @returns {boolean} true si el usuario es administrador, false si no
   */
  isAdmin: () => {
    return tokenService.hasRole('ADMINISTRADOR');
  },
  
  /**
   * Verifica si el usuario es moderador
   * @returns {boolean} true si el usuario es moderador, false si no
   */
  isModerator: () => {
    return tokenService.hasRole('MODERADOR');
  }
};