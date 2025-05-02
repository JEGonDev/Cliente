import { API } from '../../../common/config/api';

/**
 * Servicio para la gestión de funcionalidades de comunidad
 */
export const communityService = {

  // ====================Peticiones para posts=======================

  /**
   * Crea un nuevo post
   * @param {Object} postData - Datos del post (postType, content, multimediaContent, groupId, threadId, file)
   * @returns {Promise} Resultado de la operación
   */
  createPost: async (postData) => {
    try {
      // Si hay archivo adjunto, usamos FormData
      if (postData.file) {
        const formData = new FormData();
        // Añadimos todos los campos al FormData
        Object.keys(postData).forEach(key => {
          if (key === 'file') {
            formData.append('file', postData.file);
          } else if (postData[key] !== null && postData[key] !== undefined) {
            formData.append(key, postData[key]);
          }
        });

        const response = await API.post('/posts', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response.data;
      } else {
        // Si no hay archivo, enviamos JSON normal
        const response = await API.post('/posts', postData);
        return response.data;
      }
    } catch (error) {
      console.error('Error creando post:', error);
      throw error;
    }
  },

  /**
   * Obtiene un post por su ID
   * @param {number} id - ID del post
   * @returns {Promise} Post encontrado
   */
  getPostById: async (id) => {
    try {
      const response = await API.get(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo post ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todos los posts
   * @returns {Promise} Lista de posts
   */
  getAllPosts: async () => {
    try {
      const response = await API.get('/posts');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo posts:', error);
      throw error;
    }
  },

  /**
   * Actualiza un post existente
   * @param {number} id - ID del post a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Post actualizado
   */
  updatePost: async (id, updateData) => {
    try {
      const response = await API.put(`/posts/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando post ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un post
   * @param {number} id - ID del post a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deletePost: async (id) => {
    try {
      const response = await API.delete(`/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando post ${id}:`, error);
      throw error;
    }
  },

  // ==================== Peticiones para mensajes ====================

  /**
   * Crea un nuevo mensaje
   * @param {Object} messageData - Datos del mensaje (postId, content, threadId, groupId)
   * @returns {Promise} Resultado de la operación
   */
  createMessage: async (messageData) => {
    try {
      const response = await API.post('/messages', messageData);
      return response.data;
    } catch (error) {
      console.error('Error creando mensaje:', error);
      throw error;
    }
  },

  /**
   * Obtiene un mensaje por su ID
   * @param {number} id - ID del mensaje
   * @returns {Promise} Mensaje encontrado
   */
  getMessageById: async (id) => {
    try {
      const response = await API.get(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo mensaje ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todos los mensajes
   * @returns {Promise} Lista de mensajes
   */
  getAllMessages: async () => {
    try {
      const response = await API.get('/messages');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo mensajes:', error);
      throw error;
    }
  },

  /**
   * Elimina un mensaje
   * @param {number} id - ID del mensaje a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteMessage: async (id) => {
    try {
      const response = await API.delete(`/messages/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando mensaje ${id}:`, error);
      throw error;
    }
  },

  // ==================== Peticiones para reacciones ====================
  /**
   * Crea una nueva reacción
   * @param {Object} reactionData - Datos de la reacción (postId, reactionType)
   * @returns {Promise} Resultado de la operación
   */
  createReaction: async (reactionData) => {
    try {
      const response = await API.post('/reactions', reactionData);
      return response.data;
    } catch (error) {
      console.error('Error creando reacción:', error);
      throw error;
    }
  },

  /**
   * Obtiene una reacción por su ID
   * @param {number} id - ID de la reacción
   * @returns {Promise} Reacción encontrada
   */
  getReactionById: async (id) => {
    try {
      const response = await API.get(`/reactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo reacción ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todas las reacciones
   * @returns {Promise} Lista de reacciones
   */
  getAllReactions: async () => {
    try {
      const response = await API.get('/reactions');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo reacciones:', error);
      throw error;
    }
  },

  /**
   * Elimina una reacción
   * @param {number} id - ID de la reacción a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteReaction: async (id) => {
    try {
      const response = await API.delete(`/reactions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando reacción ${id}:`, error);
      throw error;
    }
  },

  // ==================== Peticiones de grupos ====================
  /**
   * Crea un nuevo grupo
   * @param {Object} groupData - Datos del grupo (name, description)
   * @returns {Promise} Resultado de la operación
   */
  createGroup: async (groupData) => {
    try {
      const response = await API.post('/groups', groupData);
      return response.data;
    } catch (error) {
      console.error('Error creando grupo:', error);
      throw error;
    }
  },

  /**
   * Obtiene un grupo por su ID
   * @param {number} id - ID del grupo
   * @returns {Promise} Grupo encontrado
   */
  getGroupById: async (id) => {
    try {
      const response = await API.get(`/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo grupo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todos los grupos
   * @returns {Promise} Lista de grupos
   */
  getAllGroups: async () => {
    try {
      const response = await API.get('/groups');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo grupos:', error);
      throw error;
    }
  },

  /**
   * Actualiza un grupo existente
   * @param {number} id - ID del grupo a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Grupo actualizado
   */
  updateGroup: async (id, updateData) => {
    try {
      const response = await API.put(`/groups/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando grupo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un grupo
   * @param {number} id - ID del grupo a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteGroup: async (id) => {
    try {
      const response = await API.delete(`/groups/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando grupo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Permite al usuario unirse a un grupo
   * @param {number} groupId - ID del grupo al que unirse
   * @returns {Promise} Resultado de la operación
   */
  joinGroup: async (groupId) => {
    try {
      const response = await API.post(`/groups/${groupId}/join`);
      return response.data;
    } catch (error) {
      console.error(`Error uniéndose al grupo ${groupId}:`, error);
      throw error;
    }
  },

  // ==================== Peticiones de hilos ====================
  /**
   * Crea un nuevo hilo
   * @param {Object} threadData - Datos del hilo (groupId, title, content)
   * @returns {Promise} Resultado de la operación
   */
  createThread: async (threadData) => {
    try {
      const response = await API.post('/threads', threadData);
      return response.data;
    } catch (error) {
      console.error('Error creando hilo:', error);
      throw error;
    }
  },

  /**
   * Obtiene un hilo por su ID
   * @param {number} id - ID del hilo
   * @returns {Promise} Hilo encontrado
   */
  getThreadById: async (id) => {
    try {
      const response = await API.get(`/threads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo hilo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene todos los hilos
   * @returns {Promise} Lista de hilos
   */
  getAllThreads: async () => {
    try {
      const response = await API.get('/threads');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo hilos:', error);
      throw error;
    }
  },

  /**
   * Actualiza un hilo existente
   * @param {number} id - ID del hilo a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Hilo actualizado
   */
  updateThread: async (id, updateData) => {
    try {
      const response = await API.put(`/threads/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando hilo ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un hilo
   * @param {number} id - ID del hilo a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteThread: async (id) => {
    try {
      const response = await API.delete(`/threads/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando hilo ${id}:`, error);
      throw error;
    }
  }
};