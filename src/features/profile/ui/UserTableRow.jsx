import { Edit, Eye, Trash2 } from 'lucide-react';

export const UserTableRow = ({ user, onEdit, onView, onDelete }) => {
  // Puedes dejar este console.log solo para debug temporal
  // console.log(user);

  // Adaptación de campos:
  // - user.roleType en vez de user.role
  // - user.isActive en vez de user.status
  // - user.creationDate como fecha de registro
  // - user.avatar puede ser null
  // - user.phone no existe, puedes omitirlo o mostrar "-"
  // - user.lastLogin no existe, puedes mostrar "-" o creationDate

  // Definir valores adaptados
  const role =
    user.roleType === "ADMINISTRADOR"
      ? "Administrador"
      : user.roleType === "MODERADOR"
        ? "Moderador"
        : "Usuario";

  const status = user.isActive ? "Activo" : "Inactivo";

  // color de role según tipo
  const roleClass =
    user.roleType === "ADMINISTRADOR"
      ? "bg-purple-100 text-purple-800"
      : user.roleType === "MODERADOR"
        ? "bg-blue-100 text-blue-800"
        : "bg-gray-100 text-gray-800";

  // color de status
  const statusClass = user.isActive
    ? "bg-green-100 text-green-800"
    : "bg-red-100 text-red-800";

  // avatar fallback
  const avatarSrc =
    user.avatar ||
    "https://ui-avatars.com/api/?name=" +
      encodeURIComponent(`${user.firstName} ${user.lastName}`) +
      "&background=random";

  // Fecha de registro legible
  const creationDate = user.creationDate
    ? new Date(user.creationDate).toLocaleDateString()
    : "-";

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
            <img src={avatarSrc} alt="" className="h-10 w-10 object-cover" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
            <div className="text-xs text-gray-500">ID: {user.id}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{user.email}</div>
        <div className="text-sm text-gray-500">{user.username}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleClass}`}>
          {role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {creationDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-center">
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => onEdit(user)}
            className="bg-green text-white p-2 rounded-md hover:bg-green-800 transition"
            title="Editar usuario"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onView(user)}
            className="bg-blue text-white p-2 rounded-md hover:bg-blue-700 transition"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
            title="Eliminar usuario"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};


// import { Edit, Eye, Trash2 } from 'lucide-react';

// export const UserTableRow = ({ user, onEdit, onView, onDelete }) => (
//     console.log(user),
//   <tr className="hover:bg-gray-50">
//     <td className="px-6 py-4 whitespace-nowrap">
//       <div className="flex items-center">
//         <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
//           <img src={user.avatar} alt="" className="h-10 w-10 object-cover" />
//         </div>
//         <div className="ml-4">
//           <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
//           <div className="text-xs text-gray-500">ID: {user.id}</div>
//         </div>
//       </div>
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       <div className="text-sm text-gray-900">{user.email}</div>
//       <div className="text-sm text-gray-500">{user.phone}</div>
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//         user.role === 'Administrador' 
//           ? 'bg-purple-100 text-purple-800' 
//           : user.role === 'Moderador'
//             ? 'bg-gray text-blue'
//             : 'bg-gray-100 text-gray-800'
//       }`}>
//         {user.role}
//       </span>
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap">
//       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//         user.status === 'Activo' 
//           ? 'bg-white text-green' 
//           : 'bg-red-100 text-red-800'
//       }`}>
//         {user.status}
//       </span>
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//       {user.lastLogin}
//     </td>
//     <td className="px-6 py-4 whitespace-nowrap text-center">
//       <div className="flex items-center justify-center space-x-3">
//         <button onClick={() => onEdit(user)} className="bg-green text-white p-2 rounded-md hover:bg-green-800 transition" title="Editar usuario">
//           <Edit size={16} />
//         </button>
//         <button onClick={() => onView(user)} className="bg-blue text-white p-2 rounded-md hover:bg-blue-700 transition" title="Ver detalles">
//           <Eye size={16} />
//         </button>
//         <button onClick={() => onDelete(user)} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition" title="Eliminar usuario">
//           <Trash2 size={16} />
//         </button>
//       </div>
//     </td>
//   </tr>
// );