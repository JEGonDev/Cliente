import { Bell, AlertCircle, Users, BookOpen, Activity } from 'lucide-react';
import { useFilteredNotifications } from '../hooks/useFilteredNotifications';

/**
 * Componente indicador de notificaciones inteligente que muestra información
 * contextual según la sección actual y el tipo de notificaciones
 */
export const NotificationIndicator = ({ 
  section = 'general', 
  size = 'md',
  showCount = true,
  showIcon = true,
  className = ''
}) => {
  const {
    unreadCount,
    unreadSectionCount,
    notificationStats,
    currentSection,
    hasNewSectionNotifications,
    hasNewPersonalNotifications,
    hasNewGlobalNotifications,
    hasNewImportantNotifications
  } = useFilteredNotifications();

  // Configuración de tamaños
  const sizeConfig = {
    sm: {
      bell: 'w-4 h-4',
      badge: 'h-4 w-4 text-xs',
      icon: 'w-3 h-3'
    },
    md: {
      bell: 'w-5 h-5',
      badge: 'h-5 w-5 text-xs',
      icon: 'w-4 h-4'
    },
    lg: {
      bell: 'w-6 h-6',
      badge: 'h-6 w-6 text-sm',
      icon: 'w-5 h-5'
    }
  };

  const config = sizeConfig[size] || sizeConfig.md;

  // Determinar qué mostrar según la sección
  const getIndicatorData = () => {
    switch (section) {
      case 'community':
        return {
          count: notificationStats.bySectionCount.community,
          hasNew: notificationStats.bySectionCount.community > 0,
          icon: <Users className={config.icon} />,
          color: 'bg-blue-500',
          title: 'Notificaciones de Comunidad'
        };
      
      case 'education':
        return {
          count: notificationStats.bySectionCount.education,
          hasNew: notificationStats.bySectionCount.education > 0,
          icon: <BookOpen className={config.icon} />,
          color: 'bg-purple-500',
          title: 'Notificaciones de Educación'
        };
      
      case 'monitoring':
        return {
          count: notificationStats.bySectionCount.monitoring,
          hasNew: notificationStats.bySectionCount.monitoring > 0,
          icon: <Activity className={config.icon} />,
          color: 'bg-green-500',
          title: 'Notificaciones de Monitoreo'
        };
      
      case 'important':
        return {
          count: unreadCount, // Solo no leídas para importantes
          hasNew: hasNewImportantNotifications,
          icon: <AlertCircle className={config.icon} />,
          color: 'bg-red-500',
          title: 'Notificaciones Importantes'
        };
      
      case 'personal':
        return {
          count: notificationStats.personal,
          hasNew: hasNewPersonalNotifications,
          icon: <Bell className={config.icon} />,
          color: 'bg-green-500',
          title: 'Notificaciones Personales'
        };
      
      case 'global':
        return {
          count: notificationStats.global,
          hasNew: hasNewGlobalNotifications,
          icon: <Bell className={config.icon} />,
          color: 'bg-blue-500',
          title: 'Notificaciones Globales'
        };
      
      case 'current-section':
        return {
          count: unreadSectionCount,
          hasNew: hasNewSectionNotifications,
          icon: getSectionIcon(currentSection),
          color: getSectionColor(currentSection),
          title: `Notificaciones de ${getSectionName(currentSection)}`
        };
      
      default: // 'general'
        return {
          count: unreadCount,
          hasNew: unreadCount > 0,
          icon: <Bell className={config.icon} />,
          color: 'bg-primary',
          title: 'Todas las Notificaciones'
        };
    }
  };

  // Iconos por sección
  const getSectionIcon = (sectionName) => {
    switch (sectionName) {
      case 'community':
      case 'groups':
      case 'posts':
      case 'threads':
        return <Users className={config.icon} />;
      case 'education':
        return <BookOpen className={config.icon} />;
      case 'monitoring':
        return <Activity className={config.icon} />;
      default:
        return <Bell className={config.icon} />;
    }
  };

  // Colores por sección
  const getSectionColor = (sectionName) => {
    switch (sectionName) {
      case 'community':
      case 'groups':
      case 'posts':
      case 'threads':
        return 'bg-blue-500';
      case 'education':
        return 'bg-purple-500';
      case 'monitoring':
        return 'bg-green-500';
      default:
        return 'bg-primary';
    }
  };

  // Nombres de sección
  const getSectionName = (sectionName) => {
    switch (sectionName) {
      case 'community':
        return 'Comunidad';
      case 'education':
        return 'Educación';
      case 'monitoring':
        return 'Monitoreo';
      case 'groups':
        return 'Grupos';
      case 'posts':
        return 'Publicaciones';
      case 'threads':
        return 'Hilos';
      default:
        return 'General';
    }
  };

  const indicatorData = getIndicatorData();

  // Si no hay notificaciones y no queremos mostrar el indicador vacío
  if (!indicatorData.hasNew && !showCount) {
    return null;
  }

  return (
    <div className={`relative inline-flex items-center ${className}`} title={indicatorData.title}>
      {/* Icono principal */}
      {showIcon && (
        <div className="relative">
          {indicatorData.icon || <Bell className={config.bell} />}
          
          {/* Indicador de estado (punto) */}
          {indicatorData.hasNew && (
            <span 
              className={`absolute -top-1 -right-1 ${indicatorData.color} rounded-full w-2 h-2`}
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Badge con contador */}
      {showCount && indicatorData.count > 0 && (
        <span 
          className={`
            ${showIcon ? 'ml-1' : ''} 
            ${config.badge} 
            ${indicatorData.color} 
            text-white rounded-full flex items-center justify-center font-medium
          `}
        >
          {indicatorData.count > 99 ? '99+' : indicatorData.count}
        </span>
      )}
    </div>
  );
};

/**
 * Componente de badge simple para mostrar solo el número
 */
export const NotificationBadge = ({ 
  section = 'general', 
  size = 'sm',
  className = ''
}) => {
  return (
    <NotificationIndicator
      section={section}
      size={size}
      showIcon={false}
      showCount={true}
      className={className}
    />
  );
};

/**
 * Componente de indicador de estado simple (solo punto)
 */
export const NotificationDot = ({ 
  section = 'general',
  className = ''
}) => {
  const {
    unreadCount,
    unreadSectionCount,
    notificationStats,
    hasNewSectionNotifications,
    hasNewPersonalNotifications,
    hasNewGlobalNotifications,
    hasNewImportantNotifications
  } = useFilteredNotifications();

  const hasNew = () => {
    switch (section) {
      case 'community':
        return notificationStats.bySectionCount.community > 0;
      case 'education':
        return notificationStats.bySectionCount.education > 0;
      case 'monitoring':
        return notificationStats.bySectionCount.monitoring > 0;
      case 'current-section':
        return hasNewSectionNotifications;
      case 'personal':
        return hasNewPersonalNotifications;
      case 'global':
        return hasNewGlobalNotifications;
      case 'important':
        return hasNewImportantNotifications;
      default:
        return unreadCount > 0;
    }
  };

  if (!hasNew()) return null;

  return (
    <span 
      className={`w-2 h-2 bg-red-500 rounded-full ${className}`}
      aria-hidden="true"
    />
  );
};

/**
 * Componente compuesto para navegación que incluye icono + badge
 */
export const NavigationNotificationIndicator = ({ 
  section, 
  children,
  className = ''
}) => {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className="absolute -top-1 -right-1">
        <NotificationDot section={section} />
      </div>
    </div>
  );
};