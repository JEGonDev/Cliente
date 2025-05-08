import { useState } from 'react';
import { 
  RiUserLine, 
  RiMailLine, 
  RiPhoneLine, 
  RiHome4Line, 
  RiCalendarLine,
  RiSaveLine,
  RiArrowGoBackLine
} from 'react-icons/ri';
import DivInput from '../../../ui/components/DivInput';
import { FormButton } from '../../../ui/components/FormButton';

/**
 * Formulario para editar la información personal del usuario
 * 
 * @returns {JSX.Element} Formulario de información personal
 */
export const ProfileForm = () => {
  // Estado para manejar los datos del formulario (sin lógica por ahora)
  const [form, setForm] = useState({
    firstName: 'Juan',
    lastName: 'Pérez',
    email: 'juan.perez@example.com',
    phone: '+57 300 123 4567',
    address: 'Calle 10 #15-23, Pereira, Risaralda',
    birthDate: '1990-05-15'
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
    alert('Cambios guardados correctamente');
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Sección de información personal */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold mb-4">Información Personal</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campo de nombre */}
          <div className="relative">
            <DivInput
              name="firstName"
              type="text"
              icon={<RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              value={form.firstName}
              placeholder="Nombre"
              required
              handleChange={handleChange}
            />
          </div>
          
          {/* Campo de apellido */}
          <div className="relative">
            <DivInput
              name="lastName"
              type="text"
              icon={<RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              value={form.lastName}
              placeholder="Apellido"
              required
              handleChange={handleChange}
            />
          </div>
          
          {/* Campo de email */}
          <div className="relative">
            <DivInput
              name="email"
              type="email"
              icon={<RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              value={form.email}
              placeholder="Email"
              required
              handleChange={handleChange}
            />
          </div>
          
          {/* Campo de teléfono */}
          <div className="relative">
            <DivInput
              name="phone"
              type="tel"
              icon={<RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              value={form.phone}
              placeholder="Teléfono"
              handleChange={handleChange}
            />
          </div>
          
          {/* Campo de fecha de nacimiento */}
          <div className="relative">
            <DivInput
              name="birthDate"
              type="date"
              icon={<RiCalendarLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              value={form.birthDate}
              placeholder="Fecha de nacimiento"
              handleChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Sección de dirección */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold mb-4">Dirección</h2>
        
        <div className="relative">
          <DivInput
            name="address"
            type="text"
            icon={<RiHome4Line className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            value={form.address}
            placeholder="Dirección completa"
            handleChange={handleChange}
          />
        </div>
      </div>
      
      {/* Sección de imagen de perfil */}
      <div className="border-b border-gray-200 pb-6">
        <h2 className="text-lg font-semibold mb-4">Imagen de Perfil</h2>
        
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden">
            {/* Aquí iría la imagen del perfil */}
            <img 
              src="/api/placeholder/120/120" 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          
          <div>
            <label 
              htmlFor="avatar-upload" 
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
            >
              Cambiar imagen
            </label>
            <input 
              id="avatar-upload" 
              type="file" 
              className="hidden" 
              accept="image/*" 
            />
            <p className="text-xs text-gray-500 mt-2">
              Formatos permitidos: JPG, PNG. Máximo 2MB.
            </p>
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex justify-end space-x-4">
        <button 
          type="button" 
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          <RiArrowGoBackLine className="mr-2" />
          Cancelar
        </button>
        
        <FormButton 
          text="Guardar Cambios" 
          icon={<RiSaveLine className="text-lg" />} 
          type="submit"
        />
      </div>
    </form>
  );
};