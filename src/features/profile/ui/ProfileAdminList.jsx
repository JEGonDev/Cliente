// src/features/profile/ui/ProfileAdminList.jsx

import { useState } from 'react';
import { Search, Filter, RefreshCw, UserPlus, Edit, Trash2, Eye, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ProfileEditView } from './ProfileEditView';

/**
 * Componente para listar y administrar usuarios del sistema
 * Permite filtrar, buscar, ver detalles, editar y eliminar usuarios
 * 
 * @returns {JSX.Element} Lista de usuarios con controles de administración
 */
export const ProfileAdminList = () => {
  // Estado para la página actual y usuario seleccionado
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showUserEdit, setShowUserEdit] = useState(false);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Datos de ejemplo de usuarios (en una aplicación real, esto vendría de una API)
  const [users] = useState([
    { 
      id: 1, 
      firstName: 'Carlos',
      lastName: 'Ramírez', 
      email: 'carlos@example.com', 
      phone: '+57 300 123 4567',
      address: 'Calle 10 #15-23, Pereira, Risaralda',
      birthDate: '1990-05-15',
      role: 'Administrador', 
      status: 'Activo',
      lastLogin: '2025-04-15 08:45',
      createdAt: '2024-10-12',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 2, 
      firstName: 'Ana María',
      lastName: 'Gómez', 
      email: 'ana@example.com', 
      phone: '+57 300 654 3210',
      address: 'Carrera 25 #45-12, Pereira, Risaralda',
      birthDate: '1988-11-22',
      role: 'Usuario', 
      status: 'Activo',
      lastLogin: '2025-05-01 14:22',
      createdAt: '2024-11-05',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 3, 
      firstName: 'Javier',
      lastName: 'López', 
      email: 'javier@example.com', 
      phone: '+57 311 987 6543',
      address: 'Avenida 30 #10-15, Pereira, Risaralda',
      birthDate: '1992-03-08',
      role: 'Moderador', 
      status: 'Inactivo',
      lastLogin: '2025-03-18 10:30',
      createdAt: '2024-09-28',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 4, 
      firstName: 'Lucía',
      lastName: 'Martínez', 
      email: 'lucia@example.com', 
      phone: '+57 312 345 6789',
      address: 'Calle 5 #8-32, Pereira, Risaralda',
      birthDate: '1995-07-16',
      role: 'Usuario', 
      status: 'Activo',
      lastLogin: '2025-05-04 16:05',
      createdAt: '2025-01-15',
      avatar: '/api/placeholder/40/40'
    },
    { 
      id: 5, 
      firstName: 'Roberto',
      lastName: 'Sánchez', 
      email: 'roberto@example.com', 
      phone: '+57 300 111 2222',
      address: 'Carrera 15 #20-45, Pereira, Risaralda',
      birthDate: '1985-12-03',
      role: 'Usuario', 
      status: 'Activo',
      lastLogin: '2025-04-28 11:15',
      createdAt: '2024-12-03',
      avatar: '/api/placeholder/40/40'
    }
  ]);

  // Funciones para manejar acciones de usuario
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowUserEdit(true);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleToggleStatus = (user) => {
    console.log(`Cambiando estado de ${user.firstName} ${user.lastName} a ${user.status === 'Activo' ? 'Inactivo' : 'Activo'}`);
    // Aquí iría la lógica para cambiar el estado
  };

  const confirmDelete = () => {
    // Aquí iría la lógica para eliminar al usuario
    console.log(`Eliminando usuario: ${userToDelete.firstName} ${userToDelete.lastName}`);
    setShowDeleteModal(false);
    // Actualizar la lista de usuarios después de eliminar
  };

  // Componente para el modal de detalles de usuario
  const UserDetailsModal = ({ user, onClose, onEdit }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Detalles del Usuario</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden mr-4">
              <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user.firstName} {user.lastName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <span className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                user.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user.status}
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
                <dd>{user.createdAt}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Teléfono</dt>
                <dd>{user.phone}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Último acceso</dt>
                <dd>{user.lastLogin}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm text-gray-500">Dirección</dt>
                <dd>{user.address}</dd>
              </div>
            </dl>
          </div>
          
          <div className="border-t mt-4 pt-4">
            <h4 className="font-medium mb-2">Rol</h4>
            <div className={`p-3 rounded-md ${
              user.role === 'Administrador' 
                ? 'bg-purple-50 text-purple-800 border border-purple-200' 
                : user.role === 'Moderador'
                  ? 'bg-blue-50 text-blue-800 border border-blue-200'
                  : 'bg-gray-50 text-gray-800 border border-gray-200'
            }`}>
              <p className="font-medium">{user.role}</p>
              <p className="text-sm mt-1">
                {user.role === 'Administrador' 
                  ? 'Acceso completo a todas las funciones, incluyendo gestión de usuarios y contenido.' 
                  : user.role === 'Moderador'
                    ? 'Puede moderar contenido y comentarios de la comunidad.'
                    : 'Acceso básico a la plataforma, puede participar en la comunidad y ver contenido educativo.'}
              </p>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t space-y-2">
            <button 
              onClick={onEdit}
              className="w-full flex items-center justify-center px-4 py-2 border border-green-300 rounded-md text-sm text-green-700 hover:bg-green-50"
            >
              <Edit size={16} className="mr-2" />
              Editar Usuario
            </button>
            
            <button 
              onClick={() => handleToggleStatus(user)}
              className={`w-full flex items-center justify-center px-4 py-2 border rounded-md text-sm ${
                user.status === 'Activo' 
                  ? 'border-orange-300 text-orange-700 hover:bg-orange-50'
                  : 'border-green-300 text-green-700 hover:bg-green-50'
              }`}
            >
              {user.status === 'Activo' ? 'Desactivar Usuario' : 'Activar Usuario'}
            </button>
            
            <button 
              onClick={() => {
                onClose();
                handleDeleteUser(user);
              }}
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

  // Componente para crear un nuevo usuario
  const CreateUserModal = ({ onClose, onSave }) => {
    const newUserTemplate = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      birthDate: '',
      password: '',
      confirmPassword: '',
      role: 'Usuario',
      status: 'Activo'
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <ProfileEditView 
            user={newUserTemplate}
            isAdmin={true}
            onSave={(userData) => {
              console.log('Datos del usuario nuevo:', userData);
              onSave(userData);
            }}
            onCancel={onClose}
          />
        </div>
      </div>
    );
  };
  
  // Componente para el modal de confirmación de eliminación
  const DeleteUserModal = ({ user, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
        <p className="mb-4">¿Estás seguro de que deseas eliminar al usuario <strong>{user.firstName} {user.lastName}</strong>?</p>
        <p className="text-sm text-gray-600 mb-6">Esta acción no se puede deshacer y eliminará todos los datos asociados con este usuario.</p>
        
        <div className="flex justify-end space-x-3">
          <button 
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium">Usuarios del Sistema</h2>
        <button 
          className="inline-flex items-center px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          onClick={() => setShowCreateModal(true)}
        >
          <UserPlus size={16} className="mr-2" />
          Nuevo Usuario
        </button>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuario..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-700 focus:border-green-700"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
        </div>
        
        <div className="flex space-x-2">
          <div className="relative">
            <select className="h-10 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-700 focus:border-green-700 appearance-none">
              <option value="">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="moderator">Moderador</option>
              <option value="user">Usuario</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-gray-400 h-5 w-5 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select className="h-10 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-700 focus:border-green-700 appearance-none">
              <option value="">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
            <Filter className="absolute right-3 top-2.5 text-gray-400 h-5 w-5 pointer-events-none" />
          </div>
          
          <button className="inline-flex items-center p-2 border border-gray-300 bg-white rounded-md shadow-sm hover:bg-gray-50">
            <RefreshCw className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>
      
      {/* Tabla de usuarios */}
      <div className="bg-white overflow-hidden rounded-md mb-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usuario
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último acceso
                </th>
                <th scope="col" className="relative px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                        <img src={user.avatar} alt="" className="h-10 w-10 object-cover" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'Administrador' 
                        ? 'bg-purple-100 text-purple-800' 
                        : user.role === 'Moderador'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'Activo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex items-center justify-center space-x-3">
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="bg-green-700 text-white p-2 rounded-md hover:bg-green-800 transition"
                        title="Editar usuario"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
                        title="Ver detalles"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user)}
                        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
                        title="Eliminar usuario"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Paginación */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">1</span> a <span className="font-medium">5</span> de <span className="font-medium">15</span> usuarios
        </p>
        <div className="flex justify-end">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <ChevronLeft size={16} />
            </button>
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              1
            </button>
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-green-50 text-sm font-medium text-green-700 hover:bg-green-100">
              2
            </button>
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              3
            </button>
            <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
              <ChevronRight size={16} />
            </button>
          </nav>
        </div>
      </div>
      
      {/* Modal de detalles de usuario */}
      {showUserDetails && selectedUser && (
        <UserDetailsModal 
          user={selectedUser} 
          onClose={() => setShowUserDetails(false)} 
          onEdit={() => {
            setShowUserDetails(false);
            handleEditUser(selectedUser);
          }}
        />
      )}
      
      {/* Modal de edición de usuario (reutiliza el componente ProfileEditView) */}
      {showUserEdit && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <ProfileEditView 
              user={selectedUser} 
              isAdmin={true}
              onSave={(updatedData) => {
                console.log("Guardando cambios para:", updatedData);
                setShowUserEdit(false);
              }}
              onCancel={() => setShowUserEdit(false)} 
            />
          </div>
        </div>
      )}
      
      {/* Modal de creación de usuario */}
      {showCreateModal && (
        <CreateUserModal 
          onClose={() => setShowCreateModal(false)} 
          onSave={(userData) => {
            console.log("Usuario creado:", userData);
            setShowCreateModal(false);
          }} 
        />
      )}
      
      {/* Modal de confirmación de eliminación */}
      {showDeleteModal && userToDelete && (
        <DeleteUserModal 
          user={userToDelete} 
          onConfirm={confirmDelete} 
          onCancel={() => setShowDeleteModal(false)} 
        />
      )}
    </div>
  );
};