import React from "react";
import { Settings, List } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminPage = () => {
    const navigate = useNavigate();
  return (
    <div className="bg-white p-4 border-b border-gray-200">
      {/* Título y configuración */}
      <div className="flex justify-between gap-2 bg-gray-300 rounded px-2 py-2 min-h-[40px] flex-1">
        <h1 className="text-lg font-semibold text-gray-800">
          Administración del Sistema
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
          className={`flex items-center gap-1 "text-gray-800"`}
          onClick={() => navigate("/admin/community")}
        >
          <span className="w-2 h-2 bg-blue rounded-full"></span>
          Gestión de Comunidad
        </button>

        <span className="text-gray-400">|</span>

        <button
          className={`flex items-center gap-1 "text-gray-800"`}
          onClick={() => navigate("/profile/admin")}
        >
          <span className="w-2 h-2 bg-green rounded-full"></span>
          Gestión de Usuarios
        </button>

        <span className="text-gray-400">|</span>
      </div>
    </div>
  );
};
