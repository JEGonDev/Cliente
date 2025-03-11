import React from 'react'
import { Storage } from '../../storage/Storage'
import { Navigate, Outlet } from 'react-router-dom';

export const ProtectedRoutes = ({ children}) => {
    const authUser = Storage.get('authUser');
  if (!authUser) {
    return <Navigate to='/login' />
  }
  return <Outlet />
}
