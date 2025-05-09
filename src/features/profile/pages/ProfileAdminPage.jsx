// src/features/profile/pages/ProfileAdminPage.jsx

import { Header } from '../../../ui/layouts/Header';
import { ProfileLayout } from '../layouts/ProfileLayout';
import { ProfileAdminList } from '../ui/ProfileAdminList';

/**
 * Página de administración de perfiles para administradores
 * Muestra la lista de usuarios del sistema con opciones para gestionar sus perfiles
 * 
 * @returns {JSX.Element} Página completa de administración de perfiles
 */
export const ProfileAdminPage = () => {
  return (
    <>
      <Header />
      <ProfileLayout 
        title="Administración de Perfiles"
        description="Gestiona los perfiles de usuarios en el sistema"
      >
        <ProfileAdminList />
      </ProfileLayout>
    </>
  );
};