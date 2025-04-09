import { useState, useContext } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'

import { FiMenu } from "react-icons/fi";
import { ItemsNavbar } from './ItemsNavbar';
import Storage from '../../storage/Storage';
import { useNavigate } from 'react-router-dom';

export const AuthNav = () => {
  const authToken = Storage.get('authToken');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = {
    "data": {
      "id": 2,
      "email": "janet.weaver@reqres.in",
      "first_name": "Janet",
      "last_name": "Weaver",
      "avatar": "https://reqres.in/img/faces/2-image.jpg"
    },
    "support": {
      "url": "https://contentcaddy.io?utm_source=reqres&utm_medium=json&utm_campaign=referral",
      "text": "Tired of writing endless social media content? Let Content Caddy generate it for you."
    }
  };
  const go = useNavigate();
  const logout = async () => {
    Storage.remove('authToken');
    Storage.remove('authUser');
    go('/');
  };

  return (

    <div >
      {/* Si el usuario NO está autenticado */}
      {!authToken ? (
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
          <ItemsNavbar link='/login' style='text-white' text='Iniciar sesion' />
          <ItemsNavbar link="/register" style="text-white" text="Registrarse" />
        </div>
      ) : (
        // Si está autenticado, muestra el menú con su email
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          <button
            type="button"
            className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
          >
            <span className="absolute -inset-1.5" />
            <span className="sr-only">View notifications</span>
            <BellIcon aria-hidden="true" className="size-6" />
          </button>

          {/* Profile dropdown */}
          <Menu as="div" className="relative ml-3">
            <div>
              <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                <span className="absolute -inset-1.5" />
                <span className="sr-only">Open user menu</span>
                <img
                  alt=""
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full"
                />
              </MenuButton>
            </div>
            <MenuItems
              transition
              className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Your Profile
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Settings
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  href="#"
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:outline-hidden"
                >
                  Sign out
                </a>
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      )}


    </div>
    // <div className="relative">
    //   {/* Si el usuario NO está autenticado */}
    //   {!authToken ? (
    //     <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
    //       <ItemsNavbar link='/login' style='text-white' text='Iniciar sesion' />
    //       <ItemsNavbar link="/register" style="text-white" text="Registrarse" />
    //     </div>
    //   ) : (
    //     // Si está autenticado, muestra el menú con su email
    //     <div>
    //       <button
    //         onClick={() => setIsMenuOpen(!isMenuOpen)}
    //         className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-md shadow-md hover:bg-gray-100 transition"
    //       >
    //         {user?.email} {/* Muestra el email del usuario */}
    //         <FiMenu size={20} />
    //       </button>

    //       {/* Menú desplegable */}
    //       {isMenuOpen && (
    //         <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-md">
    //           <ItemsNavbar link="/create-password" style="block px-4 py-2 hover:bg-gray-100" text="Crear contraseña" />
    //           <ItemsNavbar link="/edit-password/:id" style="block px-4 py-2 hover:bg-gray-100" text="Cambiar" />

    //           <button
    //             onClick={logout}
    //             className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white"
    //           >
    //             Logout
    //           </button>
    //         </div>
    //       )}
    //     </div>
    //   )}

    //   {/* Ícono para pantallas pequeñas */}
    //   {!authToken && (
    //     <div className="md:hidden">
    //       <button
    //         onClick={() => setIsMenuOpen(!isMenuOpen)}
    //         className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-md shadow-md hover:bg-gray-100 transition"
    //       >
    //         <FiMenu size={20} />
    //       </button>

    //       {/* Menú desplegable */}
    //       {isMenuOpen && (
    //         <div className="absolute right-0 mt-2 w-40 bg-secondary text-white shadow-lg rounded-md">
    //           <ItemsNavbar link="/login" style="block px-4 py-2 hover:bg-gray-100 text-white" text="Login" />
    //           <ItemsNavbar link="/register" style="block px-4 py-2 hover:bg-gray-100 text-white" text="Register" />
    //         </div>
    //       )}
    //     </div>
    //   )}
    // </div>
  );
};

