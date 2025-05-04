import PropTypes from 'prop-types';

/**
 * Componente que muestra una etiqueta de contenido
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto de la etiqueta
 * @param {string} props.color - Color de fondo (opcional)
 */
export const ContentTag = ({ 
  text, 
  color = 'bg-gray-100' 
}) => {
  return (
    <span 
      className={`text-sm ${color} text-gray-800 px-2 py-1 rounded-full inline-flex items-center`}
    >
      #{text}
    </span>
  );
};

// Validación de propiedades
ContentTag.propTypes = {
  text: PropTypes.string.isRequired,
  color: PropTypes.string
};