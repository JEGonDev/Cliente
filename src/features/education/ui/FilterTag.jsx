import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente que representa una etiqueta de filtrado.
 * Se utiliza para filtrar contenido educativo por categorías.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto de la etiqueta
 * @param {boolean} props.active - Indica si la etiqueta está activa
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 */
export const FilterTag = ({ 
  text, 
  active = false, 
  onClick = () => {} 
}) => {
  return (
    <button
      type="button"
      className={active 
        ? "w-full py-2 px-4 rounded-md text-sm bg-primary text-white font-medium transition-colors" 
        : "w-full py-2 px-4 rounded-md text-sm bg-white text-primary border border-primary hover:bg-green-50 transition-colors"
      }
      onClick={() => onClick(text)}
    >
      #{text}
    </button>
  );
};

// Validación de propiedades
FilterTag.propTypes = {
  text: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func
};