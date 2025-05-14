import { useState, useContext , useCallback } from 'react';
import { EducationContext } from '../context/EducationContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de videos educativos
 * 
 * @returns {Object} Propiedades y métodos para trabajar con videos
 */
export const useVideos = () => {
  // Contexto de educación
  const {
    videos,
    video,
    loadingVideos,
    videoError,
    fetchVideosByModuleId,
    fetchVideoById,
    createVideo: contextCreateVideo,
    updateVideo: contextUpdateVideo,
    deleteVideo: contextDeleteVideo
  } = useContext(EducationContext);
  
  // Contexto de autenticación para validar permisos
  const { isAdmin, isAuthenticated } = useContext(AuthContext);
  
  // Estado para formularios y UI
  const [formData, setFormData] = useState({
    moduleId: null,
    title: '',
    videoUrl: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  /**
   * Valida el formulario de video
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.moduleId) {
      errors.moduleId = 'El módulo es obligatorio';
    }
    
    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    }
    
    if (!formData.videoUrl.trim()) {
      errors.videoUrl = 'La URL del video es obligatoria';
    } else if (!isValidUrl(formData.videoUrl)) {
      errors.videoUrl = 'La URL no es válida';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Valida si una cadena es una URL válida
   * @param {string} url - URL a validar
   * @returns {boolean} true si es válida, false si no
   */
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'moduleId') {
      // Convertir a número o null si está vacío
      const numValue = value ? parseInt(value, 10) : null;
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  /**
   * Establecer directamente el moduleId
   * @param {number} moduleId - ID del módulo
   */
  const setModuleId = (moduleId) => {
    setFormData(prev => ({ ...prev, moduleId }));
  };
  
  /**
   * Resetea el formulario
   */
  const resetForm = () => {
    setFormData({
      moduleId: null,
      title: '',
      videoUrl: ''
    });
    setFormErrors({});
    setSuccessMessage('');
  };
  
  /**
   * Carga datos de un video existente en el formulario
   * @param {number} id - ID del video
   */
  const loadVideoForEdit = useCallback(async (id) => {
    try {
      const videoData = await fetchVideoById(id);
      
      if (videoData) {
        setFormData({
          moduleId: videoData.moduleId || null,
          title: videoData.title || '',
          videoUrl: videoData.videoUrl || ''
        });
        return videoData;
      }
      return null;
    } catch (error) {
      console.error(`Error cargando video ${id} para editar:`, error);
      return null;
    }
  }, [fetchVideoById]);
  
  /**
   * Crea un nuevo video
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreateVideo = async (e) => {
    e.preventDefault();
    
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }
    
    // Sólo los administradores pueden crear videos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para crear videos' });
      return null;
    }
    
    // Limpiar mensajes previos
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      const newVideo = await contextCreateVideo(formData);
      
      if (newVideo) {
        setSuccessMessage('Video creado correctamente');
        resetForm();
        return newVideo;
      }
      return null;
    } catch (error) {
      console.error('Error creando video:', error);
      return null;
    }
  };
  
  /**
   * Actualiza un video existente
   * @param {number} id - ID del video
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdateVideo = async (id, e) => {
    e.preventDefault();
    
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }
    
    // Sólo los administradores pueden actualizar videos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para actualizar videos' });
      return null;
    }
    
    // Limpiar mensajes previos
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      // Preparar datos para actualización
      const updateData = {
        videoId: id,
        ...formData
      };
      
      const updatedVideo = await contextUpdateVideo(id, updateData);
      
      if (updatedVideo) {
        setSuccessMessage('Video actualizado correctamente');
        return updatedVideo;
      }
      return null;
    } catch (error) {
      console.error(`Error actualizando video ${id}:`, error);
      return null;
    }
  };
  
  /**
   * Elimina un video
   * @param {number} id - ID del video
   */
  const handleDeleteVideo = async (id) => {
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return false;
    }
    
    // Sólo los administradores pueden eliminar videos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para eliminar videos' });
      return false;
    }
    
    try {
      // Confirmar eliminación
      if (window.confirm('¿Estás seguro de que deseas eliminar este video?')) {
        const success = await contextDeleteVideo(id);
        
        if (success) {
          setSuccessMessage('Video eliminado correctamente');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error(`Error eliminando video ${id}:`, error);
      return false;
    }
  };
  
  // Retornamos los estados y funciones que necesita el componente
  return {
    // Estados
    videos,
    video,
    loading: loadingVideos,
    error: videoError,
    formData,
    formErrors,
    successMessage,
    
    // Funciones de obtención de datos
    fetchVideosByModuleId,
    fetchVideoById,
    
    // Funciones de formulario
    handleChange,
    setModuleId,
    resetForm,
    loadVideoForEdit,
    
    // Funciones CRUD
    handleCreateVideo,
    handleUpdateVideo,
    handleDeleteVideo,
    
    // Helper para permisos
    canManageVideos: isAdmin
  };
};