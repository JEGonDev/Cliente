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
  // Definición de las secciones de navegación
  const navItems = [
    {
      id: 'monitoreo',
      label: 'Módulo de monitoreo',
      icon: <Thermometer size={18} />,
      path: '/monitoring'
    },
    {
      id: 'alertas',
      label: 'Alertas',
      icon: <Bell size={18} />,
      path: '/monitoring/alerts'
    },
    {
      id: 'cultivos',
      label: 'Cultivos',
      icon: <Clock size={18} />,
      path: '/monitoring/crops'
    },
    {
      id: 'historial',
      label: 'Historial de datos',
      icon: <BarChart2 size={18} />,
      path: '/monitoring/history'
    },
    {
      id: 'tiempo-real',
      label: 'Monitoreo en tiempo real',
      icon: <Clock size={18} />,
      path: '/monitoring/real-time'
    }
  ];

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
    </aside>
  );
};

MonitoringSidebar.propTypes = {
  activeSection: PropTypes.string
};