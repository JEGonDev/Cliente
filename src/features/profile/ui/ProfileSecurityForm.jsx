import { useState } from 'react';
import { RiLockPasswordLine, RiShieldCheckLine } from 'react-icons/ri';
import { PasswordInput } from '../../authentication/ui/PasswordInput';
import { FormButton } from '../../../ui/components/FormButton';

/**
 * Formulario para cambiar la contraseña del usuario
 * 
 * @returns {JSX.Element} Formulario de cambio de contraseña
 */
export const ProfileSecurityForm = () => {
  // Estado para manejar los datos del formulario (sin lógica por ahora)
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Manejador de cambios de campos (sin lógica real por ahora)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Manejador de envío del formulario (sin lógica real por ahora)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos
    alert('Contraseña actualizada correctamente');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Cambiar Contraseña</h2>
      
      {/* Campo de contraseña actual */}
      <PasswordInput
        name="currentPassword"
        value={form.currentPassword}
        placeholder="Contraseña actual"
        onChange={handleChange}
      />
      
      {/* Campo de nueva contraseña */}
      <PasswordInput
        name="newPassword"
        value={form.newPassword}
        placeholder="Nueva contraseña"
        onChange={handleChange}
      />
      
      {/* Campo de confirmar contraseña */}
      <PasswordInput
        name="confirmPassword"
        value={form.confirmPassword}
        placeholder="Confirmar nueva contraseña"
        onChange={handleChange}
      />
      
      {/* Requisitos de contraseña */}
      <div className="bg-gray-50 p-4 rounded-md">
        <p className="text-sm font-medium text-gray-700 mb-2">La contraseña debe:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li className="flex items-center">
            <span className="w-4 h-4 inline-flex items-center justify-center bg-green-100 text-green-500 rounded-full mr-2">✓</span>
            Tener al menos 8 caracteres
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 inline-flex items-center justify-center bg-green-100 text-green-500 rounded-full mr-2">✓</span>
            Incluir al menos una letra mayúscula
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 inline-flex items-center justify-center bg-gray-100 text-gray-400 rounded-full mr-2">·</span>
            Incluir al menos un número
          </li>
          <li className="flex items-center">
            <span className="w-4 h-4 inline-flex items-center justify-center bg-gray-100 text-gray-400 rounded-full mr-2">·</span>
            Incluir al menos un caracter especial
          </li>
        </ul>
      </div>
      
      {/* Configuración de seguridad adicional */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-medium mb-4">Verificación en dos pasos</h3>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="two-factor"
              name="twoFactor"
              type="checkbox"
              className="h-4 w-4 text-primary border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="two-factor" className="font-medium text-gray-700">Activar verificación en dos pasos</label>
            <p className="text-gray-500">Recibir un código de verificación por SMS cada vez que inicies sesión.</p>
          </div>
        </div>
      </div>
      
      {/* Botón de envío */}
      <div className="flex justify-end">
        <FormButton 
          text="Actualizar Seguridad" 
          icon={<RiShieldCheckLine className="text-lg" />} 
          type="submit"
        />
      </div>
    </form>
  );
};