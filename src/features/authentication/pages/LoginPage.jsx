import { Link } from 'react-router-dom';
import DivInput from '../../../ui/components/DivInput';
import { useLoginForm } from '../../../features/authentication/hooks/useLoginForm';
import { 
  RiUserLine, 
  RiEyeLine, 
  RiEyeOffLine, 
  RiLockPasswordLine, 
  RiDoorOpenLine, 
  RiUserAddFill 
} from 'react-icons/ri';

/**
 * Componente de página de login
 * Utiliza el custom hook useLoginForm para manejar toda la lógica
 * y se enfoca principalmente en la presentación (UI)
 */
export const LoginPage = () => {
  // Extraemos todos los estados y métodos del hook
  const {
    credentials,
    showPassword,
    error,
    setShowPassword,
    handleChange,
    handleSubmit
  } = useLoginForm();

  return (
    <div className="p-6 max-w-sm mx-auto bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h2>
      
      {/* Muestra mensajes de error si existen */}
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      
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
        
        {/* Campo de contraseña con botón para mostrar/ocultar */}
        <div className="relative">
          <DivInput
            name="password"
            type={showPassword ? 'text' : 'password'}
            icon={<RiLockPasswordLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />}
            value={credentials.password}
            placeholder="Contraseña"
            required
            handleChange={handleChange}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
          </button>
        </div>
        
        {/* Botón de envío */}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
        >
          <RiDoorOpenLine className="text-lg" />
          Iniciar Sesión
        </button>
      </form>
      
      {/* Enlace a registro */}
      <p className="text-center text-sm mt-4">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="text-primary font-semibold hover:text-secondary inline-flex items-center gap-1">
          <RiUserAddFill /> Regístrate
        </Link>
      </p>
    </div>
  );
};