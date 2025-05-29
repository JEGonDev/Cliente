import React, { useMemo, useState } from "react";
import { GroupCard } from "../ui/GroupCard";
import { GroupFormModal } from "../ui/GroupFormModal";
import { SearchBar } from "../ui/SearchBar";
import { useGroup } from "../hooks/useGroup";

/**
 * Vista principal para mostrar la lista de grupos en Germogli.
 * Utiliza el hook y contexto modularizados para mantener la UI reactiva y limpia.
 */
export const GroupListView = () => {
  // Usa el hook personalizado que conecta con el contexto global de grupos
  // fetchGroups es la función para refrescar la lista (antes era reloadGroups)
  const { groups, loading, error, fetchGroups } = useGroup();

  // Estado local para controlar el modal de creación de grupo
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado local para la búsqueda de grupos
  const [searchQuery, setSearchQuery] = useState("");

  // Filtrado de grupos por búsqueda, usando useMemo para optimización
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    return groups.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [groups, searchQuery]);

  // Cuando se crea un grupo, recarga la lista global de grupos
  const handleGroupCreated = () => {
    fetchGroups(); // Refresca la lista usando el método del contexto
    setIsModalOpen(false);
  };

  // Loading y error manejados de forma modular
  if (loading) return <div>Cargando grupos...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <SearchBar onSearch={setSearchQuery} className="w-full" />
      </div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Crear Grupo
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.length > 0 ? (
          filteredGroups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No hay grupos disponibles.</p>
        )}
      </div>
      {isModalOpen && (
        <GroupFormModal
          onClose={() => setIsModalOpen(false)}
          onGroupCreated={handleGroupCreated}
        />
      )}
    </div>
  );
};


// import React, { useMemo, useState } from "react";
// import { GroupCard } from "../ui/GroupCard";
// import { GroupFormModal } from "../ui/GroupFormModal";
// import { SearchBar } from "../ui/SearchBar";
// import { useGroup } from "../hooks/useGroup";

// export const GroupListView = () => {
//   const { groups, loading, error, reloadGroups } = useGroup();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");

//   // Filtrado de grupos por búsqueda, usando useMemo para optimización
//   const filteredGroups = useMemo(() => {
//     if (!searchQuery) return groups;
//     return groups.filter((group) =>
//       group.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [groups, searchQuery]);

//   // Cuando se crea un grupo, recarga la lista desde el contexto
//   const handleGroupCreated = () => {
//     reloadGroups();
//     setIsModalOpen(false);
//   };

//   if (loading) return <div>Cargando grupos...</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div className="p-4">
//       <div className="mb-4">
//         <SearchBar onSearch={setSearchQuery} className="w-full" />
//       </div>
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Crear Grupo
//         </button>
//       </div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filteredGroups.length > 0 ? (
//           filteredGroups.map((group) => (
//             <GroupCard key={group.id} group={group} />
//           ))
//         ) : (
//           <p className="text-gray-500 text-center">No hay grupos disponibles.</p>
//         )}
//       </div>
//       {isModalOpen && (
//         <GroupFormModal
//           onClose={() => setIsModalOpen(false)}
//           onGroupCreated={handleGroupCreated}
//         />
//       )}
//     </div>
//   );
// };


