import React from 'react';
import { Logo } from '../components/Logo';
import { Navbar } from '../components/Navbar';
import imgLogo from '../../assets/header/logo.png';
import { AuthNav } from '../components/AuthNav';

export const Header = () => {
  return (
    <header className="bg-primary w-full flex flex-row flex-wrap items-center justify-between px-4 md:px-8 py-2 gap-x-4 overflow-auto">
      {/* Logo a la izquierda */}
      <div className="flex-shrink-0">
        <Logo filePath={imgLogo} alt="Logo_header" styleLogo="h-12 w-16 md:h-32 md:w-40" />
      </div>

      {/* Navbar siempre visible */}
      <div className="flex flex-grow justify-center">
        <Navbar />
      </div>

      {/* AuthNav a la derecha */}
      <div className="flex-shrink-0 hidden sm:block">
        <AuthNav />
      </div>
    </header>
  );
};