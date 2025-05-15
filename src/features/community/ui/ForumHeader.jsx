// src/features/community/ui/ForumHeader.jsx
import React from "react";
import { Search, Plus } from "lucide-react";

export const ForumHeader = ({ onCreatePost, onSearch }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Foro de Comunidad</h1>
        
        <button 
          onClick={onCreatePost}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          <Plus size={18} className="mr-1" />
          Nuevo tema
        </button>
      </div>
      
      {/* Barra de búsqueda */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar en el foro..."
          className="w-full p-2 pl-10 border rounded-lg"
          onChange={(e) => onSearch && onSearch(e.target.value)}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      </div>
    </div>
  );
};