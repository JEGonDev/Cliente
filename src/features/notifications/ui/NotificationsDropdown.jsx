import { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, Trash2, MessageSquare, Users, FileText, Heart, AlertCircle } from 'lucide-react';
import { useNotifications } from '../context/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export const NotificationsDropdown = () => {
  const {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAllNotifications,
    NOTIFICATION_CATEGORIES
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const dropdownRef = useRef(null);

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Iconos por categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case NOTIFICATION_CATEGORIES.GROUP:
        return <Users className="w-4 h-4" />;
      case NOTIFICATION_CATEGORIES.THREAD:
        return <MessageSquare className="w-4 h-4" />;
      case NOTIFICATION_CATEGORIES.POST:
        return <FileText className="w-4 h-4" />;
      case NOTIFICATION_CATEGORIES.REACTION:
        return <Heart className="w-4 h-4" />;
      case NOTIFICATION_CATEGORIES.SYSTEM:
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  // Colores por categoría
  const getCategoryColor = (category) => {
    switch (category) {
      case NOTIFICATION_CATEGORIES.GROUP:
        return 'text-blue-600 bg-blue-100';
      case NOTIFICATION_CATEGORIES.THREAD:
        return 'text-orange-600 bg-orange-100';
      case NOTIFICATION_CATEGORIES.POST:
        return 'text-green-600 bg-green-100';
      case NOTIFICATION_CATEGORIES.REACTION:
        return 'text-pink-600 bg-pink-100';
      case NOTIFICATION_CATEGORIES.SYSTEM:
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Filtrar notificaciones
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === filter);

  // Formatear fecha
  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true,
        locale: es 
      });
    } catch {
      return 'Hace un momento';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de campanita */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-green-700 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6" />
        
        {/* Badge con contador */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        
        {/* Indicador de conexión */}
        <span className={`absolute bottom-0 right-0 h-2 w-2 rounded-full ${
          isConnected ? 'bg-green-400' : 'bg-gray-400'
        }`} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Filtros */}
            <div className="flex gap-2 overflow-x-auto">
              <FilterButton 
                active={filter === 'all'} 
                onClick={() => setFilter('all')}
              >
                Todas
              </FilterButton>
              <FilterButton 
                active={filter === NOTIFICATION_CATEGORIES.GROUP} 
                onClick={() => setFilter(NOTIFICATION_CATEGORIES.GROUP)}
              >
                Grupos
              </FilterButton>
              <FilterButton 
                active={filter === NOTIFICATION_CATEGORIES.THREAD} 
                onClick={() => setFilter(NOTIFICATION_CATEGORIES.THREAD)}
              >
                Hilos
              </FilterButton>
              <FilterButton 
                active={filter === NOTIFICATION_CATEGORIES.POST} 
                onClick={() => setFilter(NOTIFICATION_CATEGORIES.POST)}
              >
                Posts
              </FilterButton>
              <FilterButton 
                active={filter === NOTIFICATION_CATEGORIES.REACTION} 
                onClick={() => setFilter(NOTIFICATION_CATEGORIES.REACTION)}
              >
                Reacciones
              </FilterButton>
            </div>
          </div>

          {/* Lista de notificaciones */}
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map(notification => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={() => markAsRead(notification.id)}
                    onRemove={() => removeNotification(notification.id)}
                    getCategoryIcon={getCategoryIcon}
                    getCategoryColor={getCategoryColor}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 flex justify-between">
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:text-green-700 font-medium"
                disabled={unreadCount === 0}
              >
                Marcar todas como leídas
              </button>
              <button
                onClick={clearAllNotifications}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente para los botones de filtro
const FilterButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
      active 
        ? 'bg-primary text-white' 
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

// Componente para cada notificación
const NotificationItem = ({ 
  notification, 
  onMarkAsRead, 
  onRemove, 
  getCategoryIcon, 
  getCategoryColor,
  formatTime 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`p-4 transition-colors cursor-pointer ${
        notification.read ? 'bg-white' : 'bg-blue-50'
      } hover:bg-gray-50`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => !notification.read && onMarkAsRead()}
    >
      <div className="flex items-start gap-3">
        {/* Icono de categoría */}
        <div className={`p-2 rounded-full ${getCategoryColor(notification.category)}`}>
          {getCategoryIcon(notification.category)}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
            {notification.message}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatTime(notification.timestamp)}
          </p>
        </div>

        {/* Acciones */}
        {isHovered && (
          <div className="flex items-center gap-1">
            {!notification.read && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAsRead();
                }}
                className="p-1 text-gray-400 hover:text-green-600 rounded"
                title="Marcar como leída"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="p-1 text-gray-400 hover:text-red-600 rounded"
              title="Eliminar"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};  