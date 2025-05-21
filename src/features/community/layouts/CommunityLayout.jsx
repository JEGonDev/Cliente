import  { useState } from "react";
import { Outlet } from "react-router-dom";
import { BarIcons_layout } from "../ui/BarIcons_layout";


export const CommunityLayout = () => {
  const [activeSection, setActiveSection] = useState("forum");

  return (
    <div className="flex h-screen">
      {/* Barra lateral izquierda con iconos */}
      <BarIcons_layout activeSection={activeSection} />


      {/* Contenido principal */}
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};