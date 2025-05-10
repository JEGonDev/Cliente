import imgLogo from "../../assets/header/logo2.png"; // Importa la imagen del logo
import { MobileMenuButton } from "../components/MobileMenuButton"; // Botón para abrir el menú móvil
import { MobileNavigation } from "../components/MobileNavigation"; // Componente para la navegación en dispositivos móviles
import { useState } from "react"; // Hook de React para manejar el estado
import { Header_logo } from "../components/Header_logo"; // Componente para mostrar el logo en el header
import { DesktopNavigation } from "../components/DesktopNavigation"; // Componente para la navegación en dispositivos de escritorio

export const Global_header = () => {
  // Estado para controlar si el menú móvil está abierto o cerrado
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Propiedades del logo que se pasan al componente Header_logo
  const logoProps = {
    filePath: imgLogo, // Ruta de la imagen del logo
    alt: "Logo_header" // Texto alternativo para accesibilidad
  };

  return (
    <header className="bg-primary">
      {/* Barra de navegación principal */}
      <nav
        aria-label="Global" // Etiqueta ARIA para describir la navegación global
        className="mx-auto flex max-w-7xl items-center justify-between p-2 lg:px-8"
      >
        {/* Sección del logo */}
        <div className="flex lg:flex-1">
          <Header_logo filePath={imgLogo} alt="Logo_header" />
        </div>

        {/* Botón para abrir el menú móvil (visible solo en pantallas pequeñas) */}
        <div className="flex lg:hidden">
          <MobileMenuButton
            isOpen={false} // Estado inicial del botón
            onClick={() => setMobileMenuOpen(true)} // Abre el menú móvil al hacer clic
          />
        </div>

        {/* Navegación para pantallas grandes (escritorio) */}
        <DesktopNavigation />
      </nav>

      {/* Navegación para dispositivos móviles */}
      <MobileNavigation 
        isOpen={mobileMenuOpen} // Controla si el menú móvil está abierto
        onClose={() => setMobileMenuOpen(false)} // Cierra el menú móvil
        logoProps={logoProps} // Pasa las propiedades del logo al menú móvil
      />
    </header>
  );
};
