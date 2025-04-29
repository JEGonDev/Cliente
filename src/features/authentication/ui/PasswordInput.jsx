import { useState } from 'react';
import { RiLockPasswordLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import DivInput from '../../../ui/components/DivInput';

/**
 * Campo de contraseña con botón para mostrar/ocultar
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.name - Nombre del campo
 * @param {string} props.value - Valor del campo
 * @param {string} props.placeholder - Placeholder del campo
 * @param {Function} props.onChange - Función para manejar cambios
 * @param {boolean} props.required - Indica si el campo es requerido
 */
export const PasswordInput = ({ 
  name, 
  value, 
  placeholder = 'Contraseña', 
  onChange, 
  required = true 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <DivInput
        name={name}
        type={showPassword ? 'text' : 'password'}
        icon={<RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
        value={value}
        placeholder={placeholder}
        required={required}
        handleChange={onChange}
      />
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
      </button>
    </div>
  );
};