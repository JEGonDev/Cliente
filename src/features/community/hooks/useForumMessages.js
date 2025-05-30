import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';
import { websocketService } from '../../../common/services/webSocketService';

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
  const wsSubscriptionIdRef = useRef(null);
  const initialLoadDoneRef = useRef(false);

  // Contexto de autenticación
  const { isAuthenticated } = useContext(AuthContext);

  // Conectar al WebSocket y suscribirse al topic de mensajes
  const connectWebSocket = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      // Conectar al WebSocket si no está conectado
      if (!websocketService.isConnected()) {
        await websocketService.connect(
          () => console.log('✅ WebSocket conectado en useForumMessages'),
          (error) => console.error('❌ Error WebSocket en useForumMessages:', error)
        );
      }

      // Evitar suscripciones duplicadas
      if (wsSubscriptionIdRef.current) {
        websocketService.unsubscribe(wsSubscriptionIdRef.current);
      }

      // Suscribirse al topic de mensajes del foro
      const subscriptionId = websocketService.subscribe(
        '/topic/message/forum',
        (message) => {
          console.log('📨 Mensaje recibido por WebSocket:', message);
          // Agregar el nuevo mensaje a la lista
          setMessages(prevMessages => {
            // Evitar duplicados
            const exists = prevMessages.some(m =>
              m.id === message.id || m.message_id === message.id
            );
            if (!exists) {
              return [...prevMessages, message];
            }
            return prevMessages;
          });
        }
      );

      wsSubscriptionIdRef.current = subscriptionId;
    } catch (error) {
      console.error('Error al conectar WebSocket:', error);
      setError('Error al conectar al chat en tiempo real');
    }
  }, [isAuthenticated]);

  /**
   * Obtener mensajes del foro general
   */
  const fetchForumMessages = useCallback(async () => {
    if (!isAuthenticated || initialLoadDoneRef.current) return;

    setLoading(true);
    setError(null);

    try {
      const response = await communityService.getAllMessages();

      // Procesamos la respuesta según el formato del API
      let messagesData = [];
      if (Array.isArray(response)) {
        messagesData = response;
      } else if (response && Array.isArray(response.data)) {
        messagesData = response.data;
      }

      // Filtrar solo mensajes del foro general
      const forumMessages = messagesData.filter(message =>
        !message.postId &&
        !message.threadId &&
        !message.groupId &&
        !message.post_id &&
        !message.thread_id &&
        !message.group_id
      );

      // Ordenar por fecha
      const sortedMessages = forumMessages.sort((a, b) => {
        const dateA = new Date(a.messageDate || a.creation_date || a.created_at || 0);
        const dateB = new Date(b.messageDate || b.creation_date || b.created_at || 0);
        return dateA - dateB;
      });

      setMessages(sortedMessages);
      initialLoadDoneRef.current = true;
    } catch (err) {
      console.error('Error al obtener mensajes del foro:', err);
      // No establecer error si es 404 (no hay mensajes)
      if (err?.response?.status !== 404) {
        setError(err.message || 'Error al cargar los mensajes del foro');
      }
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Enviar un nuevo mensaje al foro general
   */
  const sendForumMessage = useCallback(async (content) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para enviar mensajes');
      return null;
    }

    if (!content?.trim()) {
      setError('El mensaje no puede estar vacío');
      return null;
    }

    setSendingMessage(true);
    setError(null);

    try {
      // Enviar mensaje a través de WebSocket
      websocketService.send('/app/message/forum', {
        content: content.trim(),
        messageType: 'CHAT'
      });

      return true;
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
   */
  const deleteForumMessage = useCallback(async (messageId) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para eliminar mensajes');
      return false;
    }

    try {
      // Enviar comando de eliminación por WebSocket
      websocketService.send('/app/message/forum/delete', {
        messageId: messageId
      });

      // Actualizar UI optimistamente
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

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshMessages = useCallback(() => {
    initialLoadDoneRef.current = false;
    fetchForumMessages();
  }, [fetchForumMessages]);

  // Efecto para la conexión inicial
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
      fetchForumMessages();
    }

    return () => {
      if (wsSubscriptionIdRef.current) {
        websocketService.unsubscribe(wsSubscriptionIdRef.current);
        wsSubscriptionIdRef.current = null;
      }
    };
  }, [isAuthenticated, connectWebSocket, fetchForumMessages]);

  return {
    messages,
    loading,
    error,
    sendingMessage,
    sendForumMessage,
    deleteForumMessage,
    refreshMessages,
    clearError,
    fetchForumMessages,
  };
};