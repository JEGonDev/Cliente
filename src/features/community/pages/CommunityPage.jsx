import React from "react";
import { HomeComunity } from "../layouts/HomeComunity";
import { Forum } from "../layouts/Forum";


import { useContent } from "../hooks/useContent";
import { BarIcons_layout } from "../layouts/BarIcons_layout";
import { Navbar_layout } from "../layouts/Navbar_layout";

export const CommunityPage = () => {
  const { activeContent } = useContent();

  const renderContent = () => {
    switch (activeContent) {
      case 'content1':
        return <HomeComunity />;
      case 'content2':
        return <Forum />;     
      
      default:
        return <HomeComunity />;
    }
  };
  return (
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
      {/* Sección 1: Barra con íconos */}
      <BarIcons_layout />
      {/* Sección 2: Navegación */}
      <Navbar_layout />
      {/* Sección 3: Contenido principal */}
      <div className="flex-1 p-4">
      {renderContent()}
      </div>
    </div>
  );
};
