import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useNotifications } from '../context/NotificationsContext';

/**
 * Hook personalizado que filtra las notificaciones según la sección actual
 */
export const useSectionNotifications = () => {
  const { notifications, getNotificationsByCategory, NOTIFICATION_CATEGORIES } = useNotifications();
  const { pathname } = useLocation();

  // Determina la sección basándose en la ruta
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

  // Filtrado según sección y categorías actuales
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
        // posts + reacciones
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
  }, [currentSection, notifications, getNotificationsByCategory]);

  const unreadSectionCount = useMemo(
    () => sectionNotifications.filter(n => !n.read).length,
    [sectionNotifications]
  );

  return {
    currentSection,
    sectionNotifications,
    unreadSectionCount,
    hasNewSectionNotifications: unreadSectionCount > 0
  };
};
