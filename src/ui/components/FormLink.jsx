import { Link } from 'react-router-dom';

/**
 * Componente para enlaces de navegación entre formularios
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto principal
 * @param {string} props.linkText - Texto del enlace
 * @param {string} props.to - Ruta de destino
 * @param {React.ReactNode} props.icon - Icono opcional para el enlace
 */
export const FormLink = ({ text, linkText, to, icon }) => {
  return (
    <p className="text-center text-sm mt-4">
      {text}{' '}
      <Link to={to} className="text-primary font-semibold hover:text-secondary inline-flex items-center gap-1">
        {icon && icon}
        {linkText}
      </Link>
    </p>
  );
};