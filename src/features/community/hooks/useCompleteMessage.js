import { useState, useContext, useCallback } from 'react';
import { MessageContext } from '../context/MessageContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook completo para manejar mensajes con todas las funcionalidades
 */
export const useCompleteMessage = () => {
  const {
    messages,
    loading,
    error,
    selectedMessage,
    messageLoading,
    fetchAllMessages,
    fetchMessageById,
    createMessage,
    deleteMessage,
    fetchMessagesByContext,
    fetchPostMessages,
    fetchGroupMessages,
    fetchThreadMessages,
    fetchForumMessages,
    getContextMessages,
    isContextLoading,
    clearError
  } = useContext(MessageContext);

  const { user, isAdmin, isModerator } = useContext(AuthContext);

  // Estados locales para formulario
  const [formData, setFormData] = useState({
    content: '',
    postId: null,
    threadId: null,
    groupId: null
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Validar formulario de mensaje
   */
  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.content.trim()) {
      errors.content = 'El contenido es obligatorio';
    }

    if (formData.content.length > 1000) {
      errors.content = 'El mensaje no puede exceder 1000 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  /**
   * Manejar cambios en el formulario
   */
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === 'postId' || name === 'threadId' || name === 'groupId'
        ? (value ? parseInt(value, 10) : null)
        : value
    }));

    // Limpiar errores del campo modificado
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [formErrors]);

  /**
   * Establecer contexto del mensaje
   */
  const setMessageContext = useCallback((postId = null, threadId = null, groupId = null) => {
    setFormData(prev => ({
      ...prev,
      postId,
      threadId,
      groupId
    }));
  }, []);

  /**
   * Resetear formulario
   */
  const resetForm = useCallback(() => {
    setFormData({
      content: '',
      postId: null,
      threadId: null,
      groupId: null
    });
    setFormErrors({});
    setSuccessMessage('');
  }, []);

  /**
   * Resetear solo contenido
   */
  const resetContent = useCallback(() => {
    setFormData(prev => ({ ...prev, content: '' }));
  }, []);

  /**
   * Crear mensaje
   */
  const handleCreateMessage = useCallback(async (e) => {
    if (e) e.preventDefault();

    setSuccessMessage('');
    if (!validateForm()) return null;

    try {
      const newMessage = await createMessage(formData);
      if (newMessage) {
        setSuccessMessage('Mensaje enviado correctamente');
        resetContent();
        return newMessage;
      }
      return null;
    } catch (error) {
      setFormErrors({ general: error.message || 'Error al crear el mensaje' });
      return null;
    }
  }, [formData, validateForm, createMessage, resetContent]);

  /**
   * Eliminar mensaje con verificación de permisos
   */
  const handleDeleteMessage = useCallback(async (messageId) => {
    try {
      const message = await fetchMessageById(messageId);
      if (!message) {
        setFormErrors({ general: 'No se pudo encontrar el mensaje' });
        return false;
      }

      // Verificar permisos
      const canDelete = message.userId === user?.id || isAdmin || isModerator;
      if (!canDelete) {
        setFormErrors({
          permission: 'Solo el autor, administradores o moderadores pueden eliminar mensajes'
        });
        return false;
      }

      if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
        const success = await deleteMessage(messageId);
        if (success) {
          setSuccessMessage('Mensaje eliminado correctamente');
          return true;
        }
        return false;
      }
      return false;
    } catch (error) {
      setFormErrors({ general: error.message || 'Error al eliminar el mensaje' });
      return false;
    }
  }, [fetchMessageById, deleteMessage, user, isAdmin, isModerator]);

  /**
   * Verificar si el usuario puede eliminar un mensaje
   */
  const canDeleteMessage = useCallback((message) => {
    if (!user || !message) return false;
    return message.userId === user.id || isAdmin || isModerator;
  }, [user, isAdmin, isModerator]);

  /**
   * Obtener mensajes filtrados por tipo
   */
  const getMessagesByType = useCallback((type, id) => {
    switch (type) {
      case 'post':
        return getContextMessages('post', id);
      case 'thread':
        return getContextMessages('thread', id);
      case 'group':
        return getContextMessages('group', id);
      case 'forum':
        return getContextMessages('forum');
      default:
        return [];
    }
  }, [getContextMessages]);

  /**
   * Verificar si un contexto está cargando
   */
  const isTypeLoading = useCallback((type, id) => {
    switch (type) {
      case 'post':
        return isContextLoading('post', id);
      case 'thread':
        return isContextLoading('thread', id);
      case 'group':
        return isContextLoading('group', id);
      case 'forum':
        return isContextLoading('forum');
      default:
        return false;
    }
  }, [isContextLoading]);

  /**
   * Cargar mensajes por tipo
   */
  const loadMessagesByType = useCallback(async (type, id, limit = 50, offset = 0) => {
    switch (type) {
      case 'post':
        return await fetchPostMessages(id, limit, offset);
      case 'thread':
        return await fetchThreadMessages(id, limit, offset);
      case 'group':
        return await fetchGroupMessages(id, limit, offset);
      case 'forum':
        return await fetchForumMessages(limit, offset);
      default:
        return [];
    }
  }, [fetchPostMessages, fetchThreadMessages, fetchGroupMessages, fetchForumMessages]);

  return {
    // Estados globales
    messages,
    loading,
    error,
    selectedMessage,
    messageLoading,

    // Estados del formulario
    formData,
    formErrors,
    successMessage,

    // Funciones de formulario
    handleFormChange,
    setMessageContext,
    resetForm,
    resetContent,
    validateForm,

    // Funciones CRUD
    handleCreateMessage,
    handleDeleteMessage,
    fetchMessageById,

    // Funciones de contexto
    getMessagesByType,
    isTypeLoading,
    loadMessagesByType,

    // Funciones de permisos
    canDeleteMessage,

    // Funciones de utilidad
    clearError,
    fetchAllMessages
  };
}; 