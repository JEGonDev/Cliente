import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaSearch,  
  FaUser,  
  FaFileAlt,  
  FaLayerGroup,
  FaForumbee,
} from "react-icons/fa";
import { AdminPostLayout } from "../layouts/AdminPostLayout";
import { AdminGroupsLayout } from "../layouts/AdminGroupsLayout";
import { AdminThreadsLayout } from "../layouts/AdminThreadsLayout";

export function AdminCommunityView() {
  const navigate = useNavigate();
  return (
    <div className="w-full max-w-4xl bg-white min-h-screen border rounded-md shadow-md p-0 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b bg-gray-100 gap-2">
        <span className="text-lg font-semibold">
          Administrador de comunidad
        </span>
      </div>

      {/* Buscador */}
      <div className="flex justify-center py-3 sm:py-4">
        <div className="relative w-full max-w-md">
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
      <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center py-1 border-b">
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/comunity/posts`)}
            className="text-secondary underline text-sm"
          >
            <span className="flex items-center gap-1 text-sky-900 font-medium cursor-pointer">
              <FaFileAlt /> Publicaciones
            </span>
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/comunity/ThreadForum`)}
            className="text-secondary underline text-sm"
          >
            <span className="flex items-center gap-1 text-amber-500 font-medium cursor-pointer">
              <FaForumbee /> Foro
            </span>
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/comunity/groups`)}
            className="text-secondary underline text-sm"
          >
            <span className="flex items-center gap-1 text-green font-medium cursor-pointer">
              <FaLayerGroup /> Grupos
            </span>
          </button>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/profile/admin`)}
            className="text-secondary underline text-sm"
          >
            <span className="flex items-center gap-1 text-gray-700 font-medium cursor-pointer">
              <FaUser /> Usuarios
            </span>
          </button>
        </div>
      </div>

      <div className="px-2 sm:px-5 py-2">
        {/* Publicaciones recientes */}
        <AdminPostLayout />
        <hr />

        <AdminGroupsLayout />
        <hr />

        <AdminThreadsLayout />

        <hr />
      </div>
    </div>
  );
}
