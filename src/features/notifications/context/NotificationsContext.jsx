import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthContext } from '../../authentication/context/AuthContext';
import { websocketService } from '../../../common/services/webSocketService';

export const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const { isAuthenticated, user } = useContext(AuthContext);
  
  // Estados
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [subscriptionId, setSubscriptionId] = useState(null);

  // Categorías de notificaciones (basadas en las categorías reales del backend)
  const NOTIFICATION_CATEGORIES = {
    // Comunidad (PERSONALIZADAS - solo para usuarios específicos)
    GROUP: 'group',
    THREAD: 'thread',
    POST: 'post',
    REACTION: 'reaction',
    
    // Educación (GLOBALES - para todos los usuarios)
    ARTICLE: 'education_article',
    GUIDE: 'education_guide',
    MODULE: 'education_module',
    VIDEO: 'education_video',
    
    // Monitoreo/Cultivos (PERSONALIZADAS - solo para el propietario del cultivo)
    CROP: 'crop',
    SENSOR_ALERT: 'sensor_alert',
    SENSOR: 'sensor',
  };

  // Categorías que son globales (todos los usuarios las reciben)
  const GLOBAL_CATEGORIES = [
    NOTIFICATION_CATEGORIES.ARTICLE,
    NOTIFICATION_CATEGORIES.GUIDE,
    NOTIFICATION_CATEGORIES.MODULE,
    NOTIFICATION_CATEGORIES.VIDEO,
  ];

  /**
   * Determina si una notificación debe ser mostrada al usuario actual
   * @param {Object} notification - La notificación a evaluar
   * @returns {boolean} - true si debe mostrarse, false si debe filtrarse
   */
  const shouldShowNotification = useCallback((notification) => {
    // Si no hay usuario autenticado, no mostrar notificaciones
    if (!user || !user.id) {
      console.log('No hay usuario autenticado, filtrando notificación');
      return false;
    }

    // Extraer información de la notificación
    const notificationUserId = notification.userId || notification.targetUserId;
    const notificationCategory = notification.category;
    const currentUserId = user.id;

    console.log('Evaluando notificación:', {
      notificationId: notification.id,
      notificationUserId,
      notificationCategory,
      currentUserId,
      isGlobalCategory: GLOBAL_CATEGORIES.includes(notificationCategory)
    });

    // 1. Notificaciones de EDUCACIÓN son globales (todos las reciben)
    if (GLOBAL_CATEGORIES.includes(notificationCategory)) {
      console.log('✅ Notificación de educación (global) - mostrar a todos');
      return true;
    }

    // 2. Notificaciones PERSONALIZADAS (comunidad, monitoreo)
    // Solo mostrar si están dirigidas específicamente al usuario actual
    if (notificationUserId && notificationUserId === currentUserId) {
      console.log('✅ Notificación personalizada dirigida al usuario actual');
      return true;
    }

    // 3. Notificaciones sin userId específico pero de categorías personalizadas
    // Estas probablemente no deberían mostrarse ya que falta información de targeting
    if (!notificationUserId && !GLOBAL_CATEGORIES.includes(notificationCategory)) {
      console.log('⚠️ Notificación personalizada sin userId - filtrar por seguridad');
      return false;
    }

    // 4. Por defecto, filtrar notificaciones que no cumplen los criterios
    console.log('❌ Notificación filtrada - no cumple criterios');
    return false;
  }, [user, GLOBAL_CATEGORIES]);

  /**
   * Agrega una nueva notificación (con filtrado personalizado)
   */
  const addNotification = useCallback((notification) => {
    console.log('Nueva notificación recibida:', notification);

    // Filtrar la notificación antes de agregarla
    if (!shouldShowNotification(notification)) {
      console.log('Notificación filtrada, no se agregará a la lista');
      return;
    }

    const newNotification = {
      id: notification.id || `notif_${Date.now()}_${Math.random()}`,
      userId: notification.userId || notification.targetUserId,
      message: notification.message,
      category: notification.category,
      timestamp: notification.notificationDate || notification.timestamp || new Date().toISOString(),
      read: notification.isRead || false,
      // Datos adicionales si vienen del backend
      data: notification.data || {}
    };

    console.log('✅ Agregando notificación filtrada:', newNotification);

    setNotifications(prev => {
      // Evitar duplicados
      const exists = prev.some(n => n.id === newNotification.id);
      if (exists) {
        console.log('Notificación duplicada, ignorando');
        return prev;
      }
      return [newNotification, ...prev];
    });

    // Solo incrementar contador si no está leída
    if (!newNotification.read) {
      setUnreadCount(prev => prev + 1);
    }

    // Mostrar notificación del navegador si está permitido y no está leída
    if (!newNotification.read) {
      showBrowserNotification(newNotification);
    }
  }, [shouldShowNotification]);

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
   * Limpia notificaciones antiguas del usuario (al cambiar de usuario)
   */
  const clearUserNotifications = useCallback(() => {
    console.log('Limpiando notificaciones del usuario anterior');
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
          // NOTA: En un escenario ideal, el backend tendría topics específicos por usuario
          // como `/topic/notifications/${userId}`, pero trabajamos con lo que tenemos
          const subId = websocketService.subscribe('/topic/notifications', (notification) => {
            console.log('📬 Nueva notificación recibida desde WebSocket:', notification);
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

  // Efecto para manejar cambios de usuario
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('Usuario autenticado, iniciando sistema de notificaciones para:', user.username || user.email);
      connectWebSocket();
      requestNotificationPermission();
    } else {
      console.log('Usuario no autenticado, desconectando notificaciones');
      disconnectWebSocket();
      clearUserNotifications();
    }

    // Cleanup
    return () => {
      disconnectWebSocket();
    };
  }, [isAuthenticated, user?.id]); // Dependemos del ID del usuario para detectar cambios

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
    clearUserNotifications,
    
    // Utilidades
    getNotificationsByCategory,
    requestNotificationPermission,
    shouldShowNotification, // Exponer para debugging
    
    // Constantes
    NOTIFICATION_CATEGORIES,
    GLOBAL_CATEGORIES
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