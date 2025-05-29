import React, { useState, useContext, useCallback, useRef } from "react";
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { AuthContext } from "../../authentication/context/AuthContext";
import { ThreadList } from "../ui/ThreadList";

export const ThreadForumView = () => {
  const { user } = useContext(AuthContext);
  const reloadThreadsRef = useRef(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Callbacks optimizados
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  
   // Handler que se pasa al modal y se ejecuta tras crear un hilo
  const handleThreadCreated = useCallback(() => {
    setShowModal(false);
    // Llama a la función de recarga si existe
    if (reloadThreadsRef.current) {
      reloadThreadsRef.current();
    }
  }, []);
  return (
    <div className="w-full px-0 sm:px-4 my-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-2 mb-5">
        <h1 className="text-2xl font-bold">Foro de discusión</h1>
        <button
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Crear hilo
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="flex-grow flex items-center gap-2">
          <input
            type="text"
            className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Buscar hilos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled
          />
          <button className="text-gray-600" tabIndex={-1} type="button" disabled>
            <FaSearch />
          </button>
        </div>
      </div>

      {/* Lista de hilos usando ThreadList, pasando groupId={null} */}
      <ThreadList groupId={null}
      refetchRef={reloadThreadsRef}
      />

      {/* Modal para crear hilo */}
      {showModal && (
        <ThreadFormModal
          groupId={null}
          onClose={handleCloseModal}
          onThreadCreated={handleThreadCreated}
        />
      )}
    </div>
  );
};


// import React, { useState, useContext, useCallback, useEffect } from "react";
// import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { ThreadFormModal } from "../ui/ThreadFormModal";
// import { useThread } from "../hooks/useThread";
// import { AuthContext } from "../../authentication/context/AuthContext";

// export const ThreadForumView = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user?.id || user?.userId;
  
//   const [search, setSearch] = useState("");
//   const [sortOption, setSortOption] = useState("recent");
//   const [showModal, setShowModal] = useState(false);
//   const [showSortOptions, setShowSortOptions] = useState(false);
//   const [dropdownFilter, setDropdownFilter] = useState("all");
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const [groups, setGroups] = useState([]);
  
//   // ✅ Estados para controlar la carga manual
//   const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
//   const [lastFilter, setLastFilter] = useState("all");
//   const [lastUserId, setLastUserId] = useState(null);
//   const [lastGroupId, setLastGroupId] = useState("");

//   const {
//     threads,
//     loading,
//     error,
//     fetchForumThreads,
//     fetchThreadsByUser,
//     fetchThreadsByGroup,
//     successMessage
//   } = useThread();

//   // ✅ Efecto controlado que solo se ejecuta cuando es necesario
//   useEffect(() => {
//     const shouldLoadThreads = 
//       !hasLoadedInitial || 
//       lastFilter !== dropdownFilter ||
//       lastUserId !== userId ||
//       lastGroupId !== selectedGroup;

//     if (!shouldLoadThreads) return;

//     const loadThreads = async () => {
//       try {
//         console.log('🔄 Cargando hilos - Filtro:', dropdownFilter);
        
//         if (dropdownFilter === "user" && userId) {
//           await fetchThreadsByUser(userId);
//         } else if (dropdownFilter === "group" && selectedGroup) {
//           await fetchThreadsByGroup(selectedGroup);
//         } else {
//           await fetchForumThreads();
//         }

//         // ✅ Marcar como cargado y actualizar estados de control
//         setHasLoadedInitial(true);
//         setLastFilter(dropdownFilter);
//         setLastUserId(userId);
//         setLastGroupId(selectedGroup);
        
//       } catch (err) {
//         console.error('❌ Error cargando hilos:', err);
//       }
//     };

//     loadThreads();
//   }, [
//     dropdownFilter, 
//     userId, 
//     selectedGroup, 
//     hasLoadedInitial, 
//     lastFilter, 
//     lastUserId, 
//     lastGroupId
//     // ✅ NO incluir las funciones fetch como dependencias
//   ]);

//   // ✅ Función para filtrar y ordenar hilos (memoizada)
//   const getFilteredAndSortedThreads = useCallback(() => {
//     if (!threads || !Array.isArray(threads)) {
//       return [];
//     }

//     return threads
//       .filter((thread) => {
//         const searchLower = search.toLowerCase();
//         return (
//           thread.content?.toLowerCase().includes(searchLower) ||
//           thread.title?.toLowerCase().includes(searchLower) ||
//           thread.authorName?.toLowerCase().includes(searchLower)
//         );
//       })
//       .sort((a, b) => {
//         const dateA = new Date(a.creation_date || a.creationDate || a.createdAt);
//         const dateB = new Date(b.creation_date || b.creationDate || b.createdAt);
        
//         return sortOption === "recent" ? dateB - dateA : dateA - dateB;
//       });
//   }, [threads, search, sortOption]);

//   // ✅ Callbacks optimizados
//   const handleCloseModal = useCallback(() => setShowModal(false), []);
  
//   const handleThreadCreated = useCallback(() => {
//     setShowModal(false);
//     // ✅ Forzar recarga marcando como no cargado
//     setHasLoadedInitial(false);
//   }, []);

//   // ✅ Handler para cambio de filtro
//   const handleFilterChange = useCallback((newFilter) => {
//     if (newFilter !== dropdownFilter) {
//       setDropdownFilter(newFilter);
//       // El useEffect se encargará de cargar los nuevos datos
//     }
//   }, [dropdownFilter]);

//   const filteredThreads = getFilteredAndSortedThreads();

//   return (
//     <div className="w-full px-0 sm:px-4 my-8">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b pb-2 mb-5">
//         <h1 className="text-2xl font-bold">Foro de discusión</h1>
//         <button
//           className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors"
//           onClick={() => setShowModal(true)}
//         >
//           <FaPlus /> Crear hilo
//         </button>
//       </div>

//       {/* Mensaje de éxito */}
//       {successMessage && (
//         <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
//           <p className="text-green-600 font-medium">{successMessage}</p>
//         </div>
//       )}

//       {/* Filtros y búsqueda */}
//       <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
//         <div className="relative min-w-[220px]">
//           <div
//             className="border rounded p-2 font-semibold text-gray-700 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50 transition-colors"
//             onClick={() => setShowSortOptions((prev) => !prev)}
//           >
//             Ordenar y ver
//             <span className="ml-2">
//               {showSortOptions ? <FaChevronUp /> : <FaChevronDown />}
//             </span>
//           </div>
//           {showSortOptions && (
//             <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
//               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
//                 <input
//                   type="radio"
//                   name="dropdown-filter"
//                   checked={dropdownFilter === "all"}
//                   onChange={() => handleFilterChange("all")}
//                 />
//                 <span className="text-sm">Ver todos los hilos</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
//                 <input
//                   type="radio"
//                   name="dropdown-filter"
//                   checked={dropdownFilter === "user"}
//                   onChange={() => handleFilterChange("user")}
//                 />
//                 <span className="text-sm">Mis hilos</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
//                 <input
//                   type="radio"
//                   name="dropdown-filter"
//                   checked={dropdownFilter === "group"}
//                   onChange={() => handleFilterChange("group")}
//                 />
//                 <span className="text-sm">Filtrar por grupo</span>
//               </label>
//               {dropdownFilter === "group" && (
//                 <div className="p-2">
//                   <select
//                     className="w-full border rounded px-3 py-2"
//                     value={selectedGroup}
//                     onChange={(e) => setSelectedGroup(e.target.value)}
//                   >
//                     <option value="">Todos los grupos</option>
//                     {groups.map((group) => (
//                       <option
//                         key={group.group_id || group.id}
//                         value={group.group_id || group.id}
//                       >
//                         {group.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               )}
//               <div className="border-t my-1"></div>
//               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
//                 <input
//                   type="radio"
//                   name="sort"
//                   checked={sortOption === "recent"}
//                   onChange={() => setSortOption("recent")}
//                 />
//                 <span className="text-sm">Activo recientemente</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
//                 <input
//                   type="radio"
//                   name="sort"
//                   checked={sortOption === "date"}
//                   onChange={() => setSortOption("date")}
//                 />
//                 <span className="text-sm">Fecha de publicación</span>
//               </label>
//             </div>
//           )}
//         </div>
        
//         <div className="flex-grow flex items-center gap-2">
//           <input
//             type="text"
//             className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//             placeholder="Buscar hilos..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button className="text-gray-600" tabIndex={-1} type="button">
//             <FaSearch />
//           </button>
//         </div>
//       </div>

//       {/* ✅ Lista de hilos con indicador de carga estable */}
//       <div>
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
//             <span className="text-gray-500">Cargando hilos...</span>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <p className="text-red-600 font-medium">Error al cargar hilos</p>
//             <p className="text-red-500 text-sm mt-1">{error}</p>
//             <button 
//               className="mt-3 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700"
//               onClick={() => setHasLoadedInitial(false)}
//             >
//               Reintentar
//             </button>
//           </div>
//         ) : filteredThreads.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8">
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 No hay hilos disponibles
//               </h3>
//               <p className="text-gray-500 mb-4">
//                 {search ? 
//                   `No se encontraron hilos que coincidan con "${search}"` :
//                   dropdownFilter === "user" ? 
//                     "Aún no has creado ningún hilo." :
//                     "Sé el primero en iniciar una discusión."
//                 }
//               </p>
//               <button
//                 className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
//                 onClick={() => setShowModal(true)}
//               >
//                 Crear primer hilo
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className="space-y-6">
//             {filteredThreads.map((thread) => (
//               <article 
//                 key={thread.thread_id || thread.id} 
//                 className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className="flex-shrink-0">
//                     <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
//                       <span className="text-gray-600 font-medium">
//                         {(thread.authorName || thread.userName || "U").charAt(0).toUpperCase()}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 mb-2">
//                       <h3 className="font-semibold text-gray-900 truncate">
//                         {thread.authorName || thread.userName || "Usuario"}
//                       </h3>
//                       <span className="text-gray-400">•</span>
//                       <time className="text-sm text-gray-500">
//                         {new Date(
//                           thread.creation_date ||
//                           thread.creationDate ||
//                           thread.createdAt
//                         ).toLocaleDateString("es-ES", {
//                           year: "numeric",
//                           month: "short",
//                           day: "numeric",
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </time>
//                     </div>
                    
//                     <h2 className="text-lg font-bold text-gray-900 mb-2">
//                       {thread.title}
//                     </h2>
                    
//                     <p className="text-gray-700 line-clamp-3">
//                       {thread.content}
//                     </p>
//                   </div>
//                 </div>
//               </article>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Modal para crear hilo */}
//       {showModal && (
//         <ThreadFormModal
//           groupId={null}
//           onClose={handleCloseModal}
//           onThreadCreated={handleThreadCreated}
//         />
//       )}
//     </div>
//   );
// };

