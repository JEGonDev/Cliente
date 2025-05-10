import PropTypes from 'prop-types';

/**
 * Componente de botón reutilizable con múltiples variantes y tamaños
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante del botón (primary, secondary, outline, danger)
 * @param {string} props.size - Tamaño del botón (sm, md, lg)
 * @param {string} props.type - Tipo HTML del botón (button, submit, reset)
 * @param {boolean} props.disabled - Estado deshabilitado del botón
 * @param {Function} props.onClick - Función para manejar clics
 * @param {React.ReactNode} props.children - Contenido del botón
 * @param {string} props.className - Clases CSS adicionales
 */
export const Button = ({ 
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  onClick,
  children,
  className = '',
  ...rest
}) => {
  // Mapeo de variantes a clases de Tailwind
  const variantClasses = {
    primary: 'bg-primary hover:bg-green-800 text-white border border-primary',
    secondary: 'bg-secondary hover:bg-green-500 text-white border border-secondary',
    outline: 'bg-transparent hover:bg-gray-100 text-primary border border-primary',
    danger: 'bg-accent hover:bg-red-700 text-white border border-accent',
    white: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300',
    header: 'bg-header hover:bg-gray-50 text-white border border-gray-300'
  };
  
  // Mapeo de tamaños a clases de Tailwind
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-8 py-3 text-lg'
  };
  
  // Construir la clase completa
  const buttonClasses = `
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...rest}
    >
      {children}
    </button>
  );
};

// Validación de propiedades
Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'white', 'header']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};