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
import { NotificationsDropdown } from '../../features/notifications/ui/NotificationsDropdown';

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
    <Dialog open={isOpen} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 z-10 bg-black/20" aria-hidden="true" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Header_logo {...logoProps} />
          <MobileMenuButton isOpen={isOpen} onClick={onClose} className="-m-2.5 rounded-md p-2.5 text-white" />
        </div>

        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            <div className="space-y-2 py-6">
              {!isAuthenticated ? (
                <>                  
                  <ItemsNavbar
                    link="/"
                    style="block text-white hover:text-gray-300 py-2 font-inter"
                    text="Inicio"
                    onClick={onClose}
                  />
                  <a
                    href="#nosotros"
                    className="block text-white hover:text-gray-300 py-2 font-inter"
                    onClick={onClose}
                  >
                    Acerca de nosotros
                  </a>
                  <a
                    href="#servicios"
                    className="block text-white hover:text-gray-300 py-2 font-inter"
                    onClick={onClose}
                  >
                    Servicios
                  </a>
                </>
              ) : (
                <>
                  <ItemsNavbar
                    link="/community"
                    style="block text-white hover:text-gray-300 py-2 font-inter"
                    text="Comunidad"
                    onClick={onClose}
                  />
                  <ItemsNavbar
                    link="/education"
                    style="block text-white hover:text-gray-300 py-2 font-inter"
                    text="Educación"
                    onClick={onClose}
                  />
                  <ItemsNavbar
                    link="/monitoring"
                    style="block text-white hover:text-gray-300 py-2 font-inter"
                    text="Monitoreo"
                    onClick={onClose}
                  />
                  {(isAdmin || isModerator) && (
                    <ItemsNavbar
                      link="/admin"
                      style="block text-white hover:text-gray-300 py-2 font-inter"
                      text="Administración"
                      onClick={onClose}
                    />
                  )}
                </>
              )}
            </div>

            <div className="space-y-2 py-6">
              {isAuthenticated ? (
                <>
                  <NotificationsDropdown />
                  <AuthNav />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left text-white hover:text-gray-300 py-2 font-poppins"
                  >
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
