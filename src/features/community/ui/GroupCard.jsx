import React from "react";
import { useNavigate } from "react-router-dom";

export const GroupCard = ({ group }) => {
  const navigate = useNavigate();

  return (
    <div className="border rounded-md shadow-md p-4 flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold">{group.name}</h3>
        <p className="text-sm text-gray-600 mt-2">{group.description}</p>
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