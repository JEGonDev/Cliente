import { X, Edit, Trash2 } from 'lucide-react';

export const UserDetailsModal = ({
  user,
  onClose,
  onEdit,
  onToggleStatus,
  onDelete
}) => {
  // Normaliza campos para visualización
  const statusLabel = user.isActive ? 'Activo' : 'Inactivo';
  const statusClass = user.isActive
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  // Normaliza rol para visualización
  const roleMap = {
    ADMINISTRADOR: 'Administrador',
    MODERADOR: 'Moderador',
    USUARIO: 'Usuario'
  };
  const roleLabel = roleMap[user.roleType] || user.roleType || 'Usuario';

  // Descripción extendida por rol
  const roleDesc = {
    ADMINISTRADOR:
      'Acceso completo a todas las funciones, incluyendo gestión de usuarios y contenido.',
    MODERADOR:
      'Puede moderar contenido y comentarios de la comunidad.',
    USUARIO:
      'Acceso básico a la plataforma, puede participar en la comunidad y ver contenido educativo.'
  };

  // Fecha de registro formateada
  const createdDate = user.creationDate
    ? new Date(user.creationDate).toLocaleDateString()
    : '-';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-screen flex flex-col overflow-y-auto">
        <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-primary text-white">
          <h2 className="text-xl font-bold">Detalles del Usuario</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
              {/* Si no hay avatar, muestra iniciales o icono genérico */}
              {user.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-500 bg-gray-200">
                  {user.firstName?.charAt(0) || ''}{user.lastName?.charAt(0) || ''}
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${statusClass}`}>
                {statusLabel}
              </span>
            </div>
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Información Personal</h4>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              <div>
                <dt className="text-sm text-gray-500">ID</dt>
                <dd>{user.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Fecha de registro</dt>
                <dd>{createdDate}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">País</dt>
                <dd>{user.country || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Descripción</dt>
                <dd>{user.description || '-'}</dd>
              </div>
            </dl>
          </div>
          <div className="border-t mt-4 pt-4">
            <h4 className="font-medium mb-2">Rol</h4>
            <div className={`p-3 rounded-md ${
              user.roleType === 'ADMINISTRADOR'
                ? 'bg-purple-50 text-purple-800 border border-purple-200'
                : user.roleType === 'MODERADOR'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-gray-50 text-gray-800 border border-gray-200'
            }`}>
              <p className="font-medium">{roleLabel}</p>
              <p className="text-sm mt-1">{roleDesc[user.roleType] || roleDesc.USUARIO}</p>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t space-y-2">
            <button
              onClick={onEdit}
              className="w-full flex items-center justify-center px-4 py-2 border border-secondary rounded-md text-sm text-primary hover:bg-green"
            >
              <Edit size={16} className="mr-2" />
              Editar Usuario
            </button>
            <button
              onClick={() => onToggleStatus(user)}
              className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm ${
                user.isActive 
                  ? 'border-orange text-orange hover:bg-orange'
                  : 'border-green text-primary hover:bg-green'
              }`}
            >
              {user.isActive ? 'Desactivar Usuario' : 'Activar Usuario'}
            </button>
            <button
              onClick={() => onDelete(user)}
              className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} className="mr-2" />
              Eliminar Usuario
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// import { X, Edit, Trash2 } from 'lucide-react';

// export const UserDetailsModal = ({
//   user,
//   onClose,
//   onEdit,
//   onToggleStatus,
//   onDelete
// }) => (
//   <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
//     <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
//       <div className="p-4 border-b flex justify-between items-center">
//         <h2 className="text-xl font-bold">Detalles del Usuario</h2>
//         <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
//           <X size={20} />
//         </button>
//       </div>
//       <div className="p-6">
//         <div className="flex items-center mb-6">
//           <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
//             <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
//           </div>
//           <div>
//             <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
//             <p className="text-gray-600">{user.email}</p>
//             <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
//               user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//             }`}>
//               {user.status}
//             </span>
//           </div>
//         </div>
//         <div className="border-t pt-4">
//           <h4 className="font-medium mb-2">Información Personal</h4>
//           <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
//             <div>
//               <dt className="text-sm text-gray-500">ID</dt>
//               <dd>{user.id}</dd>
//             </div>
//             <div>
//               <dt className="text-sm text-gray-500">Fecha de registro</dt>
//               <dd>{user.createdAt}</dd>
//             </div>
//             <div>
//               <dt className="text-sm text-gray-500">Teléfono</dt>
//               <dd>{user.phone}</dd>
//             </div>
//             <div>
//               <dt className="text-sm text-gray-500">Último acceso</dt>
//               <dd>{user.lastLogin}</dd>
//             </div>
//             <div className="sm:col-span-2">
//               <dt className="text-sm text-gray-500">Dirección</dt>
//               <dd>{user.address}</dd>
//             </div>
//           </dl>
//         </div>
//         <div className="border-t mt-4 pt-4">
//           <h4 className="font-medium mb-2">Rol</h4>
//           <div className={`p-3 rounded-md ${
//             user.role === 'Administrador' 
//               ? 'bg-purple-50 text-purple-800 border border-purple-200' 
//               : user.role === 'Moderador'
//                 ? 'bg-blue-50 text-blue-800 border border-blue-200'
//                 : 'bg-gray-50 text-gray-800 border border-gray-200'
//           }`}>
//             <p className="font-medium">{user.role}</p>
//             <p className="text-sm mt-1">
//               {user.role === 'Administrador' 
//                 ? 'Acceso completo a todas las funciones, incluyendo gestión de usuarios y contenido.' 
//                 : user.role === 'Moderador'
//                   ? 'Puede moderar contenido y comentarios de la comunidad.'
//                   : 'Acceso básico a la plataforma, puede participar en la comunidad y ver contenido educativo.'}
//             </p>
//           </div>
//         </div>
//         <div className="mt-6 pt-4 border-t space-y-2">
//           <button
//             onClick={onEdit}
//             className="w-full flex items-center justify-center px-4 py-2 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-50"
//           >
//             <Edit size={16} className="mr-2" />
//             Editar Usuario
//           </button>
//           <button
//             onClick={() => onToggleStatus(user)}
//             className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm ${
//               user.status === 'Activo' 
//                 ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
//                 : 'border-green-300 text-green-700 hover:bg-green-50'
//             }`}
//           >
//             {user.status === 'Activo' ? 'Desactivar Usuario' : 'Activar Usuario'}
//           </button>
//           <button
//             onClick={() => onDelete(user)}
//             className="w-full flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-sm text-red-700 hover:bg-red-50"
//           >
//             <Trash2 size={16} className="mr-2" />
//             Eliminar Usuario
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// );