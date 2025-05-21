import { API } from '../../../common/config/api';

/**
 * Servicio para la gestión del perfil de usuario
 */
export const profileService = {

  /**
   * Obtiene información de un usuario por su ID
   * @param {number} userId - ID del usuario a consultar
   * @returns {Promise<Object>} Datos del usuario
   */
  getUserById: async (userId) => {
    try {
      // Basado en el controlador que has compartido, la URL debería ser:
      const response = await API.get(`/users/${userId}`);
      
      // El controlador devuelve un ApiResponseDTO que contiene el campo 'data'
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error al obtener datos del usuario ${userId}:`, error);
      throw error;
    }
  },  
  
  /**
   * Obtiene la información de un usuario por su nombre de usuario
   * @param {string} username - Nombre de usuario a buscar
   * @returns {Promise} Datos del usuario encontrado
   */
  getUserByUsername: async (username) => {
    try {
      const response = await API.get(`/users/username/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo usuario ${username}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza la información de un usuario
   * @param {number} userId - ID del usuario a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Resultado de la operación
   */
  updateUserInfo: async (userId, updateData) => {
    try {
      const response = await API.put(`/users/update/${userId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando usuario ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un usuario
   * @param {number} userId - ID del usuario a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteUser: async (userId) => {
    try {
      const response = await API.delete(`/users/delete/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando usuario ${userId}:`, error);
      throw error;
    }
  }
};