import { AuthFormCard } from '../../../ui/components/AuthFormCard';
import { LoginForm } from '../../authentication/layouts/LoginForm';
import { useLoginForm } from '../hooks/useLoginForm';

/**
 * Página de login que integra el layout del formulario dentro de un contenedor
 * 
 * @returns {JSX.Element} Página completa de login
 */
export const LoginPage = () => {
  // Solo necesitamos el estado de error del hook
  const { error } = useLoginForm();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <AuthFormCard 
        title="Iniciar Sesión" 
        error={error}
        className="max-w-sm w-full"
      >
        <LoginForm />
      </AuthFormCard>
    </div>
  );
};