import { createContext, useState, useEffect, useContext } from 'react';
import { profileService } from '../services/profileService';
import { AuthContext } from '../../authentication/context/AuthContext';

// Creamos el contexto para el perfil
export const ProfileContext = createContext({
  // Estado del perfil
  profile: null,
  loading: false,
  error: null,
  
  // Funciones para gestionar el perfil
  getUserProfile: async (username) => {},
  updateUserProfile: async (updateData) => {},
  deleteUserAccount: async () => {},
  
  // Función de utilidad
  resetProfileState: () => {}
});

// Proveedor de contexto que encapsula la lógica del perfil
export const ProfileProvider = ({ children }) => {
  // Accedemos al contexto de autenticación para obtener datos del usuario autenticado
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  
  // Estado para el perfil
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Efecto para cargar los datos del perfil al montar el componente si el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      getUserProfile(user.username);
    }
  }, [isAuthenticated, user]);
  
  /**
   * Obtiene el perfil de un usuario por su nombre de usuario
   * @param {string} username - Nombre de usuario a buscar
   */
  const getUserProfile = async (username) => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileService.getUserByUsername(username);
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo perfil de ${username}:`, error);
      setError(error.message || `Error al cargar el perfil de ${username}`);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Actualiza el perfil del usuario actual
   * @param {Object} updateData - Datos a actualizar
   */
  const updateUserProfile = async (updateData) => {
    if (!isAuthenticated || !user) {
      setError('Necesitas iniciar sesión para actualizar tu perfil');
      return null;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await profileService.updateUserInfo(user.id, updateData);
      // Actualizamos el perfil en el estado
      setProfile(response.data);
      return response.data;
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      setError(error.message || 'Error al actualizar el perfil');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Elimina la cuenta del usuario actual
   */
  const deleteUserAccount = async () => {
    if (!isAuthenticated || !user) {
      setError('Necesitas iniciar sesión para eliminar tu cuenta');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      await profileService.deleteUser(user.id);
      // Al eliminar el usuario, cerramos su sesión
      logout();
      return true;
    } catch (error) {
      console.error('Error eliminando cuenta:', error);
      setError(error.message || 'Error al eliminar la cuenta');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  /**
   * Resetea el estado del perfil
   */
  const resetProfileState = () => {
    setProfile(null);
    setError(null);
  };
  
  // Valor del contexto que exponemos a componentes consumidores
  const value = {
    // Estado del perfil
    profile,
    loading,
    error,
    
    // Funciones para gestionar el perfil
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    
    // Función de utilidad
    resetProfileState
  };
  
  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

// Hook personalizado para acceder al contexto del perfil
export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfileContext debe ser usado dentro de un ProfileProvider');
  }
  return context;
};