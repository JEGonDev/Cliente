import imgLogo from "../../assets/header/logo2.png"; 
import { MobileMenuButton } from "../components/MobileMenuButton"; 
import { MobileNavigation } from "../components/MobileNavigation"; 
import { useState } from "react"; 
import { Header_logo } from "../components/Header_logo"; 
import { DesktopNavigation } from "../components/DesktopNavigation";

export const Global_header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logoProps = {
    filePath: imgLogo,
    alt: "Logo_header"
  };

  return (
    <header className="bg-primary">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-8xl items-center justify-between p-2 sm:p-4 lg:pl-2 lg:pr-2 lg:py-6" 
      >
        {/* Logo pegado al borde izquierdo */}
        <div className="flex flex-shrink-0 items-center lg:-ml-2">
          <Header_logo filePath={imgLogo} alt="Logo_header" />
        </div>

        {/* Botón menú móvil */}
        <div className="flex lg:hidden">
          <MobileMenuButton
            isOpen={false}
            onClick={() => setMobileMenuOpen(true)}
          />
        </div>

        {/* Navegación escritorio pegada al borde derecho */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:-mr-2">
          <DesktopNavigation />
        </div>
      </nav>

      {/* Navegación móvil */}
      <MobileNavigation
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        logoProps={logoProps}
      />
    </header>
  );
};