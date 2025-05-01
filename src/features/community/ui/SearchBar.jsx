import React from "react";
import { Search } from "lucide-react"; // Importa el ícono Search

export const SearchBar = () => {
  return (
    <div>
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            className="w-full border border-gray-300 rounded-full px-4 py-2 pl-10 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
