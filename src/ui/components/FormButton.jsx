/**
 * Botón de envío para formularios con icono opcional
 * Este componente puede ser utilizado por cualquier formulario de la aplicación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.text - Texto del botón
 * @param {React.ReactNode} props.icon - Icono opcional
 * @param {string} props.type - Tipo de botón (default: 'submit')
 * @param {string} props.className - Clases CSS adicionales (opcional)
 * @param {Function} props.onClick - Función para manejo de click (opcional)
 */
export const FormButton = ({ 
  text, 
  icon, 
  type = 'submit', 
  className = '', 
  onClick 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bg-primary text-white w-full py-2 rounded-md hover:bg-green-700 
        transition-colors flex items-center justify-center gap-2 ${className}`}
    >
      {icon && icon}
      {text}
    </button>
  );
};
