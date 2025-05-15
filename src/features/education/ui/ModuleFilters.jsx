import PropTypes from 'prop-types';

/**
 * Componente que muestra filtros para los módulos educativos.
 * Versión responsiva para pantallas pequeñas.
 * 
 * Ahora trabaja con objetos { id, name } y compara por ID.
 * 
 * @param {Object} props
 * @param {Array<{id: string|number, name: string}>} props.tags         Lista de etiquetas disponibles
 * @param {Array<string|number>}            props.activeTagIds  Lista de IDs de etiquetas activas
 * @param {Function}                         props.onTagClick    Función (tagId) => void
 */
export const ModuleFilters = ({
  tags = [],
  activeTagIds = [],
  onTagClick = () => {}
}) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium mb-2">Filtrar por:</h3>

      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {tags.map(({ id, name }) => (
            <button
              key={id}
              type="button"
              className={
                activeTagIds.includes(id)
                  ? "px-3 py-1 text-xs rounded-full bg-primary text-white font-medium"
                  : "px-3 py-1 text-xs rounded-full bg-white text-primary border border-primary"
              }
              onClick={() => onTagClick(id)}
            >
              #{name}
            </button>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm italic">
          No hay etiquetas disponibles para filtrar
        </p>
      )}
    </div>
  );
};

// Validación de propiedades
ModuleFilters.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      name: PropTypes.string.isRequired
    })
  ),
  activeTagIds: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  ),
  onTagClick: PropTypes.func
};
