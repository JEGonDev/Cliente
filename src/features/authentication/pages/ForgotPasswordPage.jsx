import { AuthFormCard } from '../../../ui/components/AuthFormCard';
import { ForgotPasswordForm } from '../layouts/ForgotPasswordForm';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';
import { Header } from '../../../ui/layouts/Header';

/**
 * Página de recuperación de contraseña
 * 
 * @returns {JSX.Element} Página completa
 */
export const ForgotPasswordPage = () => {
  // Solo necesitamos el estado de error del hook
  const { error } = useForgotPasswordForm();

  return (
    <>
    <Header />
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <AuthFormCard 
        title="Recuperación de Contraseña" 
        error={error}
        className="max-w-md w-full"
      >
        <ForgotPasswordForm />
      </AuthFormCard>
    </div>
    </>
  );
};