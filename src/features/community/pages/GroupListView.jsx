import React, { useState, useMemo } from "react";
import { useGroup } from "../hooks/useGroup";
import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";
import { GroupCard } from "../ui/GroupCard";
import { GroupFormModal } from "../ui/GroupFormModal";
import { SearchBar } from "../ui/SearchBar";
import { PlantGrow } from "../ui/PlantGrow";
import { RefreshCw, UserIcon, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const GroupListView = () => {
  const { groups, loading, error, fetchGroups, fetchGroupsByUser } = useGroup();
  const { canManageSystem } = useAuthRoles();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showOnlyUserGroups, setShowOnlyUserGroups] = useState(false);

  // Traer todos los grupos
  const fetchAllGroups = async () => {
    await fetchGroups();
    setShowOnlyUserGroups(false);
  };

  // Traer solo los grupos del usuario autenticado
  const fetchUserGroups = async () => {
    await fetchGroupsByUser();
    setShowOnlyUserGroups(true);
  };

  // Alternar el filtro "mis grupos"
  const toggleUserGroupsFilter = () => {
    if (showOnlyUserGroups) {
      fetchAllGroups();
    } else {
      fetchUserGroups();
    }
  };

  // Filtrar grupos por búsqueda
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groups || [];
    const term = searchQuery.toLowerCase();
    return (groups || []).filter(
      (group) =>
        group.name?.toLowerCase().includes(term) ||
        group.description?.toLowerCase().includes(term) ||
        group.type?.toLowerCase().includes(term)
    );
  }, [groups, searchQuery]);

  // Cuando se crea un grupo, refresca respetando el filtro actual
  const handleGroupCreated = () => {
    setIsModalOpen(false);
    showOnlyUserGroups ? fetchUserGroups() : fetchAllGroups();
  };

  // Loading / error
  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        <p className="mt-2 text-gray-600">Cargando grupos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
        {canManageSystem() && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
          >
            Crear Grupo
          </button>
        )}
        <button
          onClick={showOnlyUserGroups ? fetchUserGroups : fetchAllGroups}
          className="mt-2 ml-4 text-sm underline hover:text-red-800"
        >
          Intentar nuevamente
        </button>
        {isModalOpen && (
          <GroupFormModal
            onClose={() => setIsModalOpen(false)}
            onGroupCreated={handleGroupCreated}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4 w-full max-w-full">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
        <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-6">
          Grupos de la comunidad
        </h1>
        <div className="flex justify-center gap-2 flex-wrap">
          <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
          <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
          <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
          <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
        <div className="flex-grow">
          <SearchBar
            onSearch={setSearchQuery}
            className="w-full"
            placeholder="Buscar grupo por nombre, descripción o tipo..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={toggleUserGroupsFilter}
            className={`flex items-center px-2 py-2 md:px-3 rounded-md border text-sm md:text-base
              ${showOnlyUserGroups
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            title={
              showOnlyUserGroups
                ? "Mostrar todos los grupos"
                : "Mostrar solo mis grupos"
            }
          >
            <UserIcon className="h-5 w-5 mr-1" />
            <span className="hidden xxs:inline md:inline">
              {showOnlyUserGroups
                ? "Mis grupos"
                : "Filtrar por mis grupos"}
            </span>
          </button>
          <button
            onClick={showOnlyUserGroups ? fetchUserGroups : fetchAllGroups}
            className="flex items-center px-2 py-2 md:px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            title="Refrescar grupos"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mensaje sobre el modo de filtrado activo */}
      {showOnlyUserGroups && (
        <div className="bg-blue-50 text-blue-700 p-2 md:p-3 rounded mb-3 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            <span>Mostrando solo tus grupos</span>
          </div>
          <button
            onClick={fetchAllGroups}
            className="text-sm underline hover:text-blue-900"
          >
            Ver todos
          </button>
        </div>
      )}

      {/* Botón para crear grupo */}
      {canManageSystem() && (
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-2 py-2 md:px-4 rounded-md hover:bg-green-600 flex items-center text-sm md:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden xs:inline">Crear Grupo</span>
            <span className="xs:hidden">Nuevo</span>
          </button>
        </div>
      )}

      {/* Lista de grupos */}
      <div className="flex flex-col gap-4 w-full max-w-full">
        <AnimatePresence>
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, idx) => (
              <motion.div
                key={group.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -32 }}
                transition={{
                  duration: 0.35,
                  delay: idx * 0.06,
                  ease: "easeInOut",
                }}
                whileHover={{
                  scale: 1.015,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
                className="w-full"
              >
                <GroupCard group={group} />
              </motion.div>
            ))
          ) : (
            <div className="bg-gray-50 text-center py-8 px-2 rounded-lg w-full">
              <p className="text-gray-500">
                {searchQuery
                  ? `No se encontraron grupos para "${searchQuery}"`
                  : showOnlyUserGroups
                    ? "Aún no has creado o te has unido a grupos."
                    : "No hay grupos disponibles."}
              </p>
              {canManageSystem() && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-primary hover:underline"
                >
                  ¡Crea el primer grupo!
                </button>
              )}
            </div>
          )}
        </AnimatePresence>
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


// import React, { useState, useMemo, useEffect } from "react";
// import { GroupCard } from "../ui/GroupCard";
// import { GroupFormModal } from "../ui/GroupFormModal";
// import { SearchBar } from "../ui/SearchBar";
// import { useGroup } from "../hooks/useGroup";
// import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";
// import { PlantGrow } from "../ui/PlantGrow";
// import { RefreshCw } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// export const GroupListView = () => {
//   const { groups, loading, error, fetchGroups } = useGroup();
//   const { canManageSystem } = useAuthRoles();

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [loadError, setLoadError] = useState(null);
//   const [isLoading, setIsLoading] = useState(loading);

//   // Sincroniza loading con el hook original
//   useEffect(() => {
//     setIsLoading(loading);
//   }, [loading]);

//   // Refrescar lista de grupos
//   const refreshGroups = async () => {
//     setIsLoading(true);
//     setLoadError(null);
//     try {
//       await fetchGroups();
//     } catch (err) {
//       setLoadError("No se pudieron cargar los grupos. Intente nuevamente.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Filtrado de grupos
//   const filteredGroups = useMemo(() => {
//     if (!searchQuery.trim()) return groups || [];
//     const term = searchQuery.toLowerCase();
//     return (
//       groups?.filter((group) => {
//         const nameMatch = group.name?.toLowerCase().includes(term);
//         const descMatch = group.description?.toLowerCase().includes(term);
//         const typeMatch = group.type?.toLowerCase().includes(term);
//         return nameMatch || descMatch || typeMatch;
//       }) || []
//     );
//   }, [groups, searchQuery]);

//   // Cuando se crea un grupo nuevo, refresca la lista y cierra modal
//   const handleGroupCreated = () => {
//     setIsModalOpen(false);
//     refreshGroups();
//   };

//   // Mensaje de carga
//   if (isLoading) {
//     return (
//       <div className="text-center py-8">
//         <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//         <p className="mt-2 text-gray-600">Cargando grupos...</p>
//       </div>
//     );
//   }

//   // Mensaje de error
//   if (loadError || error) {
//     return (
//       <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//         <p>{loadError || "No hay grupos para mostrar."}</p>
//         {canManageSystem() && (
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="mt-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//           >
//             Crear Grupo
//           </button>
//         )}
//         <button
//           onClick={refreshGroups}
//           className="mt-2 ml-4 text-sm underline hover:text-red-800"
//         >
//           Intentar nuevamente
//         </button>
//         {isModalOpen && (
//           <GroupFormModal
//             onClose={() => setIsModalOpen(false)}
//             onGroupCreated={handleGroupCreated}
//           />
//         )}
//       </div>
//     );
//   }

//   return (
//     <div className="p-2 md:p-4 w-full max-w-full">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
//         <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-6">
//           Grupos de la comunidad
//         </h1>
//         <div className="flex justify-center gap-2 flex-wrap">
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//         </div>
//       </div>

//       {/* Barra de búsqueda y refrescar */}
//       <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
//         <div className="flex-grow">
//           <SearchBar
//             onSearch={setSearchQuery}
//             className="w-full"
//             placeholder="Buscar grupo por nombre, descripción o tipo..."
//           />
//         </div>
//         <div className="flex gap-2 justify-end">
//           <button
//             onClick={refreshGroups}
//             className="flex items-center px-2 py-2 md:px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//             title="Refrescar grupos"
//           >
//             <RefreshCw className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Botón para crear grupo */}
//       {canManageSystem() && (
//         <div className="flex justify-end mb-3">
//           <button
//             onClick={() => setIsModalOpen(true)}
//             className="bg-primary text-white px-2 py-2 md:px-4 rounded-md hover:bg-green-600 flex items-center text-sm md:text-base"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4v16m8-8H4"
//               />
//             </svg>
//             <span className="hidden xs:inline">Crear Grupo</span>
//             <span className="xs:hidden">Nuevo</span>
//           </button>
//         </div>
//       )}

//       {/* Lista de grupos */}
//       <div className="flex flex-col gap-4 w-full max-w-full">
//         <AnimatePresence>
//           {filteredGroups.length > 0 ? (
//             filteredGroups.map((group, idx) => (
//               <motion.div
//                 key={group.id}
//                 initial={{ opacity: 0, y: 32 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -32 }}
//                 transition={{
//                   duration: 0.35,
//                   delay: idx * 0.06,
//                   ease: "easeInOut",
//                 }}
//                 whileHover={{
//                   scale: 1.015,
//                   boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                 }}
//                 className="w-full"
//               >
//                 <GroupCard group={group} />
//               </motion.div>
//             ))
//           ) : (
//             <div className="bg-gray-50 text-center py-8 px-2 rounded-lg w-full">
//               <p className="text-gray-500">
//                 {searchQuery
//                   ? `No se encontraron grupos para "${searchQuery}"`
//                   : "No hay grupos disponibles."}
//               </p>
//               {canManageSystem() && (
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="mt-4 text-primary hover:underline"
//                 >
//                   ¡Crea el primer grupo!
//                 </button>
//               )}
//             </div>
//           )}
//         </AnimatePresence>
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


// import React, { useMemo, useState, useEffect } from "react";
// import { GroupCard } from "../ui/GroupCard";
// import { GroupFormModal } from "../ui/GroupFormModal";
// import { SearchBar } from "../ui/SearchBar";
// import { useGroup } from "../hooks/useGroup";
// import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";

// /**
//  * Vista principal para mostrar la lista de grupos en Germogli.
//  * Utiliza el hook y contexto modularizados para mantener la UI reactiva y limpia.
//  */
// export const GroupListView = () => {
//   // Usa el hook personalizado que conecta con el contexto global de grupos
//   const { groups, loading, error, fetchGroups } = useGroup();
//   const { canManageSystem, user } = useAuthRoles();

//   // Estado local para controlar el modal de creación de grupo
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Estado local para la búsqueda de grupos
//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     console.log('Estado actual del modal:', isModalOpen);
//     console.log('Usuario actual:', user);
//     console.log('¿Puede administrar?:', canManageSystem());
//     console.log('Grupos cargados:', groups);
//     console.log('Estado de carga:', loading);
//     console.log('Error si existe:', error);
//   }, [isModalOpen, user, groups, loading, error]);

//   // Filtrado de grupos por búsqueda, usando useMemo para optimización
//   const filteredGroups = useMemo(() => {
//     if (!searchQuery) return groups;
//     return groups?.filter((group) =>
//       group.name.toLowerCase().includes(searchQuery.toLowerCase())
//     ) || [];
//   }, [groups, searchQuery]);

//   // Cuando se crea un grupo, recarga la lista global de grupos
//   const handleGroupCreated = () => {
//     console.log('Grupo creado exitosamente');
//     fetchGroups(); // Refresca la lista usando el método del contexto
//     setIsModalOpen(false);
//   };

//   const handleOpenModal = () => {
//     console.log('Intentando abrir el modal...');
//     console.log('¿Usuario puede administrar?:', canManageSystem());
//     setIsModalOpen(true);
//     console.log('Estado del modal después de setIsModalOpen:', true);
//   };

//   const renderModal = () => {
//     console.log('Intentando renderizar el modal, isModalOpen:', isModalOpen);
//     if (!isModalOpen) return null;

//     return (
//       <div className="fixed inset-0 z-50">
//         <GroupFormModal
//           onClose={() => {
//             console.log('Cerrando modal...');
//             setIsModalOpen(false);
//           }}
//           onGroupCreated={handleGroupCreated}
//         />
//       </div>
//     );
//   };

//   // Loading y error manejados de forma modular
//   if (loading) {
//     console.log('Renderizando estado de carga...');
//     return (
//       <>
//         <div>Cargando grupos...</div>
//         {renderModal()}
//       </>
//     );
//   }

//   if (error || !groups || groups.length === 0) {
//     console.log('Renderizando estado de error o sin grupos...');
//     console.log('Error:', error);
//     console.log('Grupos:', groups);
//     return (
//       <>
//         <div className="text-center p-8">
//           <p className="text-gray-600 mb-4">No hay grupos disponibles en este momento.</p>
//           {canManageSystem() && (
//             <button
//               onClick={handleOpenModal}
//               className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//             >
//               Crear Grupo
//             </button>
//           )}
//         </div>
//         {renderModal()}
//       </>
//     );
//   }

//   return (
//     <>
//       <div className="p-4">
//         <div className="mb-4">
//           <SearchBar onSearch={setSearchQuery} className="w-full" />
//         </div>
//         {canManageSystem() && (
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={handleOpenModal}
//               className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//             >
//               Crear Grupo
//             </button>
//           </div>
//         )}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredGroups.length > 0 ? (
//             filteredGroups.map((group) => (
//               <GroupCard key={group.id} group={group} />
//             ))
//           ) : (
//             <p className="text-gray-500 text-center col-span-full">No hay grupos disponibles.</p>
//           )}
//         </div>
//       </div>
//       {renderModal()}
//     </>
//   );
// };


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


