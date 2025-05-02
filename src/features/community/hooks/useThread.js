import { useState, useContext } from 'react';
import { CommunityContext } from '../context/CommunityContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de hilos
 * 
 * Este hook encapsula:
 * - Estados del formulario de creación y actualización de hilos
 * - Estado de la UI (errores, carga)
 * - Handlers para interacción con hilos (crear, actualizar, eliminar)
 * 
 * @returns {Object} Propiedades y métodos para trabajar con hilos
 */
export const useThread = () => {
  // Contexto de comunidad
  const {
    threads,
    thread,
    posts,
    loadingThreads,
    threadError,
    fetchAllThreads,
    fetchThreadById,
    createThread: contextCreateThread,
    updateThread: contextUpdateThread,
    deleteThread: contextDeleteThread
  } = useContext(CommunityContext);
  
  // Contexto de autenticación para validar permisos
  const { isAdmin, user } = useContext(AuthContext);
  
  // Estados locales para el formulario
  const [formData, setFormData] = useState({
    groupId: null,
    title: '',
    content: ''
  });
  
  // Estado para errores del formulario
  const [formErrors, setFormErrors] = useState({});
  
  // Estado para mostrar mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');
  
  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'El contenido es obligatorio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'groupId') {
      // Convertir a número o null si está vacío
      const numValue = value ? parseInt(value, 10) : null;
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  /**
   * Establece directamente el groupId en el formulario
   * @param {number} groupId - ID del grupo asociado al hilo
   */
  const setThreadGroup = (groupId) => {
    setFormData(prev => ({
      ...prev,
      groupId
    }));
  };
  
  /**
   * Limpia el formulario después de una operación
   */
  const resetForm = () => {
    setFormData({
      groupId: null,
      title: '',
      content: ''
    });
    setFormErrors({});
  };
  
  /**
   * Verifica si el usuario tiene permisos para crear/administrar hilos
   * @returns {boolean} true si tiene permisos, false si no
   */
  const canManageThreads = () => {
    // Verificar si el usuario es administrador o moderador
    return isAdmin || (user && user.roles && user.roles.includes('MODERADOR'));
  };
  
  /**
   * Verifica si el usuario es el creador de un hilo específico
   * @param {Object} threadData - Datos del hilo
   * @returns {boolean} true si es el creador, false si no
   */
  const isThreadCreator = (threadData) => {
    return threadData && user && threadData.userId === user.id;
  };
  
  /**
   * Verifica si el usuario puede actualizar un hilo específico
   * @param {Object} threadData - Datos del hilo
   * @returns {boolean} true si puede actualizar, false si no
   */
  const canUpdateThread = (threadData) => {
    return isThreadCreator(threadData);
  };
  
  /**
   * Verifica si el usuario puede eliminar un hilo específico
   * @param {Object} threadData - Datos del hilo
   * @returns {boolean} true si puede eliminar, false si no
   */
  const canDeleteThread = (threadData) => {
    return isAdmin || isThreadCreator(threadData);
  };
  
  /**
   * Maneja el envío del formulario para crear un hilo
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreateThread = async (e) => {
    e.preventDefault();
    
    // Verificar permisos
    if (!canManageThreads()) {
      setFormErrors({
        permission: 'No tienes permisos para crear hilos'
      });
      return;
    }
    
    // Reset mensajes
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return;
    
    try {
      const newThread = await contextCreateThread(formData);
      if (newThread) {
        setSuccessMessage('Hilo creado correctamente');
        resetForm();
        return newThread;
      }
      return null;
    } catch (error) {
      console.error('Error al crear hilo:', error);
      return null;
    }
  };
  
  /**
   * Carga los datos de un hilo para editarlo
   * @param {number} id - ID del hilo a editar
   */
  const loadThreadForEdit = async (id) => {
    try {
      const threadData = await fetchThreadById(id);
      if (threadData) {
        // Verificar permisos
        if (!canUpdateThread(threadData)) {
          setFormErrors({
            permission: 'No tienes permisos para editar este hilo'
          });
          return null;
        }
        
        setFormData({
          groupId: threadData.groupId || null,
          title: threadData.title || '',
          content: threadData.content || ''
        });
        
        return threadData;
      }
      return null;
    } catch (error) {
      console.error(`Error al cargar hilo ${id} para editar:`, error);
      return null;
    }
  };
  
  /**
   * Maneja el envío del formulario para actualizar un hilo
   * @param {number} id - ID del hilo a actualizar
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdateThread = async (id, e) => {
    e.preventDefault();
    
    // Verificamos si el usuario puede actualizar este hilo
    const threadData = await fetchThreadById(id);
    if (!threadData || !canUpdateThread(threadData)) {
      setFormErrors({
        permission: 'No tienes permisos para actualizar este hilo'
      });
      return null;
    }
    
    // Reset mensajes
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      // Creamos un objeto con los datos a actualizar según el formato esperado por el backend
      const updateData = {
        title: formData.title,
        content: formData.content
      };
      
      const updatedThread = await contextUpdateThread(id, updateData);
      if (updatedThread) {
        setSuccessMessage('Hilo actualizado correctamente');
        return updatedThread;
      }
      return null;
    } catch (error) {
      console.error(`Error al actualizar hilo ${id}:`, error);
      return null;
    }
  };
  
  /**
   * Maneja la eliminación de un hilo
   * @param {number} id - ID del hilo a eliminar
   */
  const handleDeleteThread = async (id) => {
    // Verificamos si el usuario puede eliminar este hilo
    const threadData = await fetchThreadById(id);
    if (!threadData || !canDeleteThread(threadData)) {
      setFormErrors({
        permission: 'No tienes permisos para eliminar este hilo'
      });
      return false;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este hilo?')) {
      try {
        const success = await contextDeleteThread(id);
        if (success) {
          setSuccessMessage('Hilo eliminado correctamente');
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Error al eliminar hilo ${id}:`, error);
        return false;
      }
    }
    return false;
  };
  
  /**
   * Obtiene hilos asociados con un grupo específico
   * @param {number} groupId - ID del grupo
   * @returns {Array} Lista de hilos filtrados
   */
  const getThreadsByGroupId = (groupId) => {
    return threads.filter(t => t.groupId === groupId);
  };
  
  /**
   * Obtiene posts asociados con un hilo específico
   * @param {number} threadId - ID del hilo
   * @returns {Array} Lista de posts filtrados
   */
  const getPostsByThreadId = (threadId) => {
    return posts.filter(p => p.threadId === threadId);
  };
  
  // Retornamos todos los estados y funciones que necesita el componente
  return {
    // Estados
    threads,
    thread,
    loading: loadingThreads,
    error: threadError,
    formData,
    formErrors,
    successMessage,
    
    // Funciones para obtener datos
    fetchAllThreads,
    fetchThreadById,
    getThreadsByGroupId,
    getPostsByThreadId,
    
    // Funciones de formulario
    handleChange,
    setThreadGroup,
    resetForm,
    
    // Funciones de CRUD
    handleCreateThread,
    loadThreadForEdit,
    handleUpdateThread,
    handleDeleteThread,
    
    // Helpers
    canManageThreads,
    isThreadCreator,
    canUpdateThread,
    canDeleteThread
  };
};