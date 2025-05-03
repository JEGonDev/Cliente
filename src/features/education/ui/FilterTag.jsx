import PropTypes from 'prop-types';
/**
 * Etiqueta para filtrado de módulos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto de la etiqueta
 * @param {boolean} props.active - Indica si el filtro está activo
 * @param {Function} props.onClick - Función para manejar el click
 */
export const FilterTag = ({ text, active = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
        ${active 
          ? 'bg-green-900 text-white' 
          : 'bg-white text-green-900 border border-green-900 hover:bg-green-100'
        }`}
    >
      #{text}
    </button>
  );
};

//Validacion de props 
FilterTag.propTypes = {
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};