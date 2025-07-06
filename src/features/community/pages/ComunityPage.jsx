import React from "react";
import { useContent } from "../hooks/useContent";
import { Header } from "../../../ui/layouts/Header";

import { Navbar_layout } from "../layouts/Navbar_layout";
import { Groups } from "../layouts/Groups";
import { Forum } from "../layouts/Forum";
import { HomeComunity } from "../layouts/HomeComunity";
import { Threads } from "../layouts/Threads";
import { BarIcons } from "../../../ui/components/BarIcons";


export const ComunityPage = () => {
  const { activeContent, setActiveContent } = useContent();

  // Función para manejar el cambio de sección
  const handleSectionChange = (section) => {
    setActiveContent(section);
  };

  // Renderizado condicional basado en la sección activa
  const renderContent = () => {
    switch (activeContent) {
      
      
      case "groups":
        return <Groups />;
      
      case "forum":
        return <Forum />;

        case "threads":
          return <Threads />;
      
      
      default:
        return <HomeComunity />;
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen">
        <BarIcons
          activeSection={activeContent}
          onSectionChange={handleSectionChange}
        />
        <Navbar_layout />
        <div className="flex-1 p-4">{renderContent()}</div>
      </div>
    </>
  );
};