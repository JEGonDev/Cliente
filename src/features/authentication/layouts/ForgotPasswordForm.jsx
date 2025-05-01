import { RiMailLockLine, RiArrowLeftLine } from 'react-icons/ri';
import { FormButton } from '../../../ui/components/FormButton';
import { FormLink } from '../../../ui/components/FormLink';
import DivInput from '../../../ui/components/DivInput';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

/**
 * Layout de formulario de recuperación de contraseña
 * 
 * @returns {JSX.Element} Componente de formulario
 */
export const ForgotPasswordForm = () => {
  // Utilizamos el hook personalizado para la lógica del formulario
  const {
    email,
    success,
    error,
    handleChange,
    handleSubmit
  } = useForgotPasswordForm();

  return (
    <>
      {success ? (
        <div className="text-center">
          <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            {success}
          </div>
          <FormLink 
            text="Volver a" 
            linkText="Iniciar Sesión" 
            to="/login" 
            icon={<RiArrowLeftLine />} 
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <p className="text-sm text-gray-600 mb-4">
            Introduce tu dirección de email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          
          {/* Campo de email */}
          <div className="relative">
            <DivInput
              name="email"
              type="email"
              icon={<RiMailLockLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
              value={email}
              placeholder="Email"
              required
              handleChange={handleChange}
            />
          </div>
          
          {/* Botón de envío */}
          <FormButton 
            text="Recuperar Contraseña" 
          />
          
          {/* Enlace a login */}
          <FormLink 
            text="Recordaste tu contraseña?" 
            linkText="Iniciar Sesión" 
            to="/login" 
            icon={<RiArrowLeftLine />} 
          />
        </form>
      )}
    </>
  );
};