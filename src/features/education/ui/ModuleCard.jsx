
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Tarjeta para mostrar un módulo educativo individual
 * Muestra información básica de un módulo y permite navegar a su detalle
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.module - Datos del módulo a mostrar
 * @param {boolean} props.isAdmin - Indica si se muestra en modo administrador
 * @param {boolean} props.isSelectable - Indica si se puede seleccionar (modo eliminación)
 * @param {Function} props.onSelect - Función para manejar selección (checkbox)
 * @param {boolean} props.isSelected - Indica si está seleccionado
 */
export const ModuleCard = ({ 
  module, 
  isAdmin = false, 
  isSelectable = false,
  onSelect = () => {},
  isSelected = false
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Si es seleccionable, mostrar checkbox */}
      {isSelectable && (
        <div className="absolute top-2 right-2">
          <input 
            type="checkbox" 
            className="h-6 w-6 border-2 rounded-md"
            checked={isSelected}
            onChange={() => onSelect(module.id)}
          />
        </div>
      )}
      
      <Link to={`/education/modules/${module.id}`}>
        <div className="p-4">
          {/* Título del módulo */}
          <h3 className="font-semibold mb-2">{module.title}</h3>
          
          {/* Etiquetas */}
          <div className="flex flex-wrap gap-1 mb-2">
            {module.tags && module.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          
          {/* Contadores */}
          <div className="text-xs text-gray-600 flex gap-2">
            <span>{module.videosCount || 10} Videos</span>
            <span>-</span>
            <span>{module.articlesCount || 10} Artículos</span>
            <span>-</span>
            <span>{module.guidesCount || 25} Guías</span>
          </div>
          
          {/* Identificador (solo visible en modo admin) */}
          {isAdmin && module.id && (
            <div className="mt-2 text-xs text-gray-500">
              Código identificador: {module.id}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
// Validación de propiedades con PropTypes
ModuleCard.propTypes = {
  module: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    videosCount: PropTypes.number,
    articlesCount: PropTypes.number,
    guidesCount: PropTypes.number,
  }).isRequired,
  isAdmin: PropTypes.bool,
  isSelectable: PropTypes.bool,
  onSelect: PropTypes.func,
  isSelected: PropTypes.bool,
};