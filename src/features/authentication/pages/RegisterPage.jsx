import { AuthFormCard } from '../../../ui/components/AuthFormCard';
// import { Header } from '../../../ui/layouts/Header';
import { RegisterForm } from '../../authentication/layouts/RegisterForm';
import { useRegisterForm } from '../hooks/useRegisterForm';

/**
 * Página de registro que integra el layout del formulario dentro de un contenedor
 * 
 * @returns {JSX.Element} Página completa de registro
 */
export const RegisterPage = () => {
  // Solo necesitamos el estado de error del hook
  const { error } = useRegisterForm();

  return (
    <>
    {/* <Header /> */}
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <AuthFormCard 
        title="Registro de Usuario" 
        error={error}
        className="max-w-md w-full"
      >
        <RegisterForm />
      </AuthFormCard>
    </div>
    </>
  );
};