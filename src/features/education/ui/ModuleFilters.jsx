import PropTypes from 'prop-types';

/**
 * Componente que muestra filtros para los módulos educativos.
 * Versión responsiva para pantallas pequeñas.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.tags - Lista de etiquetas disponibles
 * @param {Array} props.activeTags - Lista de etiquetas activas
 * @param {Function} props.onTagClick - Función para manejar clic en etiquetas
 */
export const ModuleFilters = ({
  tags = [],
  activeTags = [],
  onTagClick = () => {}
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Filtrar por:</h3>
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={activeTags.includes(tag)
                ? "px-3 py-1 text-xs rounded-full bg-primary text-white font-medium"
                : "px-3 py-1 text-xs rounded-full bg-white text-primary border border-primary"
              }
              onClick={() => onTagClick(tag)}
            >
              #{tag}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">No hay etiquetas disponibles para filtrar</p>
      )}
    </div>
  );
};

// Validación de propiedades
ModuleFilters.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
  activeTags: PropTypes.arrayOf(PropTypes.string),
  onTagClick: PropTypes.func
};