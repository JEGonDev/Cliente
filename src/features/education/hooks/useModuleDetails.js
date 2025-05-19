import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../authentication/context/AuthContext';
import { useModules } from './useModules';
import { useArticles } from './useArticles';
import { useGuides } from './useGuides';
import { useVideos } from './useVideos';

/**
 * @returns {Object} Estado y funciones para gestionar todos los aspectos de un módulo
 * 
 * @property {string|number} moduleId - ID del módulo actual
 * @property {boolean} isAdmin - Si el usuario actual es administrador
 * @property {Object} module - Datos del módulo actual
 * @property {Array} articles - Lista de artículos del módulo
 * @property {Array} guides - Lista de guías del módulo
 * @property {Array} videos - Lista de videos del módulo
 * @property {Array} moduleTags - Etiquetas del módulo actual procesadas
 * 
 * @property {boolean} isLoading - Estado general de carga
 * @property {boolean} loadingModule - Estado de carga del módulo
 * @property {boolean} loadingArticles - Estado de carga de artículos
 * @property {boolean} loadingGuides - Estado de carga de guías
 * @property {boolean} loadingVideos - Estado de carga de videos
 * 
 * @property {Object} moduleError - Error de carga del módulo
 * @property {Object} articleError - Error de carga de artículos
 * @property {Object} guideError - Error de carga de guías
 * @property {Object} videoError - Error de carga de videos
 * 
 * @property {boolean} articleModalOpen - Estado del modal de artículos
 * @property {boolean} guideModalOpen - Estado del modal de guías 
 * @property {boolean} videoModalOpen - Estado del modal de videos
 * @property {boolean} deleteModalOpen - Estado del modal de eliminación
 * 
 * @property {number|null} selectedArticleId - ID del artículo seleccionado
 * @property {number|null} selectedGuideId - ID de la guía seleccionada
 * @property {number|null} selectedVideoId - ID del video seleccionado
 * 
 * @property {string} deleteType - Tipo de contenido a eliminar
 * @property {boolean} isDeleting - Estado de proceso de eliminación
 * @property {Object} deleteModalProps - Propiedades para el modal de eliminación
 * 
 * @property {Function} openCreateArticleModal - Abre modal para crear artículo
 * @property {Function} openEditArticleModal - Abre modal para editar artículo
 * @property {Function} confirmDeleteArticle - Confirma eliminación de artículo
 * 
 * @property {Function} openCreateGuideModal - Abre modal para crear guía
 * @property {Function} openEditGuideModal - Abre modal para editar guía
 * @property {Function} confirmDeleteGuide - Confirma eliminación de guía
 * 
 * @property {Function} openCreateVideoModal - Abre modal para crear video
 * @property {Function} openEditVideoModal - Abre modal para editar video
 * @property {Function} confirmDeleteVideo - Confirma eliminación de video
 * 
 * @property {Function} closeArticleModal - Cierra modal de artículo
 * @property {Function} closeGuideModal - Cierra modal de guía
 * @property {Function} closeVideoModal - Cierra modal de video
 * @property {Function} closeDeleteModal - Cierra modal de eliminación
 * 
 * @property {Function} handleDelete - Ejecuta la eliminación del elemento
 * @property {Function} refreshContent - Recarga todo el contenido del módulo
 * @property {Function} loadModuleData - Carga inicial de datos del módulo
 */
export const useModuleDetails = () => {
  // Obtenemos el ID del módulo de los parámetros de la URL
  const { moduleId } = useParams();

  // IMPORTANTE: Usamos useParams para obtener dinámicamente el ID del módulo de la URL 
  // en lugar de requerir que se pase como prop, simplificando el uso del hook
  
  // Información de autenticación y permisos
  const { isAdmin } = useContext(AuthContext);
  
  // Hooks personalizados para cada tipo de contenido
  const { 
    module, 
    loading: loadingModule, 
    error: moduleError, 
    fetchModuleById 
  } = useModules();
  
  const { 
    articles, 
    loading: loadingArticles, 
    error: articleError,
    fetchArticlesByModuleId,
    handleDeleteArticle 
  } = useArticles();
  
  const { 
    guides, 
    loading: loadingGuides, 
    error: guideError,
    fetchGuidesByModuleId,
    handleDeleteGuide 
  } = useGuides();
  
  const { 
    videos, 
    loading: loadingVideos, 
    error: videoError,
    fetchVideosByModuleId,
    handleDeleteVideo 
  } = useVideos();

  // Estados para controlar los modales
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  // Estados para elementos seleccionados
  const [selectedArticleId, setSelectedArticleId] = useState(null);
  const [selectedGuideId, setSelectedGuideId] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  
  // Estados para procesos de eliminación
  const [deleteType, setDeleteType] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Control de carga inicial
  const [loadAttempted, setLoadAttempted] = useState(false);

  /**
   * Carga los datos del módulo y todos sus contenidos relacionados
   */
  const loadModuleData = useCallback(async () => {
    if (!moduleId) return;
    
    try {
      // Primero cargamos el módulo principal
      await fetchModuleById(moduleId);
      
      // Ahora cargamos todos los contenidos relacionados con forceReload=true
      await Promise.all([
        fetchArticlesByModuleId(moduleId, true),
        fetchGuidesByModuleId(moduleId, true),
        fetchVideosByModuleId(moduleId, true)
      ]);
    } catch (error) {
      console.error("Error cargando el módulo:", error);
    } finally {
      setLoadAttempted(true);
    }
  }, [moduleId]);

  // Cargar datos al iniciar
  useEffect(() => {
    // Cuando cambia el moduleId, necesitamos hacer una nueva carga
    if (moduleId) {
      // Reset la bandera de carga
      setLoadAttempted(false);
      
      // Carga los datos
      loadModuleData();
    }
    
    // Función de limpieza al desmontar
    return () => {
      // Podemos hacer alguna limpieza si es necesario
      setLoadAttempted(false);
    };
  }, [moduleId]); 

  // ==================== Funciones para modales de Artículos ====================
  
  /**
   * Abre el modal para crear un nuevo artículo
   */
  const openCreateArticleModal = () => {
    setSelectedArticleId(null);
    setArticleModalOpen(true);
  };

  /**
   * Abre el modal para editar un artículo existente
   * @param {number} id - ID del artículo a editar
   */
  const openEditArticleModal = (id) => {
    setSelectedArticleId(id);
    setArticleModalOpen(true);
  };

  /**
   * Abre el modal de confirmación para eliminar un artículo
   * @param {number} id - ID del artículo a eliminar
   */
  const confirmDeleteArticle = (id) => {
    setDeleteType('article');
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // ==================== Funciones para modales de Guías ====================
  
  /**
   * Abre el modal para crear una nueva guía
   */
  const openCreateGuideModal = () => {
    setSelectedGuideId(null);
    setGuideModalOpen(true);
  };

  /**
   * Abre el modal para editar una guía existente
   * @param {number} id - ID de la guía a editar
   */
  const openEditGuideModal = (id) => {
    setSelectedGuideId(id);
    setGuideModalOpen(true);
  };

  /**
   * Abre el modal de confirmación para eliminar una guía
   * @param {number} id - ID de la guía a eliminar
   */
  const confirmDeleteGuide = (id) => {
    setDeleteType('guide');
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // ==================== Funciones para modales de Videos ====================
  
  /**
   * Abre el modal para crear un nuevo video
   */
  const openCreateVideoModal = () => {
    setSelectedVideoId(null);
    setVideoModalOpen(true);
  };

  /**
   * Abre el modal para editar un video existente
   * @param {number} id - ID del video a editar
   */
  const openEditVideoModal = (id) => {
    setSelectedVideoId(id);
    setVideoModalOpen(true);
  };

  /**
   * Abre el modal de confirmación para eliminar un video
   * @param {number} id - ID del video a eliminar
   */
  const confirmDeleteVideo = (id) => {
    setDeleteType('video');
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  // ==================== Funciones de eliminación ====================
  
  /**
   * Ejecuta la eliminación del elemento seleccionado
   * @returns {Promise<boolean>} true si la eliminación fue exitosa
   */
  const handleDelete = useCallback(async () => {
    if (!deleteId || !deleteType) return false;
    
    setIsDeleting(true);
    try {
      let success = false;
      
      switch (deleteType) {
        case 'article':
          success = await handleDeleteArticle(deleteId);
          if (success && moduleId) await fetchArticlesByModuleId(moduleId);
          break;
        case 'guide':
          success = await handleDeleteGuide(deleteId);
          if (success && moduleId) await fetchGuidesByModuleId(moduleId);
          break;
        case 'video':
          success = await handleDeleteVideo(deleteId);
          if (success && moduleId) await fetchVideosByModuleId(moduleId);
          break;
        default:
          break;
      }
      
      if (success) {
        setDeleteModalOpen(false);
        setDeleteId(null);
        setDeleteType('');
      }
      
      return success;
    } catch (error) {
      console.error(`Error eliminando ${deleteType}:`, error);
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [deleteId, deleteType, moduleId, handleDeleteArticle, handleDeleteGuide, handleDeleteVideo]);

  /**
   * Refresca todos los contenidos del módulo
   * 
   * IMPORTANTE: Esta función usa Promise.all para cargar datos en paralelo
   * mejorando el rendimiento al no bloquear las llamadas sucesivas
   */
  const refreshContent = useCallback(async () => {
    if (!moduleId) return;
    
    try {
      await fetchArticlesByModuleId(moduleId);
      await fetchGuidesByModuleId(moduleId);
      await fetchVideosByModuleId(moduleId);
    } catch (error) {
      console.error("Error refrescando contenido:", error);
    }
  }, [moduleId]); // Solo dependemos del moduleId

  /**
   * Procesa las etiquetas del módulo para asegurar un formato consistente
   * @returns {Array} Lista de etiquetas procesadas
   */
  const getModuleTags = () => {
    if (!module || !module.tags) return [];
    
    // Si los tags son strings, los usamos directamente
    if (Array.isArray(module.tags) && module.tags.length > 0) {
      if (typeof module.tags[0] === 'string') {
        return module.tags;
      }
      
      // Si son objetos, extraemos la propiedad name
      if (typeof module.tags[0] === 'object' && module.tags[0] !== null) {
        return module.tags;
      }
    }
    
    return [];
  };

  /**
   * Obtiene las propiedades para el modal de eliminación según el tipo
   * @returns {Object} Título y mensaje para el modal
   */
  const getDeleteModalProps = () => {
    switch (deleteType) {
      case 'article':
        return {
          title: "Eliminar artículo",
          message: "¿Estás seguro de que deseas eliminar este artículo?"
        };
      case 'guide':
        return {
          title: "Eliminar guía",
          message: "¿Estás seguro de que deseas eliminar esta guía?"
        };
      case 'video':
        return {
          title: "Eliminar video",
          message: "¿Estás seguro de que deseas eliminar este video?"
        };
      default:
        return {
          title: "Confirmar eliminación",
          message: "¿Estás seguro de que deseas eliminar este elemento?"
        };
    }
  };

  // Cálculo del estado de carga general
  const isLoading = loadingModule && !loadAttempted;

  return {
    // Estados principales
    moduleId,
    isAdmin,
    module,
    articles,
    guides,
    videos,
    moduleTags: getModuleTags(),
    
    // Estados de carga y errores
    isLoading,
    loadingModule,
    loadingArticles,
    loadingGuides,
    loadingVideos,
    moduleError,
    articleError,
    guideError,
    videoError,
    
    // Estados de modales
    articleModalOpen,
    guideModalOpen,
    videoModalOpen,
    deleteModalOpen,
    
    // IDs seleccionados
    selectedArticleId,
    selectedGuideId,
    selectedVideoId,
    
    // Estados de eliminación
    deleteType,
    isDeleting,
    deleteModalProps: getDeleteModalProps(),
    
    // Funciones de modales de artículos
    openCreateArticleModal,
    openEditArticleModal,
    confirmDeleteArticle,
    
    // Funciones de modales de guías
    openCreateGuideModal,
    openEditGuideModal,
    confirmDeleteGuide,
    
    // Funciones de modales de videos
    openCreateVideoModal,
    openEditVideoModal,
    confirmDeleteVideo,
    
    // Funciones de cierre de modales
    closeArticleModal: () => setArticleModalOpen(false),
    closeGuideModal: () => setGuideModalOpen(false),
    closeVideoModal: () => setVideoModalOpen(false),
    closeDeleteModal: () => setDeleteModalOpen(false),
    
    // Funciones de operaciones
    handleDelete,
    refreshContent,
    
    // Función de carga de datos
    loadModuleData
  };
};