import React, { useMemo, useState, useEffect } from "react";
import { GroupCard } from "../ui/GroupCard";
import { GroupFormModal } from "../ui/GroupFormModal";
import { SearchBar } from "../ui/SearchBar";
import { useGroup } from "../hooks/useGroup";
import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";

/**
 * Vista principal para mostrar la lista de grupos en Germogli.
 * Utiliza el hook y contexto modularizados para mantener la UI reactiva y limpia.
 */
export const GroupListView = () => {
  // Usa el hook personalizado que conecta con el contexto global de grupos
  const { groups, loading, error, fetchGroups } = useGroup();
  const { canManageSystem, user } = useAuthRoles();

  // Estado local para controlar el modal de creación de grupo
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado local para la búsqueda de grupos
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log('Estado actual del modal:', isModalOpen);
    console.log('Usuario actual:', user);
    console.log('¿Puede administrar?:', canManageSystem());
    console.log('Grupos cargados:', groups);
    console.log('Estado de carga:', loading);
    console.log('Error si existe:', error);
  }, [isModalOpen, user, groups, loading, error]);

  // Filtrado de grupos por búsqueda, usando useMemo para optimización
  const filteredGroups = useMemo(() => {
    if (!searchQuery) return groups;
    return groups?.filter((group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  }, [groups, searchQuery]);

  // Cuando se crea un grupo, recarga la lista global de grupos
  const handleGroupCreated = () => {
    console.log('Grupo creado exitosamente');
    fetchGroups(); // Refresca la lista usando el método del contexto
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    console.log('Intentando abrir el modal...');
    console.log('¿Usuario puede administrar?:', canManageSystem());
    setIsModalOpen(true);
    console.log('Estado del modal después de setIsModalOpen:', true);
  };

  const renderModal = () => {
    console.log('Intentando renderizar el modal, isModalOpen:', isModalOpen);
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 z-50">
        <GroupFormModal
          onClose={() => {
            console.log('Cerrando modal...');
            setIsModalOpen(false);
          }}
          onGroupCreated={handleGroupCreated}
        />
      </div>
    );
  };

  // Loading y error manejados de forma modular
  if (loading) {
    console.log('Renderizando estado de carga...');
    return (
      <>
        <div>Cargando grupos...</div>
        {renderModal()}
      </>
    );
  }

  if (error || !groups || groups.length === 0) {
    console.log('Renderizando estado de error o sin grupos...');
    console.log('Error:', error);
    console.log('Grupos:', groups);
    return (
      <>
        <div className="text-center p-8">
          <p className="text-gray-600 mb-4">No hay grupos disponibles en este momento.</p>
          {canManageSystem() && (
            <button
              onClick={handleOpenModal}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Crear Grupo
            </button>
          )}
        </div>
        {renderModal()}
      </>
    );
  }

  return (
    <>
      <div className="p-4">
        <div className="mb-4">
          <SearchBar onSearch={setSearchQuery} className="w-full" />
        </div>
        {canManageSystem() && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleOpenModal}
              className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Crear Grupo
            </button>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))
          ) : (
            <p className="text-gray-500 text-center col-span-full">No hay grupos disponibles.</p>
          )}
        </div>
      </div>
      {renderModal()}
    </>
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


