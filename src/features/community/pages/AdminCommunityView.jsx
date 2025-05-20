import React from "react";
import { FaSearch, FaCog, FaBell, FaUser, FaExclamationTriangle, FaUserSlash, FaUserCircle, FaFileAlt, FaFlag } from "react-icons/fa";

export function AdminCommunityView() {
  return (
    <div className="w-full max-w-md mx-auto bg-white min-h-screen border rounded-md shadow-md p-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-100">
        <span className="text-lg font-semibold">Administrador de comunidad</span>
        <div className="flex items-center gap-3 text-gray-500">
          <FaBell className="text-xl cursor-pointer" title="Notificaciones" />
          <FaCog className="text-xl cursor-pointer" title="Configuración" />
        </div>
      </div>

      {/* Buscador */}
      <div className="flex justify-center py-4">
        <div className="relative w-4/5">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 text-gray-700 focus:outline-none"
            placeholder="Buscar"
            disabled
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 justify-center py-1 border-b">
        <span className="flex items-center gap-1 text-blue-700 font-medium cursor-pointer">
          <FaFileAlt /> Publicaciones
        </span>
        <span className="flex items-center gap-1 text-red-700 font-medium cursor-pointer">
          <FaFlag /> Reportes
        </span>
        <span className="flex items-center gap-1 text-gray-700 font-medium cursor-pointer">
          <FaUser /> Usuarios
        </span>
      </div>

      <div className="px-5 py-2">
        {/* Publicaciones recientes */}
        <div className="mt-4 mb-6">
          <h2 className="font-semibold text-lg mb-2">Publicaciones Recientes</h2>
          <div className="text-gray-800 mb-2 flex justify-between">
            <span>Comparación de cultivos - Samantha 12</span>
          </div>
          <button className="bg-green-800 hover:bg-green-900 text-white text-sm rounded px-3 py-1 mb-2">
            Eliminar
          </button>
          <div className="text-gray-800 mb-2 flex justify-between">
            <span>¿Es el futuro la hidroponía? - Camila JK</span>
          </div>
          <button className="bg-green-800 hover:bg-green-900 text-white text-sm rounded px-3 py-1 mb-2">
            Eliminar
          </button>
        </div>
        <hr />

        {/* Usuarios en Moderación */}
        <div className="my-5">
          <div className="flex items-center gap-2 text-red-700 font-semibold mb-2">
            <FaExclamationTriangle /> Usuarios en Moderación
          </div>
          <div className="flex items-center gap-2 mb-2 text-yellow-800">
            <FaExclamationTriangle className="text-lg" />
            <span>GreenLover23 - Advertido</span>
            <button className="bg-green-700 hover:bg-green-900 text-white text-xs rounded px-2 py-1 ml-auto">
              Reintegrar
            </button>
          </div>
          <div className="flex items-center gap-2 mb-2 text-red-800">
            <FaUserSlash className="text-lg" />
            <span>HydroFan45 - Expulsado</span>
            <button className="bg-yellow-600 hover:bg-yellow-800 text-white text-xs rounded px-2 py-1 ml-auto">
              Suspender
            </button>
          </div>
        </div>
        <hr />

        {/* Usuarios */}
        <div className="mt-5">
          <div className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
            <FaUser /> Usuarios
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FaUserCircle className="text-2xl text-gray-400" />
            <span>GreenLover23</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FaUserCircle className="text-2xl text-gray-400" />
            <span>GreenLover23</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <FaUserCircle className="text-2xl text-gray-400" />
            <span>GreenLover23</span>
          </div>
        </div>
      </div>
    </div>
  );
}