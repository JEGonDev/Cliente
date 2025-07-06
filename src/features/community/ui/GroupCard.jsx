import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => navigate(`/comunity/groups/${group.id}`)}
      className={`
        flex flex-col rounded-xl shadow-lg bg-white overflow-hidden
        hover:shadow-2xl transition-all duration-300
        border border-gray-100 cursor-pointer
        w-full mx-auto
      `}
    >
      {/* Cabecera con degradado y título */}
      <div className="relative h-20 overflow-hidden rounded-t-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-[#23582a] to-[#3a8741]" />
        <h3 className="relative font-Poppins font-bold px-4 pt-3 text-white text-lg line-clamp-2">
          {group.name}
        </h3>
      </div>

      {/* Contenido principal */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-sm text-gray-700 mb-3 line-clamp-3 break-words overflow-hidden leading-relaxed">
          {group.description}
        </p>

        <div className="flex-grow" />

        <div className="flex justify-end pt-3 border-t border-gray-100 mt-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/comunity/groups/${group.id}`);
            }}
            className="bg-gradient-to-r from-[#3a8741] to-[#23582a] hover:from-[#2e6e35] hover:to-[#1f4d24]
                       text-white text-xs font-medium px-4 py-1.5 rounded-full transition-colors duration-200 shadow-sm"
          >
            Ver detalles
          </button>
        </div>
      </div>
    </motion.div>
  );
};
