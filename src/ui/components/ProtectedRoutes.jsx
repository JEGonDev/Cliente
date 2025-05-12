import { useContext, useEffect, useState } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { AuthContext } from '../../features/authentication/context/AuthContext';

export const ProtectedRoutes = ({ requiredRoles = [] }) => {
  const { user, isAuthenticated, hasRole, loading, refreshAuth } = useContext(AuthContext);
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(true);

  // Efecto para verificar la autenticación al montar el componente
  useEffect(() => {
    const verifyAuth = async () => {
      if (!isAuthenticated) {
        await refreshAuth();
      }
      setIsVerifying(false);
    };
    
    verifyAuth();
  }, [isAuthenticated, refreshAuth]);

  // Mientras se verifica la autenticación o se está cargando
  if (loading || isVerifying) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay roles requeridos, verificar
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.some(role => hasRole(role));
    if (!hasRequiredRole) {
      return <Navigate to="/access-denied" replace />;
    }
  }

  return <Outlet />;
};