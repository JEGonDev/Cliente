import PropTypes from 'prop-types';

/**
 * Componente que representa una etiqueta de filtrado.
 * Se utiliza para filtrar contenido educativo por categorías.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|Object} props.tag - Etiqueta (puede ser string u objeto con {id, name})
 * @param {boolean} props.active - Indica si la etiqueta está activa
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 */
export const FilterTag = ({ 
  tag, 
  active = false, 
  onClick = () => {} 
}) => {
  // Manejamos tanto string como objeto
  const tagName = typeof tag === 'string' ? tag : (tag && tag.name ? tag.name : '');
  const tagId = typeof tag === 'object' && tag && tag.id ? tag.id : null;

  return (
    <button
      type="button"
      className={active 
        ? "w-full py-2 px-4 rounded-md text-sm bg-primary text-white font-medium transition-colors" 
        : "w-full py-2 px-4 rounded-md text-sm bg-white text-primary border border-primary hover:bg-green-50 transition-colors"
      }
      onClick={() => onClick(tagName, tagId)}
    >
      #{tagName}
    </button>
  );
};

// Validación de propiedades
FilterTag.propTypes = {
  tag: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      name: PropTypes.string
    })
  ]).isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func
};