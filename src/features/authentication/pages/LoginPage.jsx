import { AuthFormCard } from "../../../ui/components/AuthFormCard";
// import { Header } from "../../../ui/layouts/Header";
import { LoginForm } from "../../authentication/layouts/LoginForm";

/**
 * Página de login que integra el layout del formulario dentro de un contenedor
 *
 * @returns {JSX.Element} Página completa de login
 */
export const LoginPage = () => {
  return (
    <>
      {/* <Header /> */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <AuthFormCard
          title="Iniciar Sesión"
          className="max-w-sm w-full"
        >
          <LoginForm />
        </AuthFormCard>
      </div>
    </>
  );
};