import { useNavigate } from "react-router-dom";
import {
  MessageCircleMore, // ícono redondeado para foro
  Users,
  HomeIcon,
} from "lucide-react";
import PropTypes from "prop-types";

/**
 * Barra lateral con íconos grandes, fondo gris claro y estilo mejorado.
 */ 
export const BarIcons = ({ activeSection }) => {
  const navigate = useNavigate();

  const baseIconStyle =
    "p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200";
  const activeStyle = "text-green-600";
  const inactiveStyle = "text-gray-700";

  return (
    <div className="w-full md:w-40 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col items-center justify-around md:justify-start p-6 gap-8 md:gap-10">
      
      {/* Foro - más redondeado */}
      <button
        className={`flex flex-col items-center gap-2 ${
          activeSection === "forum" ? activeStyle : inactiveStyle
        }`}
        onClick={() => navigate("/comunity/ThreadForum")}
      >
        <MessageCircleMore className={`${baseIconStyle} w-12 h-12`} />
        <span className="text-sm hidden md:block">Foro</span>
      </button>

      {/* Grupos */}
      <button
        className={`flex flex-col items-center gap-2 ${
          activeSection === "groups" ? activeStyle : inactiveStyle
        }`}
        onClick={() => navigate("/comunity/groups")}
      >
        <Users className={`${baseIconStyle} w-12 h-12`} />
        <span className="text-sm hidden md:block">Grupos</span>
      </button>

      {/* Inicio */}
      <button
        className={`flex flex-col items-center gap-2 ${
          activeSection === "home" ? activeStyle : inactiveStyle
        }`}
        onClick={() => navigate("/comunity")}
      >
        <HomeIcon className={`${baseIconStyle} w-12 h-12`} />
        <span className="text-sm hidden md:block">Inicio</span>
      </button>
    </div>
  );
};

BarIcons.propTypes = {
  activeSection: PropTypes.oneOf(["forum", "groups", "home"]).isRequired,
};