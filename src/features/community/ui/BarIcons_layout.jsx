import { useNavigate } from "react-router-dom";
import { Bell, MessageSquare, Users } from "lucide-react";
import PropTypes from "prop-types";

/**
 * Barra lateral con iconos para redireccionar a las rutas principales
 * del módulo de comunidad: Notificaciones, Foro general y Grupos.
 */
export const BarIcons_layout = ({ activeSection }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-24 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 flex md:flex-col items-center justify-around md:justify-start p-2">
      {/* Botón para Notificaciones */}
      <button
        className={`p-2 flex flex-col items-center mb-4 ${
          activeSection === "notifications" ? "text-green-600" : "text-gray-800"
        }`}
        onClick={() => navigate("/comunity/forum")}
      >
        <Bell className="w-6 h-6" />
        <span className="text-xs mt-1 hidden md:block">Notificaciones</span>
      </button>

      {/* Foro General */}
      <button
        className={`p-2 flex flex-col items-center mb-4 ${
          activeSection === "forum" ? "text-green-600" : "text-gray-800"
        }`}
        onClick={() => navigate("/comunity/ThreadForum")}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="text-xs mt-1 hidden md:block">Foro</span>
      </button>

      {/* Grupos */}
      <button
        className={`p-2 flex flex-col items-center ${
          activeSection === "groups" ? "text-green-600" : "text-gray-800"
        }`}
        onClick={() => navigate("/comunity/groups")}
      >
        <Users className="w-6 h-6" />
        <span className="text-xs mt-1 hidden md:block">Grupos</span>
      </button>
    </div>
  );
};
BarIcons_layout.propTypes = {
  activeSection: PropTypes.oneOf(["notifications", "forum", "groups"]).isRequired,
};