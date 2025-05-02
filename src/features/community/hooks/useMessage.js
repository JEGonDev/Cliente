import { useState, useContext } from 'react';
import { CommunityContext } from '../context/CommunityContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de mensajes
 * 
 * Este hook encapsula:
 * - Estados del formulario de creación de mensajes
 * - Estado de la UI (errores, carga)
 * - Handlers para interacción con mensajes (crear, eliminar)
 * 
 * @returns {Object} Propiedades y métodos para trabajar con mensajes
 */
export const useMessage = () => {
  // Contexto de comunidad
  const { 
    messages, 
    message, 
    loadingMessages, 
    messageError,
    fetchAllMessages,
    fetchMessageById,
    createMessage: contextCreateMessage,
    deleteMessage: contextDeleteMessage,
    canDeleteMessage
  } = useContext(CommunityContext);
  
  // Contexto de autenticación
  const { user, isAdmin, isModerator } = useContext(AuthContext);
  
  // Estados locales para el formulario
  const [formData, setFormData] = useState({
    postId: null,
    content: '',
    threadId: null,
    groupId: null
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
    
    if (!formData.postId) {
      errors.postId = 'El ID del post es obligatorio';
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
    
    if (name === 'postId' || name === 'threadId' || name === 'groupId') {
      // Convertir a número o null si está vacío
      const numValue = value ? parseInt(value, 10) : null;
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  /**
   * Establece directamente el postId y otras propiedades opcionales en el formulario
   * @param {number} postId - ID del post asociado al mensaje
   * @param {number} threadId - ID del hilo (opcional)
   * @param {number} groupId - ID del grupo (opcional)
   */
  const setMessageContext = (postId, threadId = null, groupId = null) => {
    setFormData(prev => ({
      ...prev,
      postId,
      threadId,
      groupId
    }));
  };
  
  /**
   * Limpia el formulario después de una operación
   */
  const resetForm = () => {
    setFormData({
      postId: null,
      content: '',
      threadId: null,
      groupId: null
    });
    setFormErrors({});
  };
  
  /**
   * Limpia solo el contenido del formulario, manteniendo el contexto
   */
  const resetContent = () => {
    setFormData(prev => ({
      ...prev,
      content: ''
    }));
  };
  
  /**
   * Maneja el envío del formulario para crear un mensaje
   * @param {Event} e - Evento de envío del formulario (opcional)
   */
  const handleCreateMessage = async (e) => {
    if (e) e.preventDefault();
    
    // Reset mensajes
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      const newMessage = await contextCreateMessage(formData);
      if (newMessage) {
        setSuccessMessage('Mensaje enviado correctamente');
        // Limpiamos solo el contenido, manteniendo el contexto (postId, etc.)
        resetContent();
        return newMessage;
      }
      return null;
    } catch (error) {
      console.error('Error al crear mensaje:', error);
      setFormErrors({ general: error.message || 'Error al crear el mensaje' });
      return null;
    }
  };
  
  /**
   * Maneja la eliminación de un mensaje
   * @param {number} id - ID del mensaje a eliminar
   */
  const handleDeleteMessage = async (id) => {
    // Obtenemos los datos del mensaje
    const messageData = await fetchMessageById(id);
    if (!messageData) {
      setFormErrors({ general: 'No se pudo encontrar el mensaje' });
      return false;
    }
    
    // Verificar permisos
    if (!canDeleteMessage(messageData)) {
      setFormErrors({
        permission: 'No tienes permisos para eliminar este mensaje. Solo el creador, un administrador o un moderador pueden eliminar mensajes.'
      });
      return false;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      try {
        const success = await contextDeleteMessage(id);
        if (success) {
          setSuccessMessage('Mensaje eliminado correctamente');
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Error al eliminar mensaje ${id}:`, error);
        setFormErrors({ general: error.message || `Error al eliminar el mensaje ${id}` });
        return false;
      }
    }
    return false;
  };
  
  /**
   * Obtiene mensajes relacionados con un post específico
   * @param {number} postId - ID del post
   * @returns {Array} Lista de mensajes filtrados
   */
  const getMessagesByPostId = (postId) => {
    return messages.filter(msg => msg.postId === postId);
  };
  
  /**
   * Obtiene mensajes relacionados con un hilo específico
   * @param {number} threadId - ID del hilo
   * @returns {Array} Lista de mensajes filtrados
   */
  const getMessagesByThreadId = (threadId) => {
    return messages.filter(msg => msg.threadId === threadId);
  };
  
  /**
   * Obtiene mensajes relacionados con un grupo específico
   * @param {number} groupId - ID del grupo
   * @returns {Array} Lista de mensajes filtrados
   */
  const getMessagesByGroupId = (groupId) => {
    return messages.filter(msg => msg.groupId === groupId);
  };
  
  /**
   * Obtiene mensajes de un usuario específico
   * @param {number} userId - ID del usuario
   * @returns {Array} Lista de mensajes filtrados
   */
  const getMessagesByUserId = (userId) => {
    return messages.filter(msg => msg.userId === userId);
  };
  
  /**
   * Obtiene mensajes del usuario actual
   * @returns {Array} Lista de mensajes del usuario actual
   */
  const getCurrentUserMessages = () => {
    if (!user) return [];
    return getMessagesByUserId(user.id);
  };
  
  // Retornamos todos los estados y funciones que necesita el componente
  return {
    // Estados
    messages,
    message,
    loading: loadingMessages,
    error: messageError,
    formData,
    formErrors,
    successMessage,
    
    // Funciones para obtener datos
    fetchAllMessages,
    fetchMessageById,
    getMessagesByPostId,
    getMessagesByThreadId,
    getMessagesByGroupId,
    getMessagesByUserId,
    getCurrentUserMessages,
    
    // Funciones de formulario
    handleChange,
    setMessageContext,
    resetForm,
    resetContent,
    
    // Funciones de CRUD
    handleCreateMessage,
    handleDeleteMessage,
    
    // Helpers
    canDeleteMessage
  };
};