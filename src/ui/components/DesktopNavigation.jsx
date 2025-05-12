import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ItemsNavbar } from "../components/ItemsNavbar";
import { DivButton_header } from "../components/DivButton_header";
import { AuthContext } from "../../features/authentication/context/AuthContext";
import { AuthNav } from "./AuthNav";
import { Storage } from '../../storage/Storage';

export const DesktopNavigation = () => {
  // Utilizamos el contexto de autenticación
  const { isAuthenticated, isAdmin, isModerator, logout } = useContext(AuthContext);
  
  // Hook para navegación
  const navigate = useNavigate();
  
  // Log para depuración
  useEffect(() => {
    console.log("Estado de autenticación:", {
      isAuthenticated,
      isAdmin,
      isModerator
    });
  }, [isAuthenticated, isAdmin, isModerator]);

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    // Si el contexto proporciona una función logout, la usamos
    if (typeof logout === 'function') {
      logout();
    } else {
      // De lo contrario, eliminamos tokens manualmente
      Storage.remove('authToken');
      Storage.remove('authUser');
    }
    
    // Redirigimos al inicio
    navigate('/');
    
    // Alternativa si useNavigate no funciona correctamente
    // window.location.href = '/';
  };

  return (
    <>
      {/* Si NO está autenticado */}
      {!isAuthenticated ? (
        <>
          <div className="hidden lg:flex lg:gap-x-12">
            <ItemsNavbar
              link="/"
              style="text-white hover:text-gray-300"
              text="Inicio"
            />

            <a href="#nosotros" className="text-white hover:text-gray-300">
              Acerca de nosotros
            </a>

            <a href="#servicios" className="text-white hover:text-gray-300">
              Servicios
            </a>
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
            <DivButton_header />
          </div>
        </>
      ) : (
        // Si ESTÁ autenticado
        <>
          <div className="hidden lg:flex lg:gap-x-12">
            <ItemsNavbar
              link="/community"
              style="text-white hover:text-gray-300"
              text="Comunidad"
            />
            <ItemsNavbar
              link="/education"
              style="text-white hover:text-gray-300"
              text="Educación"
            />

            {(isAdmin || isModerator) && (
              <ItemsNavbar
                link="/admin"
                style="text-white hover:text-gray-300"
                text="Administración"
              />
            )}
          </div>
          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
            <AuthNav />
            
            {/* Botón de cierre de sesión */}
            <button 
              onClick={handleLogout}
              className="text-white hover:text-gray-300 ml-4"
            >
              Cerrar sesión
            </button>
          </div>
        </>
      )}
    </>
  );
};