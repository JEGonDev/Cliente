import { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../features/authentication/context/AuthContext';

/**
 * Componente para proteger rutas que requieren autenticación.
 * Redirecciona a la página de login si el usuario no está autenticado.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes a renderizar si está autenticado
 * @param {Array<string>} props.requiredRoles - Roles requeridos para acceder (opcional)
 * @param {string} props.redirectTo - Ruta a la que redireccionar si no está autenticado
 */
export const ProtectedRoutes = ({ 
  children, 
  requiredRoles = [], 
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, hasRole, loading, refreshAuth } = useContext(AuthContext);
  const location = useLocation();

  // Si estamos cargando, muestra un indicador
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si se especifican roles requeridos, verificar que el usuario tenga al menos uno
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      // No tiene el rol necesario, redirigir a una página de acceso denegado
      return <Navigate to="/access-denied" replace />;
    }
  }

  // Usuario autenticado y con los roles necesarios, mostrar el contenido protegido
  return children;
};