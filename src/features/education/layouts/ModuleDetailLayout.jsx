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
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-6 sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

// Validación de propiedades
ModuleDetailLayout.propTypes = {
  children: PropTypes.node.isRequired
};