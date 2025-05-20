import { API } from '../../../common/config/api';

// Centralización de endpoints de la API
const ENDPOINTS = {
  POSTS: '/posts',
  POST_BY_ID: (id) => `/posts/${id}`,
  MESSAGES: '/messages',
  MESSAGE_BY_ID: (id) => `/messages/${id}`,
  GROUPS: '/groups',
  GROUP_BY_ID: (id) => `/groups/${id}`,
  THREADS: '/threads',
  THREAD_BY_ID: (id) => `/threads/${id}`,
  REACTIONS: '/reactions',
  REACTION_BY_ID: (id) => `/reactions/${id}`,
};

// Manejo centralizado de errores
const handleError = (error, context) => {
  console.error(`Error en ${context}:`, error);
  throw error;
};

export const communityService = {
  // ==================== Peticiones para posts ====================
createPost: async (postData) => {
    try {
      let response;

      // Cambia 'file' por 'multimediaContent'
      if (postData instanceof FormData || postData.multimediaContent) {
        // Permite que le pases directamente un FormData
        const formData = postData instanceof FormData ? postData : new FormData();
        if (!(postData instanceof FormData)) {
          Object.keys(postData).forEach((key) => {
            if (postData[key] !== null && postData[key] !== undefined) {
              formData.append(key, postData[key]);
            }
          });
        }
        response = await API.post(ENDPOINTS.POSTS, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        response = await API.post(ENDPOINTS.POSTS, postData);
      }

      return response.data;
    } catch (error) {
      handleError(error, 'crear post');
      throw error;
    }
  },
 

  getPostById: async (id) => {
    try {
      const response = await API.get(ENDPOINTS.POST_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `obtener post con ID ${id}`);
    }
  },

  getAllPosts: async () => {
    try {
      const response = await API.get(ENDPOINTS.POSTS);
      return response.data;
    } catch (error) {
      handleError(error, 'obtener todos los posts');
    }
  },

  updatePost: async (id, updateData) => {
    try {
      const response = await API.put(ENDPOINTS.POST_BY_ID(id), updateData);
      return response.data;
    } catch (error) {
      handleError(error, `actualizar post con ID ${id}`);
    }
  },

  deletePost: async (id) => {
    try {
      const response = await API.delete(ENDPOINTS.POST_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `eliminar post con ID ${id}`);
    }
  },

  // ==================== Peticiones para mensajes ====================
  createMessage: async (messageData) => {
    try {
      const response = await API.post(ENDPOINTS.MESSAGES, messageData);
      return response.data;
    } catch (error) {
      handleError(error, 'crear mensaje');
    }
  },

  getAllMessages: async () => {
    try {
      const response = await API.get(ENDPOINTS.MESSAGES);
      return response.data;
    } catch (error) {
      handleError(error, 'obtener todos los mensajes');
    }
  },

  // ==================== Peticiones para grupos ====================
  createGroup: async (groupData) => {
    try {
      const response = await API.post(ENDPOINTS.GROUPS, groupData);
      return response.data;
    } catch (error) {
      handleError(error, 'crear grupo');
    }
  },

  getGroupById: async (id) => {
    try {
      const response = await API.get(ENDPOINTS.GROUP_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `obtener grupo con ID ${id}`);
    }
  },

  getAllGroups: async () => {
    try {
      const response = await API.get(ENDPOINTS.GROUPS);
      return response.data;
    } catch (error) {
      handleError(error, 'obtener todos los grupos');
    }
  },

  updateGroup: async (id, updateData) => {
    try {
      const response = await API.put(ENDPOINTS.GROUP_BY_ID(id), updateData);
      return response.data;
    } catch (error) {
      handleError(error, `actualizar grupo con ID ${id}`);
    }
  },

  deleteGroup: async (id) => {
    try {
      const response = await API.delete(ENDPOINTS.GROUP_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `eliminar grupo con ID ${id}`);
    }
  },

  /**
   * Hace que el usuario autenticado se una a un grupo.
   * @param {number|string} groupId - ID del grupo al que el usuario se quiere unir.
   * @returns {Promise<any>} - Respuesta del servidor.
   */
  joinGroup: async (groupId) => {
    try {
      const response = await API.post(`${ENDPOINTS.GROUP_BY_ID(groupId)}/join`);
      return response.data;
    } catch (error) {
      handleError(error, `unirse al grupo con ID ${groupId}`);
      throw error;
    }
  },

  // ==================== Peticiones para hilos ====================
  createThread: async (threadData) => {
    try {
      const response = await API.post(ENDPOINTS.THREADS, threadData);
      return response.data;
    } catch (error) {
      handleError(error, 'crear hilo');
    }
  },

  getThreadById: async (id) => {
    try {
      const response = await API.get(ENDPOINTS.THREAD_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `obtener hilo con ID ${id}`);
    }
  },

  getAllThreads: async () => {
  try {
    const response = await API.get(ENDPOINTS.THREADS);
    console.log("Respuesta de la API de hilos:", response?.data);
    // Validación profesional: asegúrate de que response.data.data sea un array
    if (
      response?.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data; // Devuelve solo el array de hilos
    } else {
      console.warn("La respuesta de la API de hilos no contiene un array válido en data:", response?.data);
      return []; // Siempre retorna un array, aunque esté vacío
    }
  } catch (error) {
    handleError(error, 'obtener todos los hilos');
    return []; // Previene que el componente falle por error de red o formato
  }
},

  updateThread: async (id, updateData) => {
    try {
      const response = await API.put(ENDPOINTS.THREAD_BY_ID(id), updateData);
      return response.data;
    } catch (error) {
      handleError(error, `actualizar hilo con ID ${id}`);
    }
  },

  deleteThread: async (id) => {
    try {
      const response = await API.delete(ENDPOINTS.THREAD_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `eliminar hilo con ID ${id}`);
    }
  },

  // ==================== Peticiones para reacciones ====================
  toggleReaction: async (reactionData) => {
    try {
      const response = await API.post(ENDPOINTS.REACTIONS, reactionData);
      return response.data;
    } catch (error) {
      handleError(error, 'crear o eliminar reacción');
    }
  },

  getAllReactions: async () => {
    try {
      const response = await API.get(ENDPOINTS.REACTIONS);
      return response.data;
    } catch (error) {
      handleError(error, 'obtener todas las reacciones');
    }
  },
};