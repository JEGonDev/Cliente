import { API } from '../../../common/config/api';

/**
 * Servicio para la gestión del perfil de usuario
 */
export const profileService = {
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