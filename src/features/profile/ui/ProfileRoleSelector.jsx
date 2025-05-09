// src/features/profile/ui/ProfileRoleSelector.jsx

import PropTypes from 'prop-types';

/**
 * Componente para seleccionar roles y estado de usuario
 * Simplificado para mostrar solo lo esencial en la gestión por roles
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.selectedRole - Rol seleccionado actualmente
 * @param {string} props.selectedStatus - Estado seleccionado actualmente
 * @param {Function} props.onRoleChange - Función para manejar cambios en el rol
 * @param {Function} props.onStatusChange - Función para manejar cambios en el estado
 */
export const ProfileRoleSelector = ({ 
  selectedRole = 'Usuario', 
  selectedStatus = 'Activo',
  onRoleChange,
  onStatusChange
}) => {
  // Información de roles disponibles
  const roles = [
    { 
      id: 'usuario', 
      name: 'Usuario', 
      description: 'Acceso básico a la plataforma, puede participar en la comunidad y ver contenido educativo.' 
    },
    { 
      id: 'moderador', 
      name: 'Moderador', 
      description: 'Puede moderar contenido y comentarios de la comunidad.' 
    },
    { 
      id: 'administrador', 
      name: 'Administrador', 
      description: 'Acceso completo a todas las funciones, incluyendo gestión de usuarios y contenido.' 
    }
  ];
  
  // Encontrar la información del rol seleccionado
  const selectedRoleInfo = roles.find(role => role.name === selectedRole) || roles[0];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Selector de rol */}
        <div>
          <label htmlFor="userRole" className="block text-sm font-medium text-gray-700 mb-1">
            Asignar Rol
          </label>
          <select 
            id="userRole" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
          >
            {roles.map(role => (
              <option key={role.id} value={role.name}>{role.name}</option>
            ))}
          </select>
        </div>
        
        {/* Selector de estado */}
        <div>
          <label htmlFor="userStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select 
            id="userStatus" 
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      
      {/* Descripción del rol seleccionado */}
      <div className={`p-3 rounded-md ${
        selectedRole === 'Administrador' 
          ? 'bg-purple-50 text-purple-800 border border-purple-200' 
          : selectedRole === 'Moderador'
            ? 'bg-blue-50 text-blue-800 border border-blue-200'
            : 'bg-gray-50 text-gray-800 border border-gray-200'
      }`}>
        <p className="text-sm">{selectedRoleInfo.description}</p>
      </div>
    </div>
  );
};

ProfileRoleSelector.propTypes = {
  selectedRole: PropTypes.string,
  selectedStatus: PropTypes.string,
  onRoleChange: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired
};