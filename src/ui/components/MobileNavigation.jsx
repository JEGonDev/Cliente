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


export const MobileNavigation = ({ isOpen, onClose, logoProps }) => {
  // Utilizamos el contexto de autenticación
  const { isAuthenticated, isAdmin, isModerator, logout } = useContext(AuthContext);
  
  // Hook para navegación
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    if (typeof logout === 'function') {
      logout();
    } else {
      Storage.remove('authToken');
      Storage.remove('authUser');
    }
    
    navigate('/');
    onClose(); // Cerrar el menú móvil después de cerrar sesión
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="lg:hidden">
      <div className="fixed inset-0 z-10 bg-black/20" aria-hidden="true" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-20 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <Header_logo filePath={logoProps.filePath} alt={logoProps.alt} />
          <MobileMenuButton isOpen={true} onClick={onClose} className="-m-2.5 rounded-md p-2.5 text-white" />
        </div>
        
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            {/* Elementos de navegación basados en el estado de autenticación */}
            <div className="space-y-2 py-6">
              {!isAuthenticated ? (
                <>
                  {/* Usuario NO autenticado */}
                  <ItemsNavbar 
                    link="/"
                    style="block text-white hover:text-gray-300 py-2"
                    text="Inicio"
                  />
                  
                  <a 
                    href="#nosotros" 
                    className="block text-white hover:text-gray-300 py-2"
                    onClick={() => onClose()}
                  >
                    Acerca de nosotros
                  </a>
                  
                  <a 
                    href="#servicios" 
                    className="block text-white hover:text-gray-300 py-2"
                    onClick={() => onClose()}
                  >
                    Servicios
                  </a>
                </>
              ) : (
                <>
                  {/* Usuario autenticado */}
                  <ItemsNavbar 
                    link="/community"
                    style="block text-white hover:text-gray-300 py-2"
                    text="Comunidad"
                  />
                  
                  <ItemsNavbar 
                    link="/education"
                    style="block text-white hover:text-gray-300 py-2"
                    text="Educación"
                  />
                  
                  {/* Enlaces para administradores/moderadores */}
                  {(isAdmin || isModerator) && (
                    <ItemsNavbar 
                      link="/admin"
                      style="block text-white hover:text-gray-300 py-2"
                      text="Administración"
                    />
                  )}
                  
                  {/* Botón de cierre de sesión */}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left text-white hover:text-gray-300 py-2"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>

            {/* Sección inferior - Autenticación o DivButton_header */}
            <div className="space-y-2 py-6">
              {!isAuthenticated ? (
                // Si no está autenticado, mostrar DivButton_header
                <DivButton_header />
              ) : (
                // Si está autenticado, mostrar AuthNav
                <div className="mt-2 text-left">
                  <AuthNav />
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};


// import React from 'react';
// import { Dialog, DialogPanel } from '@headlessui/react';
// import { ItemsNavbar } from '../components/ItemsNavbar';
// import { AuthNav } from '../components/AuthNav';
// import { Header_logo } from '../components/Header_logo';
// import { MobileMenuButton } from './MobileMenuButton';
// import { DivButton_header } from './DivButton_header';

// export const MobileNavigation = ({ isOpen, onClose, logoProps }) => {
//   return (
//     <Dialog open={isOpen} onClose={onClose} className="lg:hidden">
//       <div className="fixed inset-0 z-10" />
//       <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
//         <div className="flex items-center justify-between">
//           <Header_logo filePath={logoProps.filePath} alt={logoProps.alt} />
//           <MobileMenuButton isOpen={true} onClick={onClose} className="-m-2.5 rounded-md p-2.5" />
//         </div>
//         <div className="mt-6 flow-root">
//           <div className="-my-6 divide-y divide-secondary">
//             <div className="space-y-2 py-6">
//               <ItemsNavbar link="/" style="text-white" text="Inicio" />
//               {/* Aquí puedes agregar más elementos de navegación según sea necesario */}
//             </div>

//             <div className="py-6">
//               <DivButton_header />
//             </div>
//           </div>
//         </div>
//       </DialogPanel>
//     </Dialog>
//   );
// };