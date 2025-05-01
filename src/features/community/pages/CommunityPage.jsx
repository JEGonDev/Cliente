import React from "react";
import { HomeComunity } from "../layouts/HomeComunity";
import { BarIcons_layout } from "../layouts/BarIcons_layout";
import { Navbar_laout } from "../layouts/Navbar_laout";

export const CommunityPage = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sección 1: Barra con íconos */}
      <BarIcons_layout />
      {/* Sección 2: Navegación */}
      <Navbar_laout />
      {/* Sección 3: Contenido principal */}
      <div className="flex-1 p-4">
        <HomeComunity />
      </div>
    </div>
  );
};
