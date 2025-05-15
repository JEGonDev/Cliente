import { RiUserLine, RiDoorOpenLine, RiUserAddFill } from 'react-icons/ri';
import DivInput from '../../../ui/components/DivInput';
import { FormButton } from '../../../ui/components/FormButton';
import { FormLink } from '../../../ui/components/FormLink';
import { PasswordInput } from '../ui/PasswordInput';
import { useLoginForm } from '../hooks/useLoginForm';
import { Link } from 'react-router-dom';
import { AlertError } from '../ui/AlertError';

/**
 * Layout de formulario de login que utiliza el custom hook para su lógica
 * y muestra errores de autenticación
 * 
 * @returns {JSX.Element} Componente de formulario de login
 */
export const LoginForm = () => {
  // Utilizamos el hook personalizado para la lógica del formulario
  const {
    credentials,
    error,
    handleChange,
    handleSubmit
  } = useLoginForm();

  return (
    <>
      {/* Mostrar alerta de error si existe */}
      <AlertError message={error} show={!!error} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campo de usuario */}
        <div className="relative">
          <DivInput
            name="username"
            type="text"
            icon={<RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            value={credentials.username}
            placeholder="Usuario"
            required
            handleChange={handleChange}
          />
        </div>
        
        {/* Campo de contraseña con visibilidad toggle */}
        <PasswordInput
          name="password"
          value={credentials.password}
          onChange={handleChange}
        />
        
        {/* Botón de envío */}
        <FormButton 
          text="Iniciar Sesión" 
          icon={<RiDoorOpenLine className="text-lg" />} 
        />

        <div className="text-center mt-2">
          <Link to="/forgot-password" className="text-sm text-primary hover:text-secondary">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </form>
      
      {/* Enlace a registro */}
      <FormLink 
        text="¿No tienes cuenta?" 
        linkText="Regístrate" 
        to="/register" 
        icon={<RiUserAddFill />} 
      />
    </>
  );
};