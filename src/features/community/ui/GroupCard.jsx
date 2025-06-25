import React from "react";
import { useNavigate } from "react-router-dom";

export const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div
      className="
        border rounded-md shadow-md p-4 flex flex-col justify-between h-full
        transition duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer
      "
    >
      <div>
        <div className="relative h-20 overflow-hidden rounded-t-xl">
          {/* Capa de degradado que cubre todo el encabezado */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#23582a] to-[#3a8741]" />

          {/* Título del módulo con texto blanco y fuente personalizada */}
          <h3 className="relative font-Poppins font-bold px-4 pt-3 text-white text-lg line-clamp-2">
            {group.name}
              
          </h3>
        </div>

        
        {/* 
          line-clamp-3: muestra solo 3 líneas antes de truncar con "..." 
          break-words: evita desbordes por palabras largas
          overflow-hidden: oculta cualquier desborde 
        */}
        <p className="text-sm text-gray-600 mt-2 line-clamp-3 break-words overflow-hidden">
          {group.description}
        </p>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate(`/comunity/groups/${group.id}`)}
          className="text-secondary underline text-sm"
        >
          Ver detalles
        </button>
      </div>
    </div>
  );
};

// import React from "react";
// import { useNavigate } from "react-router-dom";

// export const GroupCard = ({ group }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="border rounded-md shadow-md p-4 flex flex-col justify-between h-full">
//       <div>
//         <h3 className="text-lg font-semibold break-words">{group.name}</h3>
//         {/*
//           line-clamp-3: muestra solo 3 líneas antes de truncar con "..."
//           break-words: evita desbordes por palabras largas
//           overflow-hidden: oculta cualquier desborde
//         */}
//         <p className="text-sm text-gray-600 mt-2 line-clamp-3 break-words overflow-hidden">
//           {group.description}
//         </p>
//       </div>
//       <div className="flex justify-end mt-4">
//         <button
//           onClick={() => navigate(`/comunity/groups/${group.id}`)}
//           className="text-secondary underline text-sm"
//         >
//           Ver detalles
//         </button>
//       </div>
//     </div>
//   );
// };

// import React from "react";
// import { useNavigate } from "react-router-dom";

// export const GroupCard = ({ group }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="border rounded-md shadow-md p-4 flex flex-col justify-between h-full">
//       <div>
//         <h3 className="text-lg font-semibold">{group.name}</h3>
//         <p className="text-sm text-gray-600 mt-2">{group.description}</p>
//       </div>
//       <div className="flex justify-end mt-4">
//         <button
//           onClick={() => navigate(`/comunity/groups/${group.id}`)}
//           className="text-secondary underline text-sm"
//         >
//           Ver detalles
//         </button>
//       </div>
//     </div>
//   );
// };

// import React from "react";
// import { FaUsers } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

// export const GroupCard = ({ group, onJoin }) => {
//   const navigate = useNavigate();

//   return (
//     <div className="border rounded-md shadow-md p-4 flex flex-col justify-between h-full">
//       <div>
//         <h3 className="text-lg font-semibold">{group.name}</h3>
//         <p className="text-sm text-gray-600 mt-2">{group.description}</p>
//       </div>
//       <div className="flex items-center justify-between mt-4">
//         <div className="flex items-center gap-2 text-gray-500">
//           <FaUsers />
//           <span className="text-sm">{group.members_count ?? 0}</span>
//         </div>
//         <div className="flex gap-2">
//           <button
//             onClick={() => onJoin(group)}
//             className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
//           >
//             Unirse
//           </button>
//           <button
//             onClick={() => navigate(`/comunity/groups/${group.group_id}`)}
//             className="text-blue-500 underline text-sm"
//           >
//             Ver detalles
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };
