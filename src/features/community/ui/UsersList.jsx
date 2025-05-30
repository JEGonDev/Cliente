import React from 'react';

/**
 * Componente que muestra la lista de usuarios de la comunidad
 * Diseñado para el panel de administración
 */
export const UsersList = () => {
  // Datos de muestra para la lista de usuarios
  const users = [
    { 
      id: 1, 
      username: "GreenLover23", 
      avatar: "👤",
      status: "activo"
    },
    { 
      id: 2, 
      username: "GreenLover23", 
      avatar: "👤",
      status: "activo"
    },
    { 
      id: 3, 
      username: "GreenLover23", 
      avatar: "👤",
      status: "activo"
    }
  ];

  /**
   * Maneja el clic en un usuario (para futuras acciones)
   * @param {number} userId - ID del usuario seleccionado
   */
  const handleUserClick = (userId) => {
    // TODO: Implementar navegación al perfil o acciones del usuario
    console.log(`Usuario seleccionado: ${userId}`);
  };

  /**
   * Genera las iniciales del username para el avatar
   * @param {string} username - Nombre de usuario
   * @returns {string} Iniciales del usuario
   */
  const getUserInitials = (username) => {
    return username
      .split(/\s+/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="bg-white">
      <h2 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
        <span className="w-2 h-2 bg-blue-500 rounded-full inline-block mr-2"></span>
        Usuarios
      </h2>
      
      <div className="space-y-3">
        {users.length > 0 ? (
          users.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleUserClick(user.id)}
            >
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xs font-medium">
                {user.avatar === "👤" ? getUserInitials(user.username) : user.avatar}
              </div>
              <div className="flex-1">
                <span className="text-sm text-gray-800">{user.username}</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    user.status === 'activo' ? 'bg-green-400' : 'bg-gray-400'
                  }`}></span>
                  <span className="text-xs text-gray-500 capitalize">{user.status}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No hay usuarios registrados</p>
          </div>
        )}
      </div>
    </div>
  );
};