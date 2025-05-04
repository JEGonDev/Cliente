import PropTypes from 'prop-types';
import { SidebarIcon } from '../ui/SidebarIcon';
import { Settings, Bell, MessageCircle, Users } from 'lucide-react';

/**
 * Layout que representa la barra lateral izquierda con iconos de navegación.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.activeIcon - Identificador del icono activo
 * @param {Function} props.onIconClick - Función que se ejecuta al hacer clic en un icono
 */
export const SidebarLayout = ({
  activeIcon = 'none',
  onIconClick = () => {}
}) => {
  // Configuración de los iconos
  const icons = [
    { id: 'settings', Icon: Settings, label: 'Configuración' },
    { id: 'notifications', Icon: Bell, label: 'Actividad' },
    { id: 'messages', Icon: MessageCircle, label: 'Foro' },
    { id: 'groups', Icon: Users, label: 'Grupos' }
  ];
  
  return (
    <aside className="w-35 bg-gray-100 border-r border-gray-300 flex flex-col items-center p-4">
      {icons.map(({ id, Icon, label }) => (
        <SidebarIcon
          key={id}
          icon={<Icon className="h-6 w-6 text-gray-600" />}
          label={label}
          active={activeIcon === id}
          onClick={() => onIconClick(id)}
        />
      ))}
    </aside>
  );
};

// Validación de propiedades
SidebarLayout.propTypes = {
  activeIcon: PropTypes.string,
  onIconClick: PropTypes.func
};