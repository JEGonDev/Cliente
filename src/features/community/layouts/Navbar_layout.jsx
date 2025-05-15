import React, { useContext } from "react";
import { useState } from "react";
import { useContent } from "../hooks/useContent";
import { MessageSquare } from "lucide-react";
import { AuthContext } from "../../authentication/context/AuthContext";

export const Navbar_layout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { activeContent, setActiveContent } = useContent();
    const { isAuthenticated } = useContext(AuthContext);

    // Función para manejar la navegación a diferentes secciones
    const navigateTo = (section) => {
      setActiveContent(section);
      // En dispositivos móviles, cerrar la navegación después de la selección
      if (window.innerWidth < 768) {
        setIsNavOpen(false);
      }
    };

  return (
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

      {/* Sección "Mis hilos" - Solo visible para usuarios autenticados */}
      {isAuthenticated && (
        <div className="mb-4">
          <h2 className="text-gray-700 font-medium text-sm mb-2">
            Mis contenidos
          </h2>
          <ul className="space-y-2">
            <li 
              className={`flex items-center text-sm ${activeContent === "threads" ? "text-green-600 font-medium" : "text-gray-700"} cursor-pointer hover:text-green-600 transition-colors`}
              onClick={() => navigateTo("threads")}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Mis hilos
            </li>
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-gray-700 font-medium text-sm mb-2">
          Mis comunidades
        </h2>
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
      <button
        className="md:hidden p-2 bg-blue-500 text-white rounded-full m-4"
        onClick={() => setIsNavOpen(!isNavOpen)}
      >
        {isNavOpen ? "Cerrar menú" : "Abrir menú"}
      </button>
    </div>
  );
};