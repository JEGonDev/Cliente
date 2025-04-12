import React, { useState } from "react";
import {
  Bell,
  MessageCircle,
  Users,
  Star,
  Search,
} from "lucide-react";
import { HomeComunity } from "../ui/HomeComunity";

export const CommunityPage = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sección 1: Barra con íconos */}
      <div className="w-full md:w-16 bg-gray-200 border-b md:border-b-0 md:border-r border-gray-300 flex md:flex-col items-center justify-around md:justify-start p-2">
        <button className="p-2 text-gray-800">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-800">
          <MessageCircle className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-800">
          <Users className="w-5 h-5" />
        </button>
      </div>

      {/* Sección 2: Navegación */}
      <div
        className={`w-full md:w-64 bg-white border-r border-gray-300 flex flex-col p-4 ${
          isNavOpen ? "block" : "hidden"
        } md:block`}
      >
        <div className="mb-4">
          <h2 className="text-red-500 font-medium text-sm mb-2">Favoritos</h2>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
              💬 Hablemos de hidroponía
            </li>
            <li className="flex items-center text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              🌱 Hidroponía en Casa
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 bg-transparent border border-gray-300 rounded-full mr-2"></span>
              Innovaciones en Hidroponía
            </li>
            <li className="flex items-center text-sm text-gray-500">
              <span className="w-2 h-2 bg-transparent border border-gray-300 rounded-full mr-2"></span>
              Técnicas Avanzadas
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-gray-700 font-medium text-sm mb-2">Mis comunidades</h2>
          <ul className="space-y-2">
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-green-600 mr-1">✓</span>
              Cultivos Orgánicos en Casa
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-blue-500 mr-1">💧</span>
              Sistemas de Riego Inteligentes
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-gray-500 mr-1">🏗️</span>
              Construcción de Invernaderos
            </li>
            <li className="flex items-center text-sm text-gray-700">
              <span className="text-yellow-500 mr-1">📊</span>
              Monitoreo de Cultivos con IoT
            </li>
          </ul>
        </div>
      </div>

      {/* Botón para abrir/cerrar navegación en móviles */}
      <button
        className="md:hidden p-2 bg-blue-500 text-white rounded-full m-4"
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        {isNavOpen ? "Cerrar menú" : "Abrir menú"}
      </button>

      {/* Sección 3: Contenido principal */}
      <div className="flex-1 p-4">
        {/* Barra de búsqueda */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Contenido adicional */}
        <div>
          <HomeComunity />
        </div>
      </div>
    </div>
  );
};
