// src/features/profile/layouts/ProfileLayout.jsx

import PropTypes from 'prop-types';

/**
 * Layout compartido para todas las secciones relacionadas con perfil
 * Proporciona la estructura común y estilos consistentes
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a mostrar
 * @param {string} props.title - Título de la sección
 * @param {string} props.description - Descripción opcional
 */
export const ProfileLayout = ({ children, title, description }) => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-600">{description}</p>
          )}
        </div>
        
        <div className="bg-white shadow-sm rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

ProfileLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string
};

ProfileLayout.defaultProps = {
  description: ''
};