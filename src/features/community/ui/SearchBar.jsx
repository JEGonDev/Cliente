import React, { useState } from "react";

export const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center border rounded-md px-3 py-2 bg-white shadow-md">
      <input
        type="text"
        placeholder="Buscar..."
        className="flex-1 outline-none text-sm text-gray-700"
        value={query}
        onChange={handleInputChange}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M11 18a7 7 0 110-14 7 7 0 010 14z"
        />
      </svg>
    </div>
  );
};