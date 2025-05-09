// src/features/profile/ui/ProfileEditView.jsx

import { useState } from 'react';
import { User, Mail, Phone, Home, Calendar, Lock, X, Save, Eye, EyeOff } from 'lucide-react';
import { ProfileRoleSelector } from './ProfileRoleSelector';

/**
 * Componente reutilizable para editar perfiles
 * Se usa tanto para que un usuario edite su propio perfil como para que admin edite otros perfiles
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Datos del usuario a editar
 * @param {Function} props.onSave - Función para guardar cambios
 * @param {Function} props.onCancel - Función para cancelar edición
 * @param {boolean} props.isAdmin - Indica si quien edita es admin (para mostrar campos adicionales)
 */
export const ProfileEditView = ({ user, onSave, onCancel, isAdmin = false }) => {
  // Estado para almacenar los datos del formulario
  const [form, setForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    birthDate: user?.birthDate || '',
    password: '',
    confirmPassword: '',
    role: user?.role || 'Usuario',
    status: user?.status || 'Activo'
  });
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false
  });
  
  // Estado para determinar si se está cambiando la contraseña
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };
  
  // Función para alternar visibilidad de contraseña
  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 border-b flex justify-between items-center bg-green-700 text-white">
        <h2 className="text-xl font-bold">
          {isAdmin 
            ? `Editar Usuario: ${user?.firstName} ${user?.lastName}`
            : 'Editar Perfil'
          }
        </h2>
        <button 
          onClick={onCancel}
          className="text-white hover:text-gray-200"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 sm:p-6">
        {/* Sección de información personal */}
        <div className="mb-6 border-b pb-6">
          <h3 className="text-lg font-medium mb-4">Información Personal</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            {/* Nombre */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Nombre"
                  required
                />
              </div>
            </div>
            
            {/* Apellido */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </span>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                  placeholder="Apellido"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </span>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          </div>
          
          {/* Teléfono */}
          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone size={16} className="text-gray-400" />
              </span>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="+57 300 123 4567"
              />
            </div>
          </div>
          
          {/* Dirección */}
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Home size={16} className="text-gray-400" />
              </span>
              <input
                type="text"
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="Dirección completa"
              />
            </div>
          </div>
          
          {/* Fecha de nacimiento */}
          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de Nacimiento
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={16} className="text-gray-400" />
              </span>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={form.birthDate}
                onChange={handleChange}
                className="pl-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
        
        {/* Sección de cambio de contraseña */}
        <div className="mb-6 border-b pb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Contraseña</h3>
            <button
              type="button"
              onClick={() => setChangingPassword(!changingPassword)}
              className="text-sm text-green-700 hover:text-green-800"
            >
              {changingPassword ? 'Cancelar cambio' : 'Cambiar contraseña'}
            </button>
          </div>
          
          {changingPassword && (
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </span>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPassword.new ? (
                      <EyeOff size={16} className="text-gray-400" />
                    ) : (
                      <Eye size={16} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={16} className="text-gray-400" />
                  </span>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="pl-10 pr-10 w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  La contraseña debe tener al menos 8 caracteres y contener letras, números y caracteres especiales.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Sección de rol (solo para admin) */}
        {isAdmin && (
          <div className="mb-6 border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Configuración del Usuario</h3>
            <ProfileRoleSelector 
              selectedRole={form.role}
              selectedStatus={form.status}
              onRoleChange={(role) => setForm({...form, role})}
              onStatusChange={(status) => setForm({...form, status})}
            />
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800 flex items-center"
          >
            <Save size={16} className="mr-2" />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
};