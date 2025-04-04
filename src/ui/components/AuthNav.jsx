import { useState, useContext } from "react";

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
    <div className="relative">
      {/* Si el usuario NO está autenticado */}
      {!authToken ? (
        <div className="md:flex gap-4 hidden">
          {/* Opciones visibles en pantallas medianas o más grandes */}
          <ItemsNavbar link="/login" style="text-white" text="Login" />
          <ItemsNavbar link="/register" style="text-white" text="Register" />
        </div>
      ) : (
        // Si está autenticado, muestra el menú con su email
        <div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-md shadow-md hover:bg-gray-100 transition"
          >
            {user?.email} {/* Muestra el email del usuario */}
            <FiMenu size={20} />
          </button>

          {/* Menú desplegable */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white text-gray-800 shadow-lg rounded-md">
              <ItemsNavbar link="/create-password" style="block px-4 py-2 hover:bg-gray-100" text="Crear contraseña" />
              <ItemsNavbar link="/edit-password/:id" style="block px-4 py-2 hover:bg-gray-100" text="Cambiar" />

              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}

      {/* Ícono para pantallas pequeñas */}
      {!authToken && (
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 bg-white text-blue-600 px-3 py-2 rounded-md shadow-md hover:bg-gray-100 transition"
          >
            <FiMenu size={20} />
          </button>

          {/* Menú desplegable */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-secondary text-white shadow-lg rounded-md">
              <ItemsNavbar link="/login" style="block px-4 py-2 hover:bg-gray-100 text-white" text="Login" />
              <ItemsNavbar link="/register" style="block px-4 py-2 hover:bg-gray-100 text-white" text="Register" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

