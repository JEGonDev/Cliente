import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Layers, MessageSquare, FileText } from "lucide-react";

/**
 * Barra de navegación lateral para el módulo de comunidad,
 * con enlaces a favoritos, grupos, hilos y publicaciones del usuario.
 */
export const Navbar_layout = ({ activeSection }) => {
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div
      className={`w-full md:w-64 bg-white border-r border-gray-200 flex flex-col p-4 ${
        isNavOpen ? "block" : "hidden"
      } md:block`}
    >
      {/* Enlace a Favoritos */}
      <div className="mb-4">
        <h2 className="text-red-500 font-medium text-sm mb-2">Favoritos</h2>
        <ul className="space-y-2">
          <li
            className={`flex items-center text-sm cursor-pointer ${
              activeSection === "favorites" ? "text-green-600 font-medium" : "text-gray-700"
            }`}
            onClick={() => navigate("/comunity/favorites")}
          >
            <Star className="w-4 h-4 mr-2" />
            Favoritos
          </li>
        </ul>
      </div>

      {/* Mis Contenidos */}
      <div className="mb-4">
        <h2 className="text-gray-700 font-medium text-sm mb-2">Mis contenidos</h2>
        <ul className="space-y-2">
          <li
            className={`flex items-center text-sm cursor-pointer ${
              activeSection === "threads" ? "text-green-600 font-medium" : "text-gray-700"
            }`}
            onClick={() => navigate("/comunity/threads")}
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Mis hilos
          </li>
          <li
            className={`flex items-center text-sm cursor-pointer ${
              activeSection === "posts" ? "text-green-600 font-medium" : "text-gray-700"
            }`}
            onClick={() => navigate("/comunity/posts")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Mis publicaciones
          </li>
        </ul>
      </div>

      {/* Mis Comunidades */}
      <div>
        <h2 className="text-gray-700 font-medium text-sm mb-2">Mis comunidades</h2>
        <ul className="space-y-2">
          <li
            className={`flex items-center text-sm cursor-pointer ${
              activeSection === "groups" ? "text-green-600 font-medium" : "text-gray-700"
            }`}
            onClick={() => navigate("/comunity/groups")}
          >
            <Layers className="w-4 h-4 mr-2" />
            Mis grupos
          </li>
        </ul>
      </div>

      {/* Botón de alternancia en dispositivos móviles */}
      <button
        className="md:hidden p-2 bg-blue-500 text-white rounded-full mt-4"
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        {isNavOpen ? "Cerrar menú" : "Abrir menú"}
      </button>
    </div>
  );
};