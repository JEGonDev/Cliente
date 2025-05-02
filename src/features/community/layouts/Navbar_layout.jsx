import React from "react";
import { useState } from "react";

export const Navbar_layout = () => {
    const [isNavOpen, setIsNavOpen] = useState(false);
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
