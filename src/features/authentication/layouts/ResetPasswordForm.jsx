import { RiLockPasswordLine, RiArrowLeftLine } from 'react-icons/ri';
import { FormButton } from '../../../ui/components/FormButton';
import { FormLink } from '../../../ui/components/FormLink';
import { PasswordInput } from '../ui/PasswordInput';
import DivInput from '../../../ui/components/DivInput';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';

/**
 * Layout de formulario de reinicio de contraseña
 * 
 * @returns {JSX.Element} Componente de formulario
 */
export const ResetPasswordForm = () => {
  // Utilizamos el hook personalizado para la lógica del formulario
  const {
    form,
    success,
    error,
    handleChange,
    handleSubmit
  } = useResetPasswordForm();

  return (
    <>
      {success ? (
        <div className="text-center">
          <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            {success}
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Serás redirigido a la página de inicio de sesión...
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 mb-4">
            Ingresa tu nueva contraseña.
          </p>
          
          {/* Campo de token (oculto si viene en la URL) */}
          {!form.token && (
            <div className="relative">
              <DivInput
                name="token"
                type="text"
                icon={<RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
                value={form.token}
                placeholder="Token de recuperación"
                required
                handleChange={handleChange}
              />
            </div>
          )}
          
          {/* Campo de nueva contraseña */}
          <PasswordInput
            name="newPassword"
            value={form.newPassword}
            placeholder="Nueva contraseña"
            onChange={handleChange}
          />
          
          {/* Campo de confirmación de contraseña */}
          <PasswordInput
            name="confirmPassword"
            value={form.confirmPassword}
            placeholder="Confirmar contraseña"
            onChange={handleChange}
          />
          
          {/* Botón de envío */}
          <FormButton 
            text="Actualizar Contraseña" 
          />
          
          {/* Enlace a login */}
          <FormLink 
            text="Volver a" 
            linkText="Iniciar Sesión" 
            to="/login" 
            icon={<RiArrowLeftLine />} 
          />
        </form>
      )}
    </>
  );
};