import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { 
  BarChart2, 
  Bell, 
  Thermometer, 
  Clock 
} from 'lucide-react';

/**
 * Barra lateral de navegación para el módulo de monitoreo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.activeSection - Sección activa en la barra lateral
 */
export const MonitoringSidebar = ({ activeSection = 'monitoreo' }) => {
<<<<<<< HEAD
  // Definición de las secciones de navegación
  const navItems = [
    {
      id: 'historial',
      label: 'Historial de datos',
      icon: <BarChart2 size={18} />,
      path: '/monitoring/history'
    },
       {
      id: 'cultivos',
      label: 'Cultivos',
      icon: <Clock size={18} />,
      path: '/monitoring/crops'
=======
  const [notifications, setNotifications] = useState({});

  const {
    crops,
    alerts,
    sensors,
    selectedCrop,
    loading,
    fetchUserCrops,
    fetchUserAlerts
  } = useMonitoring();

  // Cargar datos iniciales para mostrar notificaciones
  useEffect(() => {
    fetchUserCrops();
    fetchUserAlerts();
  }, [fetchUserCrops, fetchUserAlerts]);

  // Calcular notificaciones y badges
  useEffect(() => {
    const newNotifications = {
      cultivos: {
        count: crops.length,
        hasAlert: crops.some(crop => crop.status === 'ALERT' || crop.status === 'alert'),
        badge: crops.filter(crop => crop.status === 'ACTIVE' || crop.status === 'active').length,
      },
      alertas: {
        count: alerts.length,
        hasAlert: alerts.some(alert => alert.type === 'error'),
        badge: alerts.filter(alert => alert.status === 'ACTIVE' || !alert.resolved).length,
      },
      historial: {
        count: sensors.length,
        hasAlert: false,
        badge: sensors.filter(sensor => sensor.status === 'ACTIVE').length,
      }
    };

    setNotifications(newNotifications);
  }, [crops, alerts, sensors]);

  // Definición de las secciones de navegación con datos dinámicos
  const navItems = [
    {
      id: 'cultivos',
      label: 'Cultivos',
      icon: <Clock size={18} />,
      path: '/monitoring/crops',
      badge: notifications.cultivos?.badge,
      hasAlert: notifications.cultivos?.hasAlert,
      description: `${notifications.cultivos?.count || 0} cultivos registrados`,
    },
    {
      id: 'historial',
      label: 'Historial de datos',
      icon: <BarChart2 size={18} />,
      path: '/monitoring/history',
      badge: notifications.historial?.badge,
      hasAlert: notifications.historial?.hasAlert,
      description: `${notifications.historial?.count || 0} sensores activos`,
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    },
    {
      id: 'alertas',
      label: 'Alertas',
      icon: <Bell size={18} />,
<<<<<<< HEAD
      path: '/monitoring/alerts'
    },
 
   
  ];

=======
      path: '/monitoring/alerts',
      badge: notifications.alertas?.badge,
      hasAlert: notifications.alertas?.hasAlert,
      description: `${notifications.alertas?.count || 0} alertas totales`,
    },
  ];

  // Obtener clases CSS para el elemento de navegación
  const getNavItemClasses = (item) => {
    const baseClasses = "flex items-center px-4 py-3 text-sm transition-colors duration-200 group";

    if (activeSection === item.id) {
      return `${baseClasses} bg-green-50 text-green-900 font-medium border-l-4 border-green-700`;
    }

    if (item.hasAlert) {
      return `${baseClasses} text-red-700 hover:bg-red-50`;
    }

    return `${baseClasses} text-gray-700 hover:bg-gray-100`;
  };

  // Renderizar badge o indicador de alerta
  const renderBadge = (item) => {
    if (!item.badge && !item.hasAlert) return null;

    if (item.hasAlert) {
      return (
        <span
          className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse"
          title="Requiere atención"
        />
      );
    }

    if (item.badge > 0) {
      return (
        <span
          className={`ml-auto px-2 py-1 text-xs rounded-full ${
            activeSection === item.id
              ? 'bg-green-200 text-green-800'
              : 'bg-gray-200 text-gray-700'
          }`}
          title={item.description}
        >
          {item.badge > 99 ? '99+' : item.badge}
        </span>
      );
    }

    return null;
  };

>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 overflow-auto">
      <nav className="py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm 
                  ${activeSection === item.id 
                    ? 'bg-green-50 text-green-900 font-medium border-l-4 border-green-700' 
                    : 'text-gray-700 hover:bg-gray-100'}`}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
<<<<<<< HEAD
=======

      {/* Información adicional en la parte inferior */}
      <div className="p-4 bg-white border-t border-gray-200">
        {/* Indicador de conectividad */}
        <div className="flex items-center text-xs">
          <div
            className={`w-2 h-2 rounded-full mr-2 ${
              loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
            }`}
          />
          <span className="text-gray-600">
            Sistema {loading ? 'sincronizando...' : 'conectado'}
          </span>
        </div>
      </div>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    </aside>
  );
};

MonitoringSidebar.propTypes = {
  activeSection: PropTypes.string,
};
