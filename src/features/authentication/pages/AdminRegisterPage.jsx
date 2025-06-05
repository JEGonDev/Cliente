import React from 'react'
import { AuthFormCard } from '../../../ui/components/AuthFormCard';
import { AdminRegisterForm } from '../layouts/AdminRegisterForm';

/**
 * Página de registro de administrador que integra el layout del formulario dentro de un contenedor
 * 
 * @returns {JSX.Element} Página completa de registro de administrador
 */

export const AdminRegisterPage = () => {
  return (
     <>
        {/* <Header /> */}
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <AuthFormCard 
            title="Registro de Administrador" 
            className="max-w-md w-full"
          >
            <AdminRegisterForm />
            
          </AuthFormCard>
        </div>
        </>
  )
}
