import React, { useContext } from 'react';
import { Dialog } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { ItemsNavbar } from '../components/ItemsNavbar';
import { AuthNav } from '../components/AuthNav';
import { Header_logo } from '../components/Header_logo';
import { MobileMenuButton } from './MobileMenuButton';
import { DivButton_header } from '../components/DivButton_header';
import { AuthContext } from '../../features/authentication/context/AuthContext';
import { Storage } from '../../storage/Storage';
import { NotificationsDropdown } from '../../features/notifications/ui/NotificationsDropdown'; // Importar el componente

export const MobileNavigation = ({ isOpen, onClose, logoProps }) => {
  const { isAuthenticated, isAdmin, isModerator, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
    } else {
      Storage.remove('authToken');
      Storage.remove('authUser');
    }
    navigate('/');
    onClose();
  };

  return (
    <Dialog as="div" className="lg:hidden" open={isOpen} onClose={onClose}>
      <div className="fixed inset-0 z-10" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Header_logo {...logoProps} />
          <MobileMenuButton isOpen={isOpen} onClick={onClose} />
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              <ItemsNavbar to="/" onClick={onClose}>Inicio</ItemsNavbar>
              {isAuthenticated ? (
                <>
                  <ItemsNavbar to="/education" onClick={onClose}>Educación</ItemsNavbar>
                  <ItemsNavbar to="/community" onClick={onClose}>Comunidad</ItemsNavbar>
                  <ItemsNavbar to="/monitoring" onClick={onClose}>Monitoreo</ItemsNavbar>
                  {(isAdmin || isModerator) && (
                    <ItemsNavbar to="/admin" onClick={onClose}>Admin</ItemsNavbar>
                  )}
                </>
              ) : (
                <>
                  <ItemsNavbar to="/about" onClick={onClose}>Acerca de nosotros</ItemsNavbar>
                  <ItemsNavbar to="/services" onClick={onClose}>Servicios</ItemsNavbar>
                </>
              )}
            </div>
            <div className="py-6">
              {isAuthenticated ? (
                <>
                  <NotificationsDropdown /> {/* Integrado aquí */}
                  <AuthNav />
                  <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-base font-medium text-white">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <DivButton_header />
              )}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};