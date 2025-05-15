import { API } from '../../../common/config/api';

/**
 * Servicio para la gestión de funcionalidades del modulo educativo
 */
export const educationService = {
  // ==================== Operaciones para los módulos especificos ====================

  /**
   * Obtiene todos los módulos disponibles
   * @returns {Promise} Lista de módulos
   */
  getAllModules: async () => {
    try {
      const response = await API.get('/modules');
      return response.data;
    } catch (error) {
      // Manejo personalizado para el error 404
      if (error.response && error.response.status === 404) {
        console.info('No hay módulos disponibles para mostrar');
        // En lugar de propagar el error, devolvemos un array vacío
        return { data: [] };
      }
      console.error('Error obteniendo módulos:', error);
      throw error;
    }
  },

  /**
   * Obtiene un módulo específico por su ID
   * @param {number} moduleId - ID del módulo
   * @returns {Promise} Módulo encontrado
   */
  getModuleById: async (moduleId) => {
    try {
      const response = await API.get(`/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo el módulo ${moduleId}:`, error);
      throw error;
    }
  },

  /**
   * Crea un nuevo módulo
   * @param {Object} moduleData - Datos del módulo a crear
   * @returns {Promise} Resultado de la operación
   */
  createModule: async (moduleData) => {
    try {
      const response = await API.post('/modules', moduleData);
      return response.data;
    } catch (error) {
      console.error('Error creando módulo:', error);
      throw error;
    }
  },

  /**
   * Actualiza un módulo existente
   * @param {number} moduleId - ID del módulo a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Resultado de la operación
   */
  updateModule: async (moduleId, updateData) => {
    try {
      const response = await API.put(`/modules/${moduleId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando módulo ${moduleId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un módulo
   * @param {number} moduleId - ID del módulo a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteModule: async (moduleId) => {
    try {
      const response = await API.delete(`/modules/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando módulo ${moduleId}:`, error);
      throw error;
    }
  },

  /**
   * Filtra módulos por etiquetas
   * @param {Array} tagIds - Lista de IDs de etiquetas
   * @returns {Promise} Lista de módulos filtrados
   */
  filterModulesByTags: async (tagIds) => {
    try {
      // Convertir el array de IDs a string separado por comas
      const tagIdsParam = Array.isArray(tagIds) ? tagIds.join(',') : tagIds;

      console.log('DEBUG - Filtrando por tagIds:', tagIdsParam);

      const response = await API.get('/modules/filter', {
        params: { tagIds: tagIdsParam }
      });
      return response.data;
    } catch (error) {
      console.error('Error filtrando módulos:', error);
      throw error;
    }
  },

  // ==================== Operaciones para artículos educativos ====================

  /**
   * Crea un nuevo artículo
   * @param {Object} articleData - Datos del artículo (moduleId, title, articleUrl)
   * @returns {Promise} Resultado de la operación
   */
  createArticle: async (articleData) => {
    try {
      const response = await API.post('/articles', articleData);
      return response.data;
    } catch (error) {
      console.error('Error creando artículo:', error);
      throw error;
    }
  },

  /**
   * Obtiene artículos por ID de módulo
   * @param {number} moduleId - ID del módulo
   * @returns {Promise} Lista de artículos
   */
  getArticlesByModuleId: async (moduleId) => {
    try {
      const response = await API.get(`/articles/getByModuleId/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo artículos del módulo ${moduleId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene un artículo específico por su ID
   * @param {number} articleId - ID del artículo
   * @returns {Promise} Artículo encontrado
   */
  getArticleById: async (articleId) => {
    try {
      const response = await API.get(`/articles/${articleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo artículo ${articleId}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza un artículo existente
   * @param {number} articleId - ID del artículo a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Resultado de la operación
   */
  updateArticle: async (articleId, updateData) => {
    try {
      const response = await API.put(`/articles/${articleId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando artículo ${articleId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un artículo
   * @param {number} articleId - ID del artículo a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteArticle: async (articleId) => {
    try {
      const response = await API.delete(`/articles/${articleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando artículo ${articleId}:`, error);
      throw error;
    }
  },

  // ==================== Operaciones para guías ====================

  /**
   * Crea una nueva guía con archivo PDF
   * @param {Object} guideData - Datos de la guía incluido el archivo PDF
   * @returns {Promise} Resultado de la operación
   */
  createGuide: async (guideData) => {
    try {
      // Creamos un FormData para enviar el archivo
      const formData = new FormData();

      // Agregamos todos los campos al FormData
      for (const key in guideData) {
        if (key === 'pdfFile') {
          formData.append('pdfFile', guideData.pdfFile);
        } else {
          formData.append(key, guideData[key]);
        }
      }

      const response = await API.post('/guides', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'  // Importante para enviar archivos
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error creando guía:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las guías disponibles
   * @returns {Promise} Lista de guías
   */
  getAllGuides: async () => {
    try {
      const response = await API.get('/guides');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo guías:', error);
      throw error;
    }
  },

  /**
   * Obtiene guías por ID de módulo
   * @param {number} moduleId - ID del módulo
   * @returns {Promise} Lista de guías
   */
  getGuidesByModuleId: async (moduleId) => {
    try {
      const response = await API.get(`/guides/getByModuleId/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo guías del módulo ${moduleId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene una guía específica por su ID
   * @param {number} guideId - ID de la guía
   * @returns {Promise} Guía encontrada
   */
  getGuideById: async (guideId) => {
    try {
      const response = await API.get(`/guides/getById/${guideId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo guía ${guideId}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza una guía existente
   * @param {number} guideId - ID de la guía a actualizar
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Resultado de la operación
   */
  updateGuide: async (guideId, updateData) => {
    try {
      const response = await API.put(`/guides/${guideId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando guía ${guideId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una guía
   * @param {number} guideId - ID de la guía a eliminar
   * @returns {Promise} Resultado de la operación
   */
  deleteGuide: async (guideId) => {
    try {
      const response = await API.delete(`/guides/${guideId}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando guía ${guideId}:`, error);
      throw error;
    }
  },

  // ==================== Operaciones para etiquetas ====================

  /**
   * Obtiene todas las etiquetas disponibles
   * @returns {Promise} Lista de etiquetas
   */
  getAllTags: async () => {
    try {
      const response = await API.get('/tags');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo etiquetas:', error);
      throw error;
    }
  },

  /**
   * Obtiene una etiqueta por su ID
   * @param {number} tagId - ID de la etiqueta
   * @returns {Promise} Etiqueta encontrada
   */
  getTagById: async (tagId) => {
    try {
      const response = await API.get(`/tags/getTagId/${tagId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo etiqueta ${tagId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene una etiqueta por su nombre
   * @param {string} tagName - Nombre de la etiqueta
   * @returns {Promise} Etiqueta encontrada
   */
  getTagByName: async (tagName) => {
    try {
      const response = await API.get(`/tags/getTagName/${tagName}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo etiqueta "${tagName}":`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva etiqueta
   * @param {string} tagName - Nombre de la etiqueta
   * @returns {Promise} Etiqueta creada
   */
  createTag: async (tagName) => {
    try {
      const response = await API.post(`/tags/${tagName}`);
      return response.data;
    } catch (error) {
      console.error(`Error creando etiqueta "${tagName}":`, error);
      throw error;
    }
  },

  /**
   * Actualiza el nombre de una etiqueta
   * @param {Object} tagData - Datos de la etiqueta (id, name)
   * @returns {Promise} Etiqueta actualizada
   */
  updateTag: async (tagData) => {
    try {
      const response = await API.put('/tags', tagData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando etiqueta ${tagData.id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una etiqueta
   * @param {number} tagId - ID de la etiqueta
   * @returns {Promise} Resultado de la operación
   */
  deleteTag: async (tagId) => {
    try {
      const response = await API.delete(`/tags/${tagId}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando etiqueta ${tagId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene o crea una etiqueta
   * @param {string} tagName - Nombre de la etiqueta
   * @returns {Promise} Etiqueta encontrada o creada
   */
  getOrCreateTag: async (tagName) => {
    try {
      const response = await API.get(`/tags/getOrCreate/${tagName}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo o creando etiqueta "${tagName}":`, error);
      throw error;
    }
  },

  // ==================== Operaciones para videos ====================

  /**
   * Crea un nuevo video
   * @param {Object} videoData - Datos del video
   * @returns {Promise} Video creado
   */
  createVideo: async (videoData) => {
    try {
      const response = await API.post('/videos', videoData);
      return response.data;
    } catch (error) {
      console.error('Error creando video:', error);
      throw error;
    }
  },

  /**
   * Obtiene un video por su ID
   * @param {number} videoId - ID del video
   * @returns {Promise} Video encontrado
   */
  getVideoById: async (videoId) => {
    try {
      const response = await API.get(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo video ${videoId}:`, error);
      throw error;
    }
  },

  /**
   * Obtiene videos por ID de módulo
   * @param {number} moduleId - ID del módulo
   * @returns {Promise} Lista de videos
   */
  getVideosByModuleId: async (moduleId) => {
    try {
      const response = await API.get(`/videos/getByModuleId/${moduleId}`);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo videos del módulo ${moduleId}:`, error);
      throw error;
    }
  },

  /**
   * Actualiza un video existente
   * @param {number} videoId - ID del video
   * @param {Object} updateData - Datos a actualizar
   * @returns {Promise} Video actualizado
   */
  updateVideo: async (videoId, updateData) => {
    try {
      const response = await API.put(`/videos/${videoId}`, updateData);
      return response.data;
    } catch (error) {
      console.error(`Error actualizando video ${videoId}:`, error);
      throw error;
    }
  },

  /**
   * Elimina un video
   * @param {number} videoId - ID del video
   * @returns {Promise} Resultado de la operación
   */
  deleteVideo: async (videoId) => {
    try {
      const response = await API.delete(`/videos/${videoId}`);
      return response.data;
    } catch (error) {
      console.error(`Error eliminando video ${videoId}:`, error);
      throw error;
    }
  }
};