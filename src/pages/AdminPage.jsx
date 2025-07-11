import React from "react";
import { Settings, List, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
    const navigate = useNavigate();
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
      {/* Tabs de navegación */}
      <div className="flex gap-4 text-sm">
        <button
          onClick={() => navigate("/profile/admin")}
          className= "flex items-center gap-1 transition-colors "
        >
          <span className="w-2 h-2 bg-blue rounded-full"></span>
          Gestión de usuarios
        </button>

        <span className="text-gray-400">|</span>

        <button
          onClick={() => navigate("/comunity/admin_comunity")}
          className= "flex items-center gap-1 transition-colors "
        >
          <span className="w-2 h-2 bg-blue rounded-full"></span>
          Gestión de comunidad
        </button>

        <span className="text-gray-400">|</span>

        
      </div>
    </div>
  );
};
