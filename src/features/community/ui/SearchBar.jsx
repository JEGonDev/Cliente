import { useState } from "react";
import { Search, X } from "lucide-react";

export const SearchBar = ({ onSearch, className = "", placeholder = "Buscar..." }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };
  
  const clearSearch = () => {
    setQuery("");
    onSearch("");
  };

  return (
    <div className={`flex items-center border rounded-md px-3 py-2 bg-white shadow-sm ${className}`}>
      <Search className="w-5 h-5 text-gray-400 mr-2" />
      
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 outline-none text-sm text-gray-700"
        value={query}
        onChange={handleInputChange}
      />
      
      {query && (
        <button 
          onClick={clearSearch}
          className="text-gray-400 hover:text-gray-600"
          title="Limpiar búsqueda"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};