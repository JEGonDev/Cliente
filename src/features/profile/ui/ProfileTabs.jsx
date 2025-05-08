import PropTypes from 'prop-types';

/**
 * Componente de pestañas para la edición del perfil
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.tabs - Lista de pestañas
 * @param {string} props.activeTab - ID de la pestaña activa
 * @param {Function} props.onTabChange - Función que se ejecuta al cambiar de pestaña
 */
export const ProfileTabs = ({ 
  tabs = [],
  activeTab = '',
  onTabChange = () => {} 
}) => {
  return (
    <div className="mb-6">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
              onClick={() => onTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

ProfileTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ),
  activeTab: PropTypes.string,
  onTabChange: PropTypes.func
};