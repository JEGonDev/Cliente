import PropTypes from 'prop-types';

/**
 * Layout simplificado para la página de detalle de un módulo educativo
 * Sin barra lateral de navegación ni header
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido principal
 */
export const ModuleDetailLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Contenido principal */}
      <main className="flex-1 p-6 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
};

// Validación de propiedades
ModuleDetailLayout.propTypes = {
  children: PropTypes.node.isRequired
};