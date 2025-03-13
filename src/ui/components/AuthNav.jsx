import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { AuthContext } from "../context/AuthContext";

 export const AuthNav = () => {
  const { user, handleLogout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative">
      {/* Si el usuario NO está autenticado, muestra los enlaces de Login y Register */}
      {!user ? (
        <nav className="flex gap-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/register" className="hover:underline">Register</Link>
        </nav>
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
              <Link to="/create-password" className="block px-4 py-2 hover:bg-gray-100">Crear contraseña</Link>
              <Link to="/edit-password/:id" className="block px-4 py-2 hover:bg-gray-100">Cambiar</Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-red-500 hover:text-white"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

