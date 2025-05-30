import { API } from "../../../common/config/api";

// Centralización de endpoints de la API
const ENDPOINTS = {
  POSTS: "/posts",
  POST_BY_ID: (id) => `/posts/${id}`,
  MESSAGES: "/messages",
  MESSAGE_BY_ID: (id) => `/messages/${id}`,
  GROUPS: "/groups",
  GROUP_BY_ID: (id) => `/groups/${id}`,
  THREADS: "/threads",
  THREAD_BY_ID: (id) => `/threads/${id}`,
  REACTIONS: "/reactions",
  REACTION_BY_ID: (id) => `/reactions/${id}`,
};

// Manejo centralizado de errores
const handleError = (error, context) => {
  console.error(`Error en ${context}:`, error);
  throw error;
};

export const communityService = {
  // ==================== Peticiones para posts ====================
  getPostsByGroup: async (groupId) => {
    try {
      const response = await API.get(`/posts/by-group/${groupId}`);
      return response.data;
    } catch (error) {
      handleError(error, `obtener publicaciones del grupo ${groupId}`);
      throw error;
    }
  },

  getPostsByUser: async (userId = null) => {
    try {
      // Si no se proporciona userId, el backend usará el usuario autenticado
      const url = userId ? `/posts/by-user?userId=${userId}` : '/posts/by-user';
      const response = await API.get(url);

      // Procesamos la respuesta según el formato del API
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      handleError(error, 'obtener publicaciones del usuario');
      return [];
    }
  },

  /**
   * Crea una nueva publicación
   * @param {Object|FormData} postData - Datos del post (objeto normal o FormData)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  createPost: async (postData) => {
    try {
      // Detectar si estamos enviando FormData
      const isFormData = postData instanceof FormData;

      // Configurar headers correctamente según el tipo de datos
      const config = isFormData
        ? {
          headers: { "Content-Type": "multipart/form-data" },
        }
        : undefined;

      // Realizar la petición con la configuración adecuada
      const response = await API.post(ENDPOINTS.POSTS, postData, config);

      return response.data;
    } catch (error) {
      handleError(error, "crear post");
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

      // Manejar diferentes formatos de respuesta
      let posts = [];
      if (response.data && response.data.data) {
        posts = response.data.data;
      } else if (Array.isArray(response.data)) {
        posts = response.data;
      }

      // Filtrar solo los posts que no pertenecen a hilos ni grupos
      return posts.filter(post => !post.threadId && !post.groupId);
    } catch (error) {
      handleError(error, "obtener todos los posts");
      return []; // Retornar array vacío en caso de error
    }
  },

  updatePost: async (id, updateData) => {
    try {
      // Detectar si estamos enviando FormData
      const isFormData = updateData instanceof FormData;

      // Configurar headers correctamente según el tipo de datos
      const config = isFormData ? {
        headers: { 'Content-Type': 'multipart/form-data' }
      } : undefined;

      // Realizar la petición con la configuración adecuada
      const response = await API.put(`${ENDPOINTS.POST_BY_ID(id)}`, updateData, config);
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

  /**
   * Devuelve los posts de un hilo.
   * @param {number|string} threadId
   * @returns {Promise<Object>} Objeto { message, data: Array<Post> }
   */
  getPostsByThreadId: async (threadId) => {
    try {
      const response = await API.get(`/posts/by-thread/${threadId}`);
      return response.data;
    } catch (error) {
      handleError(error, `obtener posts del hilo ${threadId}`);
      throw error;
    }
  },

  // ==================== Peticiones para mensajes ====================
  createMessage: async (messageData) => {
    try {
      const response = await API.post(ENDPOINTS.MESSAGES, messageData);
      return response.data;
    } catch (error) {
      handleError(error, "crear mensaje");
    }
  },

  getAllMessages: async () => {
    try {
      const response = await API.get(ENDPOINTS.MESSAGES);
      return response.data;
    } catch (error) {
      handleError(error, "obtener todos los mensajes");
    }
  },

  /**
   * Devuelve los mensajes de un hilo.
   * @param {number|string} threadId
   * @returns {Promise<Object>} Objeto { message, data: Array<Message> }
   */
  getMessagesByThreadId: async (threadId, limit = 50, offset = 0) => {
    return await communityService.getMessageHistory('thread', threadId, limit, offset);
  },

  // ==================== Peticiones para grupos ====================
  createGroup: async (groupData) => {
    try {
      const response = await API.post(ENDPOINTS.GROUPS, groupData);
      return response.data;
    } catch (error) {
      handleError(error, "crear grupo");
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
      handleError(error, "obtener todos los grupos");
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

  /**
   * Elimina un grupo
   * @param {number} id - ID del grupo a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteGroup: async (id) => {
    try {
      console.log(`🗑️ Intentando eliminar grupo ${id}...`);
      const response = await API.delete(`/groups/${id}`);
      console.log('✅ Grupo eliminado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error eliminando grupo ${id}:`, error);

      // Mejorar el manejo de errores específicos
      if (error.response) {
        const { status, data } = error.response;
        console.error(`Status: ${status}`, data);

        switch (status) {
          case 401:
            throw new Error('No tienes autorización para eliminar grupos. Inicia sesión nuevamente.');
          case 403:
            throw new Error('No tienes permisos de administrador para eliminar grupos.');
          case 404:
            throw new Error('El grupo no existe o ya fue eliminado.');
          case 409:
            throw new Error('No se puede eliminar el grupo porque tiene hilos o miembros asociados.');
          default:
            throw new Error(data?.message || `Error del servidor (${status})`);
        }
      } else if (error.request) {
        throw new Error('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        throw new Error('Error inesperado al eliminar el grupo.');
      }
    }
  },


  // deleteGroup: async (id) => {
  //   try {
  //     const response = await API.delete(ENDPOINTS.GROUP_BY_ID(id));
  //     return response.data;
  //   } catch (error) {
  //     handleError(error, `eliminar grupo con ID ${id}`);
  //   }
  // },

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
  getThreadsByGroup: async (groupId) => {
    try {
      const response = await API.get(`/threads/by-group/${groupId}`);


      return response.data;
    } catch (error) {
      handleError(error, `obtener hilos del grupo ${groupId}`);
      throw error;
    }
  },

  getThreadsByUser: async (userId = null) => {
    try {
      const url = userId
        ? `/threads/by-user?userId=${userId}`
        : "/threads/by-user";
      const response = await API.get(url);
      return response.data;
    } catch (error) {
      handleError(error, "obtener hilos del usuario");
      throw error;
    }
  },

  getForumThreads: async () => {
    try {
      const response = await API.get("/threads/forum");
      return response.data;
    } catch (error) {
      handleError(error, "obtener hilos del foro");
      throw error;
    }
  },

  createThread: async (threadData) => {
    console.log("Datos del hilo en service a crear:", threadData);
    try {
      const response = await API.post(ENDPOINTS.THREADS, threadData);
      return response.data;
    } catch (error) {
      handleError(error, "crear hilo");
    }
  },

  getThreadById: async (threadId) => {
    try {
      const response = await API.get(ENDPOINTS.THREAD_BY_ID(threadId));
      return response.data;
    } catch (error) {
      handleError(error, `obtener hilo con ID ${threadId}`);
      throw error;
    }
  },

  getAllThreads: async () => {
    try {
      const response = await API.get(ENDPOINTS.THREADS);
      console.log("Respuesta de la API de hilos:", response?.data);
      // Validación profesional: asegúrate de que response.data.data sea un array
      if (response?.data && Array.isArray(response.data.data)) {
        return response.data.data; // Devuelve solo el array de hilos
      } else {
        console.warn(
          "La respuesta de la API de hilos no contiene un array válido en data:",
          response?.data
        );
        return []; // Siempre retorna un array, aunque esté vacío
      }
    } catch (error) {
      handleError(error, "obtener todos los hilos");
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
  // Agregar estos métodos al objeto communityService existente

  // ==================== Peticiones para reacciones ====================

  /**
   * Crea una nueva reacción en una publicación
   * @param {Object} reactionData - Datos de la reacción {postId}
   * @returns {Promise<Object>} Respuesta del servidor con la reacción creada
   */
  createReaction: async (reactionData) => {
    try {
      const response = await API.post('/reactions', {
        ...reactionData,
        reactionType: 'heart' // Siempre usamos el tipo 'heart'
      });
      return response.data;
    } catch (error) {
      handleError(error, 'crear reacción');
      throw error;
    }
  },

  /**
   * Obtiene una reacción por su ID
   * @param {number} id - ID de la reacción
   * @returns {Promise<Object>} Datos de la reacción
   */
  getReactionById: async (id) => {
    try {
      const response = await API.get(`/reactions/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `obtener reacción con ID ${id}`);
      throw error;
    }
  },

  /**
   * Obtiene todas las reacciones del sistema
   * @returns {Promise<Array>} Lista de todas las reacciones
   */
  getAllReactions: async () => {
    try {
      const response = await API.get('/reactions');

      // Procesamos la respuesta según el formato del API
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      handleError(error, 'obtener todas las reacciones');
      return [];
    }
  },

  /**
   * Elimina una reacción
   * @param {number} id - ID de la reacción a eliminar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  deleteReaction: async (id) => {
    try {
      const response = await API.delete(`/reactions/${id}`);
      return response.data;
    } catch (error) {
      handleError(error, `eliminar reacción con ID ${id}`);
      throw error;
    }
  },

  /**
   * Obtiene las reacciones de una publicación específica
   * @param {number} postId - ID de la publicación
   * @returns {Promise<Array>} Lista de reacciones de la publicación
   */
  getReactionsByPost: async (postId) => {
    try {
      const response = await API.get(`/reactions/by-post/${postId}`);

      if (response.data && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      }

      return [];
    } catch (error) {
      handleError(error, `obtener reacciones de la publicación ${postId}`);
      return [];
    }
  },

  // ==================== MENSAJES - MÉTODOS ====================

  /**
   * Obtiene un mensaje por su ID
   */
  getMessageById: async (id) => {
    try {
      const response = await API.get(ENDPOINTS.MESSAGE_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `obtener mensaje con ID ${id}`);
      throw error;
    }
  },

  /**
   * Elimina un mensaje
   */
  deleteMessage: async (id) => {
    try {
      const response = await API.delete(ENDPOINTS.MESSAGE_BY_ID(id));
      return response.data;
    } catch (error) {
      handleError(error, `eliminar mensaje con ID ${id}`);
      throw error;
    }
  },

  /**
   * Obtiene historial de mensajes por contexto
   */
  getMessageHistory: async (contextType, contextId = null, limit = 50, offset = 0) => {
    try {
      const params = new URLSearchParams({
        contextType,
        limit: limit.toString(),
        offset: offset.toString()
      });

      if (contextId !== null) {
        params.append('contextId', contextId.toString());
      }

      const response = await API.get(`${ENDPOINTS.MESSAGES}/history?${params}`);
      return response.data;
    } catch (error) {
      handleError(error, `obtener historial de mensajes`);
      throw error;
    }
  },

  /**
   * Obtiene mensajes de una publicación
   */
  getMessagesByPost: async (postId, limit = 50, offset = 0) => {
    try {
      return await communityService.getMessageHistory('post', postId, limit, offset);
    } catch (error) {
      handleError(error, `obtener mensajes de la publicación ${postId}`);
      throw error;
    }
  },

  /**
   * Obtiene mensajes de un grupo
   */
  getMessagesByGroup: async (groupId, limit = 50, offset = 0) => {
    try {
      return await communityService.getMessageHistory('group', groupId, limit, offset);
    } catch (error) {
      handleError(error, `obtener mensajes del grupo ${groupId}`);
      throw error;
    }
  },

  /**
   * Obtiene mensajes del foro general
   */
  getForumMessages: async (limit = 50, offset = 0) => {
    try {
      return await communityService.getMessageHistory('forum', null, limit, offset);
    } catch (error) {
      handleError(error, 'obtener mensajes del foro');
      throw error;
    }
  },
};
