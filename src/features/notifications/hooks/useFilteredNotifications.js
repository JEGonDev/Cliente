import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext';
import { useAuth } from '../../authentication/hooks/useAuth';

/**
 * Hook personalizado que proporciona notificaciones filtradas y funcionalidades avanzadas
 * para el sistema de notificaciones personalizado por usuario
 */
export const useFilteredNotifications = () => {
  const { 
    notifications, 
    unreadCount, 
    getNotificationsByCategory, 
    NOTIFICATION_CATEGORIES,
    GLOBAL_CATEGORIES,
    shouldShowNotification
  } = useNotifications();
  
  const { user, isAdmin, isModerator } = useAuth();
  const { pathname } = useLocation();

  // Estadísticas de notificaciones
  const notificationStats = useMemo(() => {
    const stats = {
      total: notifications.length,
      unread: unreadCount,
      personal: 0,
      global: 0,
      byCategory: {},
      bySectionCount: {
        community: 0,
        education: 0,
        monitoring: 0
      }
    };

    notifications.forEach(notification => {
      const isGlobal = GLOBAL_CATEGORIES.includes(notification.category);
      
      if (isGlobal) {
        stats.global++;
      } else {
        stats.personal++;
      }

      // Contar por categoría
      if (!stats.byCategory[notification.category]) {
        stats.byCategory[notification.category] = 0;
      }
      stats.byCategory[notification.category]++;

      // Contar por sección
      if (['group', 'thread', 'post', 'reaction'].includes(notification.category)) {
        stats.bySectionCount.community++;
      } else if (['education_article', 'education_guide', 'education_module', 'education_video'].includes(notification.category)) {
        stats.bySectionCount.education++;
      } else if (['crop', 'sensor_alert', 'sensor'].includes(notification.category)) {
        stats.bySectionCount.monitoring++;
      }
    });

    return stats;
  }, [notifications, unreadCount, GLOBAL_CATEGORIES]);

  // Determina la sección actual basándose en la ruta
  const currentSection = useMemo(() => {
    if (pathname.includes('/comunity')) {
      if (pathname.includes('/groups')) return 'groups';
      if (pathname.includes('/posts'))  return 'posts';
      if (pathname.includes('/thread')) return 'threads';
      return 'community';
    }
    if (pathname.includes('/education')) return 'education';
    if (pathname.includes('/monitoring')) return 'monitoring';
    return 'home';
  }, [pathname]);

  // Notificaciones filtradas según la sección actual
  const sectionNotifications = useMemo(() => {
    const {
      GROUP, THREAD, POST, REACTION,
      ARTICLE, GUIDE, MODULE, VIDEO,
      CROP, SENSOR_ALERT, SENSOR
    } = NOTIFICATION_CATEGORIES;

    switch (currentSection) {
      case 'groups':
        return getNotificationsByCategory(GROUP);

      case 'threads':
        return getNotificationsByCategory(THREAD);

      case 'posts':
        return notifications.filter(n =>
          [POST, REACTION].includes(n.category)
        );

      case 'community':
        return notifications.filter(n =>
          [GROUP, THREAD, POST, REACTION].includes(n.category)
        );

      case 'education':
        return notifications.filter(n =>
          [ARTICLE, GUIDE, MODULE, VIDEO].includes(n.category)
        );

      case 'monitoring':
        return notifications.filter(n =>
          [CROP, SENSOR_ALERT, SENSOR].includes(n.category)
        );

      default:
        return notifications;
    }
  }, [currentSection, notifications, getNotificationsByCategory, NOTIFICATION_CATEGORIES]);

  // Notificaciones personales (solo dirigidas al usuario actual)
  const personalNotifications = useMemo(() => {
    return notifications.filter(n => !GLOBAL_CATEGORIES.includes(n.category));
  }, [notifications, GLOBAL_CATEGORIES]);

  // Notificaciones globales (educación)
  const globalNotifications = useMemo(() => {
    return notifications.filter(n => GLOBAL_CATEGORIES.includes(n.category));
  }, [notifications, GLOBAL_CATEGORIES]);

  // Notificaciones no leídas por sección
  const unreadSectionCount = useMemo(
    () => sectionNotifications.filter(n => !n.read).length,
    [sectionNotifications]
  );

  // Notificaciones recientes (últimas 24 horas)
  const recentNotifications = useMemo(() => {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return notifications.filter(n => {
      const notificationDate = new Date(n.timestamp);
      return notificationDate > oneDayAgo;
    });
  }, [notifications]);

  // Notificaciones importantes (alertas de sensores, acciones de admin, etc.)
  const importantNotifications = useMemo(() => {
    const importantCategories = [
      NOTIFICATION_CATEGORIES.SENSOR_ALERT,
      // Agregar otras categorías importantes según sea necesario
    ];

    return notifications.filter(n => 
      importantCategories.includes(n.category) ||
      (n.message && n.message.toLowerCase().includes('elimina')) ||
      (n.message && n.message.toLowerCase().includes('admin'))
    );
  }, [notifications, NOTIFICATION_CATEGORIES]);

  // Función para verificar si hay notificaciones nuevas de cierto tipo
  const hasNewNotificationsOfType = (type) => {
    const typeNotifications = type === 'personal' ? personalNotifications : 
                             type === 'global' ? globalNotifications :
                             type === 'important' ? importantNotifications :
                             sectionNotifications;
    
    return typeNotifications.some(n => !n.read);
  };

  // Función para obtener el resumen de notificaciones para mostrar en badges
  const getNotificationSummary = () => {
    return {
      total: notificationStats.total,
      unread: notificationStats.unread,
      personal: personalNotifications.length,
      global: globalNotifications.length,
      important: importantNotifications.length,
      recent: recentNotifications.length,
      section: {
        name: currentSection,
        count: sectionNotifications.length,
        unread: unreadSectionCount
      }
    };
  };

  // Función para obtener notificaciones con contexto adicional
  const getNotificationsWithContext = () => {
    return notifications.map(notification => ({
      ...notification,
      isGlobal: GLOBAL_CATEGORIES.includes(notification.category),
      isPersonal: !GLOBAL_CATEGORIES.includes(notification.category),
      isRecent: recentNotifications.includes(notification),
      isImportant: importantNotifications.includes(notification),
      belongsToCurrentSection: sectionNotifications.includes(notification),
      targetUserId: notification.userId,
      currentUserId: user?.id,
      isCorrectlyTargeted: shouldShowNotification ? shouldShowNotification(notification) : true
    }));
  };

  // Función de debug para administradores
  const getDebugInfo = () => {
    if (!isAdmin) return null;

    return {
      user: {
        id: user?.id,
        username: user?.username || user?.email,
        isAdmin,
        isModerator
      },
      filtering: {
        totalReceived: notifications.length,
        personalCount: personalNotifications.length,
        globalCount: globalNotifications.length,
        filteredCorrectly: notifications.every(n => shouldShowNotification ? shouldShowNotification(n) : true)
      },
      categories: {
        global: GLOBAL_CATEGORIES,
        all: Object.values(NOTIFICATION_CATEGORIES)
      },
      stats: notificationStats,
      section: {
        current: currentSection,
        relevantNotifications: sectionNotifications.length
      }
    };
  };

  return {
    // Notificaciones base
    notifications,
    unreadCount,
    
    // Notificaciones filtradas
    personalNotifications,
    globalNotifications,
    sectionNotifications,
    recentNotifications,
    importantNotifications,
    
    // Información contextual
    currentSection,
    unreadSectionCount,
    notificationStats,
    
    // Funciones utilitarias
    hasNewNotificationsOfType,
    getNotificationSummary,
    getNotificationsWithContext,
    getDebugInfo,
    
    // Estados derivados
    hasNewSectionNotifications: unreadSectionCount > 0,
    hasNewPersonalNotifications: hasNewNotificationsOfType('personal'),
    hasNewGlobalNotifications: hasNewNotificationsOfType('global'),
    hasNewImportantNotifications: hasNewNotificationsOfType('important'),
    
    // Constantes
    NOTIFICATION_CATEGORIES,
    GLOBAL_CATEGORIES
  };
};