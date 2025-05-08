import PropTypes from 'prop-types';

/**
 * Layout para la página de edición de perfil
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido del layout
 */
export const ProfileEditLayout = ({ children }) => {
  return (
    <div className="w-full max-w-3xl bg-white shadow-md rounded-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Editar Perfil</h1>
      {children}
    </div>
  );
};

ProfileEditLayout.propTypes = {
  children: PropTypes.node.isRequired
};