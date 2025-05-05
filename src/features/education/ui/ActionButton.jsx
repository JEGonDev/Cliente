import PropTypes from 'prop-types';

/**
 * Botón para acciones como agregar o eliminar elementos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto del botón
 * @param {string} props.variant - Variante del botón ('add' o 'delete')
 * @param {Function} props.onClick - Función para manejar clic
 */
export const ActionButton = ({ 
  text, 
   
  onClick 
}) => {
    const bgColor = 'bg-[#043707]';
    const hoverColor = 'hover:bg-[#06540a]';
  
  return (
    <button
      className={`${bgColor} ${hoverColor} text-white py-3 px-6 rounded-md transition-colors`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

ActionButton.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['add', 'delete']),
  onClick: PropTypes.func
};