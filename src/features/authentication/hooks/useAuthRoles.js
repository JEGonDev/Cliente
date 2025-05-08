import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado para verificar permisos y roles de usuario
 * 
 * Este hook proporciona funciones útiles para comprobar los roles y permisos
 * del usuario actual en cualquier componente de la aplicación.
 * 
 * @returns {Object} Objeto con funciones y propiedades para verificar roles
 */
export const useAuthRoles = () => {
  // Obtenemos los datos y funciones del contexto de autenticación
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    isModerator,
    hasRole 
  } = useContext(AuthContext);

  /**
   * Verifica si el usuario puede realizar acciones de administración
   * @returns {boolean} true si el usuario es administrador
   */
  const canManageSystem = () => {
    return isAdmin;
  };

  /**
   * Verifica si el usuario puede moderar contenido (admin o moderador)
   * @returns {boolean} true si el usuario es admin o moderador
   */
  const canModerateContent = () => {
    return isAdmin || isModerator;
  };

  /**
   * Verifica si el usuario puede acceder a una característica específica
   * Esta función es útil para características que requieren roles específicos
   * 
   * @param {Array} requiredRoles - Lista de roles que tienen acceso a la característica
   * @returns {boolean} true si el usuario tiene al menos uno de los roles requeridos
   */
  const canAccessFeature = (requiredRoles = []) => {
    if (!isAuthenticated || !user || !user.authorities) return false;
    
    // Si no se especifican roles, cualquier usuario autenticado tiene acceso
    if (requiredRoles.length === 0) return true;
    
    // Verificar si el usuario tiene al menos uno de los roles requeridos
    return requiredRoles.some(role => hasRole(role));
  };

  /**
   * Obtiene los roles del usuario actual
   * @returns {Array} Lista de roles del usuario o array vacío si no está autenticado
   */
  const getUserRoles = () => {
    if (!isAuthenticated || !user || !user.authorities) return [];
    return user.authorities;
  };

  return {
    // Re-exportamos las propiedades útiles del AuthContext
    isAuthenticated,
    isAdmin,
    isModerator,
    hasRole,
    user,
    
    // Funciones adicionales
    canManageSystem,
    canModerateContent,
    canAccessFeature,
    getUserRoles
  };
};