import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Proporciona acceso a toda la funcionalidad relacionada con la autenticación:
 * - Estados de usuario y sesión
 * - Funciones para login, registro, logout
 * - Utilidades para verificación de roles
 * 
 * @returns {Object} Contexto completo de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error(
      'useAuth debe ser utilizado dentro de un AuthProvider'
    );
  }
  
  return context;
};