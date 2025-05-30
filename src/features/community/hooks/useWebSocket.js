import { useState, useEffect, useCallback, useRef, useContext } from 'react';
import { websocketService } from '../../../common/services/webSocketService';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook para manejar conexiones WebSocket de mensajería
 */
export const useWebSocket = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const subscriptionsRef = useRef(new Map());
  const maxReconnectAttempts = 5;

  /**
   * Conectar al WebSocket
   */
  const connect = useCallback(async () => {
    if (!isAuthenticated || connected) return;

    try {
      await websocketService.connect(
        (frame) => {
          console.log('🔌 WebSocket conectado para mensajería:', frame);
          setConnected(true);
          setError(null);
          setConnectionAttempts(0);
        },
        (error) => {
          console.error('❌ Error en WebSocket de mensajería:', error);
          setConnected(false);
          setError(error.message || 'Error de conexión');

          // Intentar reconectar
          if (connectionAttempts < maxReconnectAttempts) {
            setTimeout(() => {
              setConnectionAttempts(prev => prev + 1);
              connect();
            }, Math.pow(2, connectionAttempts) * 1000); // Backoff exponencial
          }
        }
      );
    } catch (err) {
      console.error('❌ Error al conectar WebSocket:', err);
      setError(err.message || 'Error al conectar');
    }
  }, [isAuthenticated, connected, connectionAttempts]);

  /**
   * Desconectar del WebSocket
   */
  const disconnect = useCallback(() => {
    // Cancelar todas las suscripciones
    subscriptionsRef.current.forEach((subscription, key) => {
      websocketService.unsubscribe(subscription);
    });
    subscriptionsRef.current.clear();

    // Desconectar
    websocketService.disconnect();
    setConnected(false);
  }, []);

  /**
   * Suscribirse a mensajes de un grupo
   */
  const subscribeToGroup = useCallback((groupId, onMessage) => {
    if (!connected) return null;

    const topic = `/topic/message/group/${groupId}`;
    const subscriptionId = websocketService.subscribe(topic, onMessage);

    if (subscriptionId) {
      subscriptionsRef.current.set(`group-${groupId}`, subscriptionId);
    }

    return subscriptionId;
  }, [connected]);

  /**
   * Suscribirse a mensajes de un hilo
   */
  const subscribeToThread = useCallback((threadId, onMessage) => {
    if (!connected) return null;

    const topic = `/topic/message/thread/${threadId}`;
    const subscriptionId = websocketService.subscribe(topic, onMessage);

    if (subscriptionId) {
      subscriptionsRef.current.set(`thread-${threadId}`, subscriptionId);
    }

    return subscriptionId;
  }, [connected]);

  /**
   * Suscribirse a mensajes de una publicación
   */
  const subscribeToPost = useCallback((postId, onMessage) => {
    if (!connected) return null;

    const topic = `/topic/message/post/${postId}`;
    const subscriptionId = websocketService.subscribe(topic, onMessage);

    if (subscriptionId) {
      subscriptionsRef.current.set(`post-${postId}`, subscriptionId);
    }

    return subscriptionId;
  }, [connected]);

  /**
   * Suscribirse a mensajes del foro general
   */
  const subscribeToForum = useCallback((onMessage) => {
    if (!connected) return null;

    const topic = '/topic/message/forum';
    const subscriptionId = websocketService.subscribe(topic, onMessage);

    if (subscriptionId) {
      subscriptionsRef.current.set('forum', subscriptionId);
    }

    return subscriptionId;
  }, [connected]);

  /**
   * Enviar mensaje a un grupo
   */
  const sendGroupMessage = useCallback((groupId, content) => {
    if (!connected || !content.trim()) return;

    const message = {
      content: content.trim(),
      groupId,
      userId: user?.id,
      username: user?.username,
      timestamp: new Date().toISOString(),
      messageType: 'group'
    };

    websocketService.send(`/app/message/group/${groupId}`, message);
  }, [connected, user]);

  /**
   * Enviar mensaje a un hilo
   */
  const sendThreadMessage = useCallback((threadId, content) => {
    if (!connected || !content.trim()) return;

    const message = {
      content: content.trim(),
      threadId,
      userId: user?.id,
      username: user?.username,
      timestamp: new Date().toISOString(),
      messageType: 'thread'
    };

    websocketService.send(`/app/message/thread/${threadId}`, message);
  }, [connected, user]);

  /**
   * Enviar mensaje a una publicación
   */
  const sendPostMessage = useCallback((postId, content) => {
    if (!connected || !content.trim()) return;

    const message = {
      content: content.trim(),
      postId,
      userId: user?.id,
      username: user?.username,
      timestamp: new Date().toISOString(),
      messageType: 'post'
    };

    websocketService.send(`/app/message/post/${postId}`, message);
  }, [connected, user]);

  /**
   * Enviar mensaje al foro general
   */
  const sendForumMessage = useCallback((content) => {
    if (!connected || !content.trim()) return;

    const message = {
      content: content.trim(),
      userId: user?.id,
      username: user?.username,
      timestamp: new Date().toISOString(),
      messageType: 'forum'
    };

    websocketService.send('/app/message/forum', message);
  }, [connected, user]);

  /**
   * Cancelar suscripción específica
   */
  const unsubscribeFrom = useCallback((key) => {
    const subscriptionId = subscriptionsRef.current.get(key);
    if (subscriptionId) {
      websocketService.unsubscribe(subscriptionId);
      subscriptionsRef.current.delete(key);
    }
  }, []);

  // Efectos
  useEffect(() => {
    if (isAuthenticated) {
      connect();
    } else {
      disconnect();
    }

    return () => disconnect();
  }, [isAuthenticated, connect, disconnect]);

  return {
    // Estados
    connected,
    error,
    connectionAttempts,

    // Funciones de conexión
    connect,
    disconnect,

    // Funciones de suscripción
    subscribeToGroup,
    subscribeToThread,
    subscribeToPost,
    subscribeToForum,
    unsubscribeFrom,

    // Funciones de envío
    sendGroupMessage,
    sendThreadMessage,
    sendPostMessage,
    sendForumMessage,

    // Utilidades
    isConnected: () => connected && websocketService.isConnected()
  };
}; 