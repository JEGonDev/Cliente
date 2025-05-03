import PropTypes from 'prop-types';
import { ModuleCard } from './components/ModuleCard';

/**
 * Componente para mostrar una lista de módulos educativos en formato grid
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.modules - Lista de módulos a mostrar
 * @param {boolean} props.isAdmin - Indica si se muestra en modo administrador
 * @param {boolean} props.isSelectable - Indica si se pueden seleccionar módulos
 * @param {Function} props.onSelectModule - Función para manejar selección
 * @param {Array} props.selectedModules - Array con IDs de módulos seleccionados
 */
export const ModulesList = ({ 
  modules = [], 
  isAdmin = false, 
  isSelectable = false,
  onSelectModule = () => {},
  selectedModules = []
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {modules.map((module) => (
        <ModuleCard 
          key={module.id}
          module={module}
          isAdmin={isAdmin}
          isSelectable={isSelectable}
          isSelected={selectedModules.includes(module.id)}
          onSelect={onSelectModule}
        />
      ))}
    </div>
  );
};
// Validación de props
ModulesList.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      videosCount: PropTypes.number,
      articlesCount: PropTypes.number,
      guidesCount: PropTypes.number,
    })
  ).isRequired,
  isAdmin: PropTypes.bool,
  isSelectable: PropTypes.bool,
  onSelectModule: PropTypes.func,
  selectedModules: PropTypes.arrayOf(PropTypes.string),
};