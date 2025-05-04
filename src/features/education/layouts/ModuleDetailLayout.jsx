import PropTypes from 'prop-types';

import { useState } from 'react';

/**
 * Layout principal para la página de detalle de un módulo educativo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido principal
 */
export const ModuleDetailLayout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('overview');
  
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    // Aquí podría ir lógica adicional al cambiar de sección (si fuera necesario)
  };
  
  return (
      
      <div className="flex flex-1">
    
        {/* Contenido principal */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>

  );
};

// Validación de propiedades
ModuleDetailLayout.propTypes = {
  children: PropTypes.node.isRequired
};