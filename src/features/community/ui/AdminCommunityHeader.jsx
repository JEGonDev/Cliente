import React from "react";
import { Settings, List, Search } from "lucide-react";

/**
 * Header del administrador de comunidad
 * Contiene el título, barra de búsqueda y navegación por tabs
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.activeTab - Tab actualmente activo
 * @param {Function} props.onTabChange - Función para cambiar de tab
 * @param {string} props.searchValue - Valor actual de búsqueda
 * @param {Function} props.onSearchChange - Función para manejar cambios en búsqueda
 */
export const AdminCommunityHeader = ({
  activeTab,
  onTabChange,
  searchValue,
  onSearchChange,
}) => {
  return (
    <div className="bg-white p-4 border-b border-gray-200">
      {/* Título y configuración */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold text-gray-800">
          Administrador de comunidad
        </h1>
        <div className="flex gap-2">
          <button
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Ver lista"
          >
            <List size={20} />
          </button>
          <button
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Configuración"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Buscar"
          value={searchValue}
          onChange={onSearchChange}
          className="w-full px-4 py-2 border rounded-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
        <Search className="absolute right-3 top-2.5 text-gray-400 w-4 h-4 pointer-events-none" />
      </div>

      {/* Tabs de navegación */}
      <div className="flex gap-4 text-sm">
        <button
          onClick={() => onTabChange("publications")}
          className={`flex items-center gap-1 transition-colors ${
            activeTab === "publications"
              ? "text-blue-600 font-medium"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Publicaciones
        </button>

        <span className="text-gray-400">|</span>

        <button
          onClick={() => onTabChange("reports")}
          className={`flex items-center gap-1 transition-colors ${
            activeTab === "reports"
              ? "text-red-600 font-medium"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
          Reportes
        </button>

        <span className="text-gray-400">|</span>

        <button
          onClick={() => onTabChange("users")}
          className={`flex items-center gap-1 transition-colors ${
            activeTab === "users"
              ? "text-blue-600 font-medium"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Usuarios
        </button>
      </div>
    </div>
  );
};
