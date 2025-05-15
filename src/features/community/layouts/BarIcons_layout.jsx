import React from "react";
import {
    Bell,
    MessageSquare,
    Users
} from "lucide-react";

export const BarIcons_layout = ({ onSectionChange, activeSection }) => {
  return (
    <div className="w-full md:w-16 bg-gray-200 border-b md:border-b-0 md:border-r border-gray-300 flex md:flex-col items-center justify-around md:justify-start p-2">
      {/* Botón para Notificaciones */}
      <button 
        className={`p-2 ${activeSection === "notifications" ? "text-green-600" : "text-gray-800"} flex flex-col items-center`}
        onClick={() => onSectionChange("notifications")}
      >
        <Bell className="w-5 h-5" />
        <span className="text-xs mt-1 hidden md:block">Notificaciones</span>
      </button>
      
      {/* Botón para Foro */}
      <button 
        className={`p-2 ${activeSection === "forum" ? "text-green-600" : "text-gray-800"} flex flex-col items-center`}
        onClick={() => onSectionChange("forum")}
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs mt-1 hidden md:block">Foro</span>
      </button>
      
      {/* Botón para Grupos */}
      <button
        className={`p-2 ${activeSection === "groups" ? "text-green-600" : "text-gray-800"} flex flex-col items-center`}
        onClick={() => onSectionChange("groups")}
      >
        <Users className="w-5 h-5" />
        <span className="text-xs mt-1 hidden md:block">Grupos</span>
      </button>
    </div>
  );
};