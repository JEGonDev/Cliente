import React from 'react';
import { ItemsNavbar } from "../components/ItemsNavbar";
import { AuthNav } from "../components/AuthNav";

export const DesktopNavigation = () => {
  return (
    <>
      <div className="hidden lg:flex lg:gap-x-12">
        <ItemsNavbar link="/" style="text-white" text="Inicio" />
        <ItemsNavbar link="/profile/edit" style="text-white" text="profile" />
        {/* Aquí puedes agregar más elementos de navegación según sea necesario */}
      </div>
      <div className="hidden lg:flex lg:gap-x-12">
        
        {/* Aquí puedes agregar más elementos de navegación según sea necesario */}
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-12">
        <AuthNav />
      </div>
    </>
  );
};
