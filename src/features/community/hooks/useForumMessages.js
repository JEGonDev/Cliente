import { useState, useEffect, useCallback, useContext } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar mensajes del foro general
 * 
 * @returns {Object} Estados y funciones para manejar mensajes del foro
 */
export const useForumMessages = () => {
  // Estados
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);

  // Contexto de autenticación
  const { isAuthenticated } = useContext(AuthContext);

  /**
   * Obtener mensajes del foro general
   * En el futuro, cuando tengas el endpoint específico para mensajes del foro,
   * puedes ajustar esta función
   */
  const fetchForumMessages = useCallback(async () => {
    if (!isAuthenticated) {
      setMessages([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Por ahora usamos el endpoint general de mensajes
      // En el futuro podrías tener un endpoint específico como:
      // const response = await communityService.getForumMessages();
      const response = await communityService.getAllMessages();
      
      // Procesamos la respuesta según el formato del API
      let messagesData = [];
      if (Array.isArray(response)) {
        messagesData = response;
      } else if (response && Array.isArray(response.data)) {
        messagesData = response.data;
      }

      // Filtrar solo mensajes del foro general (sin postId, threadId o groupId)
      // Esto asume que los mensajes del foro general no tienen esas propiedades
      const forumMessages = messagesData.filter(message => 
        !message.postId && 
        !message.threadId && 
        !message.groupId &&
        !message.post_id &&
        !message.thread_id &&
        !message.group_id
      );

      // Ordenar por fecha de creación (más recientes primero)
      const sortedMessages = forumMessages.sort((a, b) => {
        const dateA = new Date(a.messageDate || a.creation_date || a.created_at || 0);
        const dateB = new Date(b.messageDate || b.creation_date || b.created_at || 0);
        return dateA - dateB; // Orden cronológico (más antiguos primero para un chat)
      });

      setMessages(sortedMessages);
    } catch (err) {
      console.error('Error al obtener mensajes del foro:', err);
      setError(err.message || 'Error al cargar los mensajes del foro');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Enviar un nuevo mensaje al foro general
   * 
   * @param {string} content - Contenido del mensaje
   * @returns {Promise<Object|null>} Mensaje creado o null si hay error
   */
  const sendForumMessage = useCallback(async (content) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para enviar mensajes');
      return null;
    }

    if (!content || !content.trim()) {
      setError('El mensaje no puede estar vacío');
      return null;
    }

    setSendingMessage(true);
    setError(null);

    try {
      // Datos del mensaje para el foro general
      // No incluimos postId, threadId ni groupId para que sea un mensaje del foro general
      const messageData = {
        content: content.trim(),
        // Aquí podrías agregar otros campos específicos del foro si los necesitas
        // forumMessage: true, // Por ejemplo, un flag para identificar mensajes del foro
      };

      const response = await communityService.createMessage(messageData);

      // Procesar respuesta
      let newMessage = null;
      if (response && response.data) {
        newMessage = response.data;
      } else if (response) {
        newMessage = response;
      }

      if (newMessage) {
        // Actualizar la lista local de mensajes (optimistic update)
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Opcionalmente, recargar todos los mensajes para estar sincronizado
        // setTimeout(() => fetchForumMessages(), 500);
        
        return newMessage;
      }

      return null;
    } catch (err) {
      console.error('Error al enviar mensaje al foro:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al enviar el mensaje';
      setError(errorMessage);
      return null;
    } finally {
      setSendingMessage(false);
    }
  }, [isAuthenticated]);

  /**
   * Eliminar un mensaje del foro
   * 
   * @param {number} messageId - ID del mensaje a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  const deleteForumMessage = useCallback(async (messageId) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para eliminar mensajes');
      return false;
    }

    try {
      await communityService.deleteMessage(messageId);

      // Actualizar la lista local eliminando el mensaje
      setMessages(prevMessages => 
        prevMessages.filter(message => 
          message.id !== messageId && message.message_id !== messageId
        )
      );

      return true;
    } catch (err) {
      console.error(`Error al eliminar mensaje ${messageId}:`, err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al eliminar el mensaje';
      setError(errorMessage);
      return false;
    }
  }, [isAuthenticated]);

  /**
   * Limpiar errores
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refrescar mensajes manualmente
   */
  const refreshMessages = useCallback(() => {
    fetchForumMessages();
  }, [fetchForumMessages]);

  // Cargar mensajes al montar el componente y cuando cambie el estado de autenticación
  useEffect(() => {
    fetchForumMessages();
  }, [fetchForumMessages]);

  return {
    // Estados
    messages,
    loading,
    error,
    sendingMessage,

    // Funciones
    sendForumMessage,
    deleteForumMessage,
    refreshMessages,
    clearError,

    // Función para recargar (alias)
    fetchForumMessages,
  };
};