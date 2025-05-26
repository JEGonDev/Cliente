import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../authentication/context/AuthContext';
import { websocketService } from '../../../common/services/webSocketService';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  
  // Estados
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Categorías de notificaciones
  const NOTIFICATION_CATEGORIES = {
    GROUP: 'group',
    THREAD: 'thread',
    POST: 'post',
    REACTION: 'reaction',
    SYSTEM: 'system'
  };

  /**
   * Agrega una nueva notificación
   */
  const addNotification = useCallback((notification) => {
    const newNotification = {
      ...notification,
      id: notification.id || Date.now(),
      timestamp: notification.timestamp || new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Reproducir sonido de notificación (opcional)
    playNotificationSound();

    // Mostrar notificación del navegador si está permitido
    showBrowserNotification(newNotification);
  }, []);

  /**
   * Marca una notificación como leída
   */
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  /**
   * Marca todas las notificaciones como leídas
   */
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  }, []);

  /**
   * Elimina una notificación
   */
  const removeNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  /**
   * Limpia todas las notificaciones
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  /**
   * Filtra notificaciones por categoría
   */
  const getNotificationsByCategory = useCallback((category) => {
    if (!category || category === 'all') return notifications;
    return notifications.filter(notif => notif.category === category);
  }, [notifications]);

  /**
   * Conecta al WebSocket y suscribe a notificaciones
   */
  const connectWebSocket = useCallback(async () => {
    try {
      setConnectionError(null);
      
      await websocketService.connect(
        () => {
          console.log('✅ Conectado al sistema de notificaciones');
          setIsConnected(true);
          
          // Suscribirse al topic de notificaciones
          const subId = websocketService.subscribe('/topic/notifications', (notification) => {
            console.log('📬 Nueva notificación recibida:', notification);
            addNotification(notification);
          });
          
          setSubscriptionId(subId);
        },
        (error) => {
          console.error('❌ Error de conexión:', error);
          setIsConnected(false);
          setConnectionError(error.message || 'Error al conectar con el servidor de notificaciones');
        }
      );
    } catch (error) {
      console.error('❌ Error al conectar WebSocket:', error);
      setConnectionError(error.message || 'Error al conectar con el servidor de notificaciones');
    }
  }, [addNotification]);

  /**
   * Desconecta del WebSocket
   */
  const disconnectWebSocket = useCallback(() => {
    if (subscriptionId) {
      websocketService.unsubscribe(subscriptionId);
      setSubscriptionId(null);
    }
    
    websocketService.disconnect();
    setIsConnected(false);
  }, [subscriptionId]);

  /**
   * Reproduce sonido de notificación
   */
  const playNotificationSound = () => {
    try {
      // Puedes agregar un archivo de sonido en public/sounds/notification.mp3
      const audio = new Audio('/sounds/notification.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('No se pudo reproducir el sonido:', e));
    } catch (error) {
      // Silenciar error si no hay sonido
    }
  };

  /**
   * Muestra notificación del navegador
   */
  const showBrowserNotification = (notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification('Germogli', {
          body: notification.message,
          icon: '/logo.png', // Asegúrate de tener un logo en public
          tag: notification.id
        });
      } catch (error) {
        console.log('No se pudo mostrar notificación del navegador:', error);
      }
    }
  };

  /**
   * Solicita permisos para notificaciones del navegador
   */
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Efecto para conectar/desconectar según autenticación
  useEffect(() => {
    if (isAuthenticated) {
      connectWebSocket();
      requestNotificationPermission();
    } else {
      disconnectWebSocket();
    }

    // Cleanup
    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated]); // Solo dependemos de isAuthenticated

  // Valor del contexto
  const value = {
    // Estado
    notifications,
    unreadCount,
    isConnected,
    connectionError,
    
    // Acciones
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    
    // Utilidades
    getNotificationsByCategory,
    requestNotificationPermission,
    
    // Constantes
    NOTIFICATION_CATEGORIES
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationsProvider');
  }
  return context;
};