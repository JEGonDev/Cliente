import React from 'react';
import { RiErrorWarningLine } from 'react-icons/ri';

/**
 * Componente para mostrar alertas de error con estilo consistente
 * 
 * @param {Object} props - Propiedades del componente 
 * @param {string} props.message - Mensaje de error a mostrar
 * @param {boolean} props.show - Controla si el error debe mostrarse
 * @param {string} props.className - Clases CSS adicionales
 */
export const AlertError = ({ message, show = true, className = '' }) => {
  if (!show || !message) return null;
  
  return (
    <div 
      className={`bg-red-50 border-l-4 border-red-500 p-3 rounded text-red-700 text-sm mb-4 ${className}`}
      role="alert"
    >
      <div className="flex items-center">
        <RiErrorWarningLine className="text-red-500 text-lg mr-2" />
        <span>{message}</span>
      </div>
    </div>
  );
};