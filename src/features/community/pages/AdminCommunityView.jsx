import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarIcons } from "../../../ui/components/BarIcons";
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
import { PlantGrow } from "../../../features/community/ui/PlantGrow";

export function AdminCommunityView() {
  const [activeSection, setActiveSection] = useState("forum");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-tr from-gray-50 to-gray-100">
      {/* Aside barra lateral (escritorio) */}
      <aside className="hidden md:flex flex-col items-center py-8 px-2 gap-4 bg-white/60 backdrop-blur-xl shadow-xl rounded-r-3xl border-r border-gray-200/50 transition-all duration-300">
        <BarIcons
          title="Comunidad"
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </aside>

      {/* Main container */}
      <div className="w-full max-w-4xl bg-white min-h-screen border border-gray-200 rounded-3xl shadow-xl p-0 mx-auto pb-20 md:pb-0">
        {/* Header */}
        <div className="flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between mb-6 gap-2 lg:gap-0">
          <h1 className="pt-8 px-4 text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight font-poppins mb-2 lg:mb-0 text-center lg:text-left bg-gradient-to-r from-[#23582a] via-[#059669] to-[#10b981] bg-clip-text text-transparent">
            Administración de la Comunidad
          </h1>
          <div className="flex justify-center gap-2 flex-wrap mt-2 lg:mt-0">
            {[...Array(4)].map((_, i) => (
              <PlantGrow
                key={i}
                className="w-12 h-12 lg:w-16 lg:h-16 hover:scale-110 transition-transform duration-300"
              />
            ))}
          </div>
        </div>

        {/* Buscador */}
        <div className="flex justify-center py-3 sm:py-4">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
              placeholder="Buscar post, grupo o hilo"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-center py-1 border-b">
          {[
            { path: "/comunity/posts", label: "Publicaciones", icon: FaFileAlt, color: "text-sky-900" },
            { path: "/comunity/ThreadForum", label: "Foro", icon: FaForumbee, color: "text-amber-500" },
            { path: "/comunity/groups", label: "Grupos", icon: FaLayerGroup, color: "text-green-600" },
            { path: "/profile/admin", label: "Usuarios", icon: FaUser, color: "text-gray-700" },
          ].map(({ path, label, icon: Icon, color }, i) => (
            <div key={i} className="flex justify-end mt-4">
              <button
                onClick={() => navigate(path)}
                className="text-sm font-medium hover:underline hover:text-emerald-600 transition-colors duration-200"
              >
                <span className={`flex items-center gap-1 ${color} font-medium cursor-pointer hover:scale-105 transition-transform`}>
                  <Icon /> {label}
                </span>
              </button>
            </div>
          ))}
        </div>

        {/* Layouts de contenido */}
        <div className="px-2 sm:px-5 py-2">
          <AdminPostLayout searchTerm={searchTerm} />
          <hr className="my-6 border-t border-gray-200" />
          <AdminGroupsLayout searchTerm={searchTerm} />
          <hr className="my-6 border-t border-gray-200" />
          <AdminThreadsLayout searchTerm={searchTerm} />
          <hr className="my-6 border-t border-gray-200" />
        </div>
      </div>

      {/* Barra de iconos móvil (abajo) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/70 backdrop-blur-lg border-t border-gray-300/50 shadow-2xl flex justify-around items-center py-2 rounded-t-2xl">
        <BarIcons
          title="Comunidad"
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </nav>
    </div>
  );
}
