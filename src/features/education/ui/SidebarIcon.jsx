import React from 'react';
import PropTypes from 'prop-types';

/**
 * Componente que representa un icono en la barra lateral.
 * Incluye un ícono y un texto opcional.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.icon - Icono a mostrar
 * @param {string} props.label - Texto que aparece debajo del icono
 * @param {boolean} props.active - Indica si el icono está activo
 * @param {Function} props.onClick - Función a ejecutar al hacer clic
 */
export const SidebarIcon = ({ 
  icon, 
  label, 
  active = false, 
  onClick = () => {} 
}) => {
  return (
    <div 
      className="flex flex-col items-center py-4 cursor-pointer"
      onClick={onClick}
    >
      <div className={`rounded-full ${active ? 'bg-green-100' : 'bg-gray-200'} p-3`}>
        {icon}
      </div>
      {label && (
        <span className="mt-1 text-sm text-center">{label}</span>
      )}
    </div>
  );
};

// Validación de propiedades
SidebarIcon.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func
};