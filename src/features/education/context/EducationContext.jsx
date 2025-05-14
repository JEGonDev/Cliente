import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { educationService } from '../services/educationService';
import { AuthContext } from '../../authentication/context/AuthContext';

// Creamos el contexto para educación
export const EducationContext = createContext({
  // Estado de módulos
  modules: [],
  module: null,
  loadingModules: false,
  moduleError: null,

  // Estado de artículos
  articles: [],
  article: null,
  loadingArticles: false,
  articleError: null,

  // Estado de guías
  guides: [],
  guide: null,
  loadingGuides: false,
  guideError: null,

  // Estado de tags
  tags: [],
  tag: null,
  loadingTags: false,
  tagError: null,

  // Estado de videos
  videos: [],
  video: null,
  loadingVideos: false,
  videoError: null,

  // Funciones para módulos
  fetchAllModules: async () => { },
  fetchModuleById: async (id) => { },
  createModule: async (moduleData) => { },
  updateModule: async (id, updateData) => { },
  deleteModule: async (id) => { },
  filterModulesByTags: async (tagIds) => { },

  // Funciones para artículos
  fetchArticlesByModuleId: async (moduleId) => { },
  fetchArticleById: async (id) => { },
  createArticle: async (articleData) => { },
  updateArticle: async (id, updateData) => { },
  deleteArticle: async (id) => { },

  // Funciones para guías
  fetchAllGuides: async () => { },
  fetchGuidesByModuleId: async (moduleId) => { },
  fetchGuideById: async (id) => { },
  createGuide: async (guideData) => { },
  updateGuide: async (id, updateData) => { },
  deleteGuide: async (id) => { },

  // Funciones para tags
  fetchAllTags: async () => { },
  fetchTagById: async (id) => { },
  fetchTagByName: async (name) => { },
  createTag: async (name) => { },
  updateTag: async (tagData) => { },
  deleteTag: async (id) => { },
  getOrCreateTag: async (name) => { },

  // Funciones para videos
  fetchVideosByModuleId: async (moduleId) => { },
  fetchVideoById: async (id) => { },
  createVideo: async (videoData) => { },
  updateVideo: async (id, updateData) => { },
  deleteVideo: async (id) => { },

  // Funciones de reseteo de estados
  resetModuleState: () => { },
  resetArticleState: () => { },
  resetGuideState: () => { },
  resetTagState: () => { },
  resetVideoState: () => { }
});

// Proveedor de contexto que encapsula la lógica de educación
export const EducationProvider = ({ children }) => {
  // Accedemos al contexto de autenticación para verificar que el usuario esté autenticado
  const { isAuthenticated } = useContext(AuthContext);

  // Estado para módulos
  const [modules, setModules] = useState([]);
  const [module, setModule] = useState(null);
  const [loadingModules, setLoadingModules] = useState(false);
  const [moduleError, setModuleError] = useState(null);

  // Estado para artículos
  const [articles, setArticles] = useState([]);
  const [article, setArticle] = useState(null);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [articleError, setArticleError] = useState(null);

  // Estado para guías
  const [guides, setGuides] = useState([]);
  const [guide, setGuide] = useState(null);
  const [loadingGuides, setLoadingGuides] = useState(false);
  const [guideError, setGuideError] = useState(null);

  // Estado para tags
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState(null);
  const [loadingTags, setLoadingTags] = useState(false);
  const [tagError, setTagError] = useState(null);

  // Estado para videos
  const [videos, setVideos] = useState([]);
  const [video, setVideo] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videoError, setVideoError] = useState(null);

  // Efecto para cargar datos iniciales al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllModules();
      fetchAllTags();
    }
  }, [isAuthenticated]);

  // ==================== Funciones para módulos especificos ====================

  /**
   * Obtiene todos los módulos
   */
  const fetchAllModules = async () => {
    if (!isAuthenticated) return;
    
    setLoadingModules(true);
    setModuleError(null);
    
    try {
      const response = await educationService.getAllModules();
      setModules(response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo módulos:', error);
      setModuleError(error.message || 'Error al cargar los módulos');
      return null;
    } finally {
      setLoadingModules(false);
    }
  };

  /**
   * Obtiene un módulo por su ID
   * @param {number} id - ID del módulo
   */
  const fetchModuleById = async (id) => {
    if (!isAuthenticated) return;

    setLoadingModules(true);
    setModuleError(null);

    try {
      const response = await educationService.getModuleById(id);
      setModule(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo módulo ${id}:`, error);
      setModuleError(error.message || `Error al cargar el módulo ${id}`);
      return null;
    } finally {
      setLoadingModules(false);
    }
  };

  /**
   * Crea un nuevo módulo
   * @param {Object} moduleData - Datos del módulo
   */
  const createModule = async (moduleData) => {
    if (!isAuthenticated) return;

    setLoadingModules(true);
    setModuleError(null);

    try {
      const response = await educationService.createModule(moduleData);
      // Actualizamos la lista de módulos
      setModules(prevModules => [response.data, ...prevModules]);
      return response.data;
    } catch (error) {
      console.error('Error creando módulo:', error);
      setModuleError(error.message || 'Error al crear el módulo');
      return null;
    } finally {
      setLoadingModules(false);
    }
  };

  /**
   * Actualiza un módulo existente
   * @param {number} id - ID del módulo
   * @param {Object} updateData - Datos a actualizar
   */
  const updateModule = async (id, updateData) => {
    if (!isAuthenticated) return;

    setLoadingModules(true);
    setModuleError(null);

    try {
      const response = await educationService.updateModule(id, updateData);
      // Actualizamos el módulo en la lista
      setModules(prevModules =>
        prevModules.map(m => m.id === id ? response.data : m)
      );
      // Si el módulo actual es el que se actualizó, actualizamos también el estado
      if (module && module.id === id) {
        setModule(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error actualizando módulo ${id}:`, error);
      setModuleError(error.message || `Error al actualizar el módulo ${id}`);
      return null;
    } finally {
      setLoadingModules(false);
    }
  };

  /**
   * Elimina un módulo
   * @param {number} id - ID del módulo
   */
  const deleteModule = async (id) => {
    if (!isAuthenticated) return;

    setLoadingModules(true);
    setModuleError(null);

    try {
      await educationService.deleteModule(id);
      // Eliminamos el módulo de la lista
      setModules(prevModules => prevModules.filter(m => m.id !== id));
      // Si el módulo actual es el que se eliminó, limpiamos el estado
      if (module && module.id === id) {
        setModule(null);
      }
      return true;
    } catch (error) {
      console.error(`Error eliminando módulo ${id}:`, error);
      setModuleError(error.message || `Error al eliminar el módulo ${id}`);
      return false;
    } finally {
      setLoadingModules(false);
    }
  };

  /**
   * Filtra módulos por etiquetas
   * @param {Array} tagIds - Lista de IDs de etiquetas
   */
  const filterModulesByTags = async (tagIds) => {
    if (!isAuthenticated) return;

    setLoadingModules(true);
    setModuleError(null);

    try {
      const response = await educationService.filterModulesByTags(tagIds);
      // No actualizamos el estado general de modules, solo devolvemos el resultado
      return response.data;
    } catch (error) {
      console.error('Error filtrando módulos:', error);
      setModuleError(error.message || 'Error al filtrar los módulos');
      return null;
    } finally {
      setLoadingModules(false);
    }
  };

  // ==================== Funciones para artículos ====================

  /**
   * Obtiene artículos por ID de módulo
   * @param {number} moduleId - ID del módulo
   */
  const fetchArticlesByModuleId = async (moduleId, forceReload = false) => {
    if (!isAuthenticated) return;

    // Siempre establecer el estado de carga
    setLoadingArticles(true);
    setArticleError(null);
    
    // Si forceReload es true, limpiamos el estado actual
    if (forceReload) {
      setArticles([]);
    }

    try {
      const response = await educationService.getArticlesByModuleId(moduleId);
      if (response && response.data) {
        setArticles(response.data);
        return response.data;
      }
      // Si no hay respuesta válida, establecer un array vacío
      setArticles([]);
      return [];
    } catch (error) {
      console.error(`Error obteniendo artículos del módulo ${moduleId}:`, error);
      setArticleError(error.message || `Error al cargar artículos del módulo ${moduleId}`);
      setArticles([]); // Importante: resetear a array vacío en caso de error
      return [];
    } finally {
      setLoadingArticles(false);
    }
  };

  /**
   * Obtiene un artículo por su ID
   * @param {number} id - ID del artículo
   */
  const fetchArticleById = useCallback(async (id) => {
    if (!isAuthenticated) return;

    setLoadingArticles(true);
    setArticleError(null);

    try {
      const response = await educationService.getArticleById(id);
      
      // Solo actualizar article si la respuesta es válida
      if (response && response.data) {
        setArticle(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Error obteniendo artículo ${id}:`, error);
      setArticleError(error.message || `Error al cargar el artículo ${id}`);
      return null;
    } finally {
      setLoadingArticles(false);
    }
  }, [isAuthenticated, educationService]);

  /**
   * Crea un nuevo artículo
   * @param {Object} articleData - Datos del artículo
   */
  const createArticle = async (articleData) => {
    if (!isAuthenticated) return;

    setLoadingArticles(true);
    setArticleError(null);

    try {
      const response = await educationService.createArticle(articleData);
      // Actualizamos la lista de artículos
      setArticles(prevArticles => [response.data, ...prevArticles]);
      return response.data;
    } catch (error) {
      console.error('Error creando artículo:', error);
      setArticleError(error.message || 'Error al crear el artículo');
      return null;
    } finally {
      setLoadingArticles(false);
    }
  };

  /**
   * Actualiza un artículo existente
   * @param {number} id - ID del artículo
   * @param {Object} updateData - Datos a actualizar
   */
  const updateArticle = async (id, updateData) => {
    if (!isAuthenticated) return;

    setLoadingArticles(true);
    setArticleError(null);

    try {
      const response = await educationService.updateArticle(id, updateData);
      // Actualizamos el artículo en la lista
      setArticles(prevArticles =>
        prevArticles.map(a => a.id === id ? response.data : a)
      );
      // Si el artículo actual es el que se actualizó, actualizamos también el estado
      if (article && article.id === id) {
        setArticle(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error actualizando artículo ${id}:`, error);
      setArticleError(error.message || `Error al actualizar el artículo ${id}`);
      return null;
    } finally {
      setLoadingArticles(false);
    }
  };

  /**
   * Elimina un artículo
   * @param {number} id - ID del artículo
   */
  const deleteArticle = async (id) => {
    if (!isAuthenticated) return;

    setLoadingArticles(true);
    setArticleError(null);

    try {
      await educationService.deleteArticle(id);
      // Eliminamos el artículo de la lista
      setArticles(prevArticles => prevArticles.filter(a => a.id !== id));
      // Si el artículo actual es el que se eliminó, limpiamos el estado
      if (article && article.id === id) {
        setArticle(null);
      }
      return true;
    } catch (error) {
      console.error(`Error eliminando artículo ${id}:`, error);
      setArticleError(error.message || `Error al eliminar el artículo ${id}`);
      return false;
    } finally {
      setLoadingArticles(false);
    }
  };

  // ==================== Funciones para guías ====================

  /**
   * Obtiene todas las guías
   */
  const fetchAllGuides = async () => {
    if (!isAuthenticated) return;

    setLoadingGuides(true);
    setGuideError(null);

    try {
      const response = await educationService.getAllGuides();
      setGuides(response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo guías:', error);
      setGuideError(error.message || 'Error al cargar las guías');
      return null;
    } finally {
      setLoadingGuides(false);
    }
  };

/**
 * Obtiene guías por ID de módulo
 * @param {number} moduleId - ID del módulo
 * @param {boolean} forceReload - Indica si se debe forzar la recarga
 * @returns {Promise<Array>} Lista de guías o array vacío
 */
const fetchGuidesByModuleId = async (moduleId, forceReload = false) => {
  if (!isAuthenticated) return [];

  // Siempre establecer el estado de carga
  setLoadingGuides(true);
  setGuideError(null);
  
  // Si forceReload es true, limpiamos el estado actual
  if (forceReload) {
    setGuides([]);
  }

  try {
    const response = await educationService.getGuidesByModuleId(moduleId);
    if (response && response.data) {
      setGuides(response.data);
      return response.data;
    }
    // Si no hay respuesta válida, establecer un array vacío
    setGuides([]);
    return [];
  } catch (error) {
    console.error(`Error obteniendo guías del módulo ${moduleId}:`, error);
    setGuideError(error.message || `Error al cargar guías del módulo ${moduleId}`);
    setGuides([]); // Importante: resetear a array vacío en caso de error
    return [];
  } finally {
    setLoadingGuides(false);
  }
};

  /**
   * Obtiene una guía por su ID
   * @param {number} id - ID de la guía
   */
  const fetchGuideById = useCallback(async (id) => {
    if (!isAuthenticated) return;

    setLoadingGuides(true);
    setGuideError(null);

    try {
      const response = await educationService.getGuideById(id);
      if (response && response.data) {
        setGuide(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Error obteniendo guía ${id}:`, error);
      setGuideError(error.message || `Error al cargar la guía ${id}`);
      return null;
    } finally {
      setLoadingGuides(false);
    }
  }, [isAuthenticated]);

  /**
   * Crea una nueva guía
   * @param {Object} guideData - Datos de la guía (incluido el archivo PDF)
   */
  const createGuide = async (guideData) => {
    if (!isAuthenticated) return;

    setLoadingGuides(true);
    setGuideError(null);

    try {
      const response = await educationService.createGuide(guideData);
      // Actualizamos la lista de guías
      setGuides(prevGuides => [response.data, ...prevGuides]);
      return response.data;
    } catch (error) {
      console.error('Error creando guía:', error);
      setGuideError(error.message || 'Error al crear la guía');
      return null;
    } finally {
      setLoadingGuides(false);
    }
  };

  /**
   * Actualiza una guía existente
   * @param {number} id - ID de la guía
   * @param {Object} updateData - Datos a actualizar
   */
  const updateGuide = async (id, updateData) => {
    if (!isAuthenticated) return;

    setLoadingGuides(true);
    setGuideError(null);

    try {
      const response = await educationService.updateGuide(id, updateData);
      // Actualizamos la guía en la lista
      setGuides(prevGuides =>
        prevGuides.map(g => g.id === id ? response.data : g)
      );
      // Si la guía actual es la que se actualizó, actualizamos también el estado
      if (guide && guide.id === id) {
        setGuide(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error actualizando guía ${id}:`, error);
      setGuideError(error.message || `Error al actualizar la guía ${id}`);
      return null;
    } finally {
      setLoadingGuides(false);
    }
  };

  /**
   * Elimina una guía
   * @param {number} id - ID de la guía
   */
  const deleteGuide = async (id) => {
    if (!isAuthenticated) return;

    setLoadingGuides(true);
    setGuideError(null);

    try {
      await educationService.deleteGuide(id);
      // Eliminamos la guía de la lista
      setGuides(prevGuides => prevGuides.filter(g => g.id !== id));
      // Si la guía actual es la que se eliminó, limpiamos el estado
      if (guide && guide.id === id) {
        setGuide(null);
      }
      return true;
    } catch (error) {
      console.error(`Error eliminando guía ${id}:`, error);
      setGuideError(error.message || `Error al eliminar la guía ${id}`);
      return false;
    } finally {
      setLoadingGuides(false);
    }
  };

  // ==================== Funciones para tags ====================

  /**
   * Obtiene todas las etiquetas
   */
  const fetchAllTags = async () => {
    if (!isAuthenticated) return;

    setLoadingTags(true);
    setTagError(null);

    try {
      const response = await educationService.getAllTags();
      setTags(response.data);
      return response.data;
    } catch (error) {
      console.error('Error obteniendo etiquetas:', error);
      setTagError(error.message || 'Error al cargar las etiquetas');
      return null;
    } finally {
      setLoadingTags(false);
    }
  };

  /**
   * Obtiene una etiqueta por su ID
   * @param {number} id - ID de la etiqueta
   */
  const fetchTagById = async (id) => {
    if (!isAuthenticated) return;

    setLoadingTags(true);
    setTagError(null);

    try {
      const response = await educationService.getTagById(id);
      setTag(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo etiqueta ${id}:`, error);
      setTagError(error.message || `Error al cargar la etiqueta ${id}`);
      return null;
    } finally {
      setLoadingTags(false);
    }
  };

  /**
   * Obtiene una etiqueta por su nombre
   * @param {string} name - Nombre de la etiqueta
   */
  const fetchTagByName = async (name) => {
    if (!isAuthenticated) return;

    setLoadingTags(true);
    setTagError(null);

    try {
      const response = await educationService.getTagByName(name);
      setTag(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo etiqueta "${name}":`, error);
      setTagError(error.message || `Error al cargar la etiqueta "${name}"`);
      return null;
    } finally {
      setLoadingTags(false);
    }
  };

  /**
   * Crea una nueva etiqueta
   * @param {string} name - Nombre de la etiqueta
   */
  const createTag = async (name) => {
    if (!isAuthenticated) return;

    setLoadingTags(true);
    setTagError(null);

    try {
      const response = await educationService.createTag(name);
      // Actualizamos la lista de etiquetas
      setTags(prevTags => [response.data, ...prevTags]);
      return response.data;
    } catch (error) {
      console.error(`Error creando etiqueta "${name}":`, error);
      setTagError(error.message || `Error al crear la etiqueta "${name}"`);
      return null;
    } finally {
      setLoadingTags(false);
    }
  };

  /**
   * Actualiza una etiqueta
   * @param {Object} tagData - Datos de la etiqueta (id, name)
   */
  const updateTag = async (tagData) => {
    if (!isAuthenticated) return;

    setLoadingTags(true);
    setTagError(null);

    try {
      const response = await educationService.updateTag(tagData);
      // Actualizamos la etiqueta en la lista
      setTags(prevTags =>
        prevTags.map(t => t.id === tagData.id ? response.data : t)
      );
      // Si la etiqueta actual es la que se actualizó, actualizamos también el estado
      if (tag && tag.id === tagData.id) {
        setTag(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error actualizando etiqueta ${tagData.id}:`, error);
      setTagError(error.message || `Error al actualizar la etiqueta ${tagData.id}`);
      return null;
    } finally {
      setLoadingTags(false);
    }
  };

  /**
   * Elimina una etiqueta
   * @param {number} id - ID de la etiqueta
   */
  const deleteTag = async (id) => {
    if (!isAuthenticated) return;

    setLoadingTags(true);
    setTagError(null);

    try {
      await educationService.deleteTag(id);
      // Eliminamos la etiqueta de la lista
      setTags(prevTags => prevTags.filter(t => t.id !== id));
      // Si la etiqueta actual es la que se eliminó, limpiamos el estado
      if (tag && tag.id === id) {
        setTag(null);
      }
      return true;
    } catch (error) {
      console.error(`Error eliminando etiqueta ${id}:`, error);
      setTagError(error.message || `Error al eliminar la etiqueta ${id}`);
      return false;
    } finally {
      setLoadingTags(false);
    }
  };

  /**
   * Obtiene o crea una etiqueta
   * @param {string} name - Nombre de la etiqueta
   */
  const getOrCreateTag = async (name) => {
    if (!isAuthenticated) return;

    setLoadingTags(true);
    setTagError(null);

    try {
      const response = await educationService.getOrCreateTag(name);
      // Si la etiqueta no existía en nuestra lista, la agregamos
      const exists = tags.some(t => t.id === response.data.id);
      if (!exists) {
        setTags(prevTags => [response.data, ...prevTags]);
      }
      return response.data;
    } catch (error) {
      console.error(`Error obteniendo o creando etiqueta "${name}":`, error);
      setTagError(error.message || `Error al obtener o crear la etiqueta "${name}"`);
      return null;
    } finally {
      setLoadingTags(false);
    }
  };

  // ==================== Funciones para videos ====================

/**
 * Obtiene videos por ID de módulo
 * @param {number} moduleId - ID del módulo
 * @param {boolean} forceReload - Indica si se debe forzar la recarga
 * @returns {Promise<Array>} Lista de videos o array vacío
 */
const fetchVideosByModuleId = async (moduleId, forceReload = false) => {
  if (!isAuthenticated) return [];

  // Siempre establecer el estado de carga
  setLoadingVideos(true);
  setVideoError(null);
  
  // Si forceReload es true, limpiamos el estado actual
  if (forceReload) {
    setVideos([]);
  }

  try {
    const response = await educationService.getVideosByModuleId(moduleId);
    if (response && response.data) {
      setVideos(response.data);
      return response.data;
    }
    // Si no hay respuesta válida, establecer un array vacío
    setVideos([]);
    return [];
  } catch (error) {
    console.error(`Error obteniendo videos del módulo ${moduleId}:`, error);
    setVideoError(error.message || `Error al cargar videos del módulo ${moduleId}`);
    setVideos([]); // Importante: resetear a array vacío en caso de error
    return [];
  } finally {
    setLoadingVideos(false);
  }
};

  /**
   * Obtiene un video por su ID
   * @param {number} id - ID del video
   */
  const fetchVideoById = useCallback(async (id) => {
    if (!isAuthenticated) return;

    setLoadingVideos(true);
    setVideoError(null);

    try {
      const response = await educationService.getVideoById(id);
      if (response && response.data) {
        setVideo(response.data);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error(`Error obteniendo video ${id}:`, error);
      setVideoError(error.message || `Error al cargar el video ${id}`);
      return null;
    } finally {
      setLoadingVideos(false);
    }
  }, [isAuthenticated]);

  /**
   * Crea un nuevo video
   * @param {Object} videoData - Datos del video
   */
  const createVideo = async (videoData) => {
    if (!isAuthenticated) return;

    setLoadingVideos(true);
    setVideoError(null);

    try {
      const response = await educationService.createVideo(videoData);
      // Actualizamos la lista de videos
      setVideos(prevVideos => [response.data, ...prevVideos]);
      return response.data;
    } catch (error) {
      console.error('Error creando video:', error);
      setVideoError(error.message || 'Error al crear el video');
      return null;
    } finally {
      setLoadingVideos(false);
    }
  };

  /**
   * Actualiza un video existente
   * @param {number} id - ID del video
   * @param {Object} updateData - Datos a actualizar
   */
  const updateVideo = async (id, updateData) => {
    if (!isAuthenticated) return;

    setLoadingVideos(true);
    setVideoError(null);

    try {
      const response = await educationService.updateVideo(id, updateData);
      // Actualizamos el video en la lista
      setVideos(prevVideos =>
        prevVideos.map(v => v.id === id ? response.data : v)
      );
      // Si el video actual es el que se actualizó, actualizamos también el estado
      if (video && video.id === id) {
        setVideo(response.data);
      }
      return response.data;
    } catch (error) {
      console.error(`Error actualizando video ${id}:`, error);
      setVideoError(error.message || `Error al actualizar el video ${id}`);
      return null;
    } finally {
      setLoadingVideos(false);
    }
  };

  /**
   * Elimina un video
   * @param {number} id - ID del video
   */
  const deleteVideo = async (id) => {
    if (!isAuthenticated) return;

    setLoadingVideos(true);
    setVideoError(null);

    try {
      await educationService.deleteVideo(id);
      // Eliminamos el video de la lista
      setVideos(prevVideos => prevVideos.filter(v => v.id !== id));
      // Si el video actual es el que se eliminó, limpiamos el estado
      if (video && video.id === id) {
        setVideo(null);
      }
      return true;
    } catch (error) {
      console.error(`Error eliminando video ${id}:`, error);
      setVideoError(error.message || `Error al eliminar el video ${id}`);
      return false;
    } finally {
      setLoadingVideos(false);
    }
  };

  // ==================== Funciones de reseteo de estados ====================

  /**
   * Resetea el estado de módulos
   */
  const resetModuleState = () => {
    setModule(null);
    setModuleError(null);
  };

  /**
   * Resetea el estado de artículos
   */
  const resetArticleState = () => {
    setArticle(null);
    setArticleError(null);
  };

  /**
   * Resetea el estado de guías
   */
  const resetGuideState = () => {
    setGuide(null);
    setGuideError(null);
  };

  /**
   * Resetea el estado de etiquetas
   */
  const resetTagState = () => {
    setTag(null);
    setTagError(null);
  };

  /**
   * Resetea el estado de videos
   */
  const resetVideoState = () => {
    setVideo(null);
    setVideoError(null);
  };

  // Valor del contexto que exponemos a componentes consumidores
  const value = {
    // Estado de módulos
    modules,
    module,
    loadingModules,
    moduleError,

    // Estado de artículos
    articles,
    article,
    loadingArticles,
    articleError,

    // Estado de guías
    guides,
    guide,
    loadingGuides,
    guideError,

    // Estado de tags
    tags,
    tag,
    loadingTags,
    tagError,

    // Estado de videos
    videos,
    video,
    loadingVideos,
    videoError,

    // Funciones para módulos
    fetchAllModules,
    fetchModuleById,
    createModule,
    updateModule,
    deleteModule,
    filterModulesByTags,

    // Funciones para artículos
    fetchArticlesByModuleId,
    fetchArticleById,
    createArticle,
    updateArticle,
    deleteArticle,

    // Funciones para guías
    fetchAllGuides,
    fetchGuidesByModuleId,
    fetchGuideById,
    createGuide,
    updateGuide,
    deleteGuide,

    // Funciones para tags
    fetchAllTags,
    fetchTagById,
    fetchTagByName,
    createTag,
    updateTag,
    deleteTag,
    getOrCreateTag,

    // Funciones para videos
    fetchVideosByModuleId,
    fetchVideoById,
    createVideo,
    updateVideo,
    deleteVideo,

    // Funciones de reseteo de estados
    resetModuleState,
    resetArticleState,
    resetGuideState,
    resetTagState,
    resetVideoState
  };

  return (
    <EducationContext.Provider value={value}>
      {children}
    </EducationContext.Provider>
  );
};

// Hook personalizado para acceder al contexto de educación
export const useEducation = () => {
  const context = useContext(EducationContext);
  if (!context) {
    throw new Error('useEducation debe ser usado dentro de un EducationProvider');
  }
  return context;
};