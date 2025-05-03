import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Layout para la vista detallada de un módulo educativo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido de la página
 * @param {string} props.moduleTitle - Título del módulo
 * @param {React.ReactNode} props.actions - Acciones adicionales (botones, controles)
 */
export const ModuleDetailLayout = ({ children, moduleTitle, actions }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <Link to="/education" className="flex items-center text-blue-600 hover:underline mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          <span>Volver a módulos</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">{moduleTitle || 'Detalle del módulo'}</h1>
          
          {actions && (
            <div className="flex flex-wrap gap-2">
              {actions}
            </div>
          )}
        </div>
      </div>
      
      <div>
        {children}
      </div>
    </div>
  );
};

//Validacion de props
ModuleDetailLayout.propTypes = {
  children: PropTypes.node.isRequired,       // Los hijos son obligatorios
  moduleTitle: PropTypes.string.isRequired,  // El título del módulo es obligatorio
  actions: PropTypes.node,                   // Las acciones son opcionales
};