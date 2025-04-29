/**
 * Card genérica para formularios de autenticación con título y manejo de errores
 * Este componente puede ser utilizado por cualquier formulario relacionado con autenticación
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del formulario
 * @param {string} props.error - Mensaje de error (opcional)
 * @param {React.ReactNode} props.children - Contenido del formulario
 * @param {string} props.className - Clases CSS adicionales (opcional)
 */
export const AuthFormCard = ({ title, error, children, className = '' }) => {
  return (
    <div className={`p-6 bg-white shadow-md rounded-md ${className}`}>
      <h2 className="text-2xl font-bold text-center mb-6">{title}</h2>
      
      {/* Muestra mensajes de error si existen */}
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      
      {children}
    </div>
  );
};