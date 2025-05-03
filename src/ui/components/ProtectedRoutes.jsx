import { Storage } from '../../storage/Storage';
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoutes = () => {
  const authUser = Storage.get('authUser');

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
