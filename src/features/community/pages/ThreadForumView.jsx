import React, { useState, useContext, useCallback, useEffect } from "react";
import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { useThread } from "../hooks/useThread";
import { AuthContext } from "../../authentication/context/AuthContext";

export const ThreadForumView = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id || user?.userId;
  
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState("recent");
  const [showModal, setShowModal] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [dropdownFilter, setDropdownFilter] = useState("all");
  const [selectedGroup, setSelectedGroup] = useState("");
  const [groups, setGroups] = useState([]);
  
  // ✅ Estados para controlar la carga manual
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
  const [lastFilter, setLastFilter] = useState("all");
  const [lastUserId, setLastUserId] = useState(null);
  const [lastGroupId, setLastGroupId] = useState("");

  const {
    threads,
    loading,
    error,
    fetchForumThreads,
    fetchThreadsByUser,
    fetchThreadsByGroup,
    successMessage
  } = useThread();

  // ✅ Efecto controlado que solo se ejecuta cuando es necesario
  useEffect(() => {
    const shouldLoadThreads = 
      !hasLoadedInitial || 
      lastFilter !== dropdownFilter ||
      lastUserId !== userId ||
      lastGroupId !== selectedGroup;

    if (!shouldLoadThreads) return;

    const loadThreads = async () => {
      try {
        console.log('🔄 Cargando hilos - Filtro:', dropdownFilter);
        
        if (dropdownFilter === "user" && userId) {
          await fetchThreadsByUser(userId);
        } else if (dropdownFilter === "group" && selectedGroup) {
          await fetchThreadsByGroup(selectedGroup);
        } else {
          await fetchForumThreads();
        }

        // ✅ Marcar como cargado y actualizar estados de control
        setHasLoadedInitial(true);
        setLastFilter(dropdownFilter);
        setLastUserId(userId);
        setLastGroupId(selectedGroup);
        
      } catch (err) {
        console.error('❌ Error cargando hilos:', err);
      }
    };

    loadThreads();
  }, [
    dropdownFilter, 
    userId, 
    selectedGroup, 
    hasLoadedInitial, 
    lastFilter, 
    lastUserId, 
    lastGroupId
    // ✅ NO incluir las funciones fetch como dependencias
  ]);

  // ✅ Función para filtrar y ordenar hilos (memoizada)
  const getFilteredAndSortedThreads = useCallback(() => {
    if (!threads || !Array.isArray(threads)) {
      return [];
    }

    return threads
      .filter((thread) => {
        const searchLower = search.toLowerCase();
        return (
          thread.content?.toLowerCase().includes(searchLower) ||
          thread.title?.toLowerCase().includes(searchLower) ||
          thread.authorName?.toLowerCase().includes(searchLower)
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.creation_date || a.creationDate || a.createdAt);
        const dateB = new Date(b.creation_date || b.creationDate || b.createdAt);
        
        return sortOption === "recent" ? dateB - dateA : dateA - dateB;
      });
  }, [threads, search, sortOption]);

  // ✅ Callbacks optimizados
  const handleCloseModal = useCallback(() => setShowModal(false), []);
  
  const handleThreadCreated = useCallback(() => {
    setShowModal(false);
    // ✅ Forzar recarga marcando como no cargado
    setHasLoadedInitial(false);
  }, []);

  // ✅ Handler para cambio de filtro
  const handleFilterChange = useCallback((newFilter) => {
    if (newFilter !== dropdownFilter) {
      setDropdownFilter(newFilter);
      // El useEffect se encargará de cargar los nuevos datos
    }
  }, [dropdownFilter]);

  const filteredThreads = getFilteredAndSortedThreads();

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

      {/* Mensaje de éxito */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
          <p className="text-green-600 font-medium">{successMessage}</p>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative min-w-[220px]">
          <div
            className="border rounded p-2 font-semibold text-gray-700 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50 transition-colors"
            onClick={() => setShowSortOptions((prev) => !prev)}
          >
            Ordenar y ver
            <span className="ml-2">
              {showSortOptions ? <FaChevronUp /> : <FaChevronDown />}
            </span>
          </div>
          {showSortOptions && (
            <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="dropdown-filter"
                  checked={dropdownFilter === "all"}
                  onChange={() => handleFilterChange("all")}
                />
                <span className="text-sm">Ver todos los hilos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="dropdown-filter"
                  checked={dropdownFilter === "user"}
                  onChange={() => handleFilterChange("user")}
                />
                <span className="text-sm">Mis hilos</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="dropdown-filter"
                  checked={dropdownFilter === "group"}
                  onChange={() => handleFilterChange("group")}
                />
                <span className="text-sm">Filtrar por grupo</span>
              </label>
              {dropdownFilter === "group" && (
                <div className="p-2">
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                  >
                    <option value="">Todos los grupos</option>
                    {groups.map((group) => (
                      <option
                        key={group.group_id || group.id}
                        value={group.group_id || group.id}
                      >
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="border-t my-1"></div>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="sort"
                  checked={sortOption === "recent"}
                  onChange={() => setSortOption("recent")}
                />
                <span className="text-sm">Activo recientemente</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
                <input
                  type="radio"
                  name="sort"
                  checked={sortOption === "date"}
                  onChange={() => setSortOption("date")}
                />
                <span className="text-sm">Fecha de publicación</span>
              </label>
            </div>
          )}
        </div>
        
        <div className="flex-grow flex items-center gap-2">
          <input
            type="text"
            className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Buscar hilos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="text-gray-600" tabIndex={-1} type="button">
            <FaSearch />
          </button>
        </div>
      </div>

      {/* ✅ Lista de hilos con indicador de carga estable */}
      <div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
            <span className="text-gray-500">Cargando hilos...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600 font-medium">Error al cargar hilos</p>
            <p className="text-red-500 text-sm mt-1">{error}</p>
            <button 
              className="mt-3 bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700"
              onClick={() => setHasLoadedInitial(false)}
            >
              Reintentar
            </button>
          </div>
        ) : filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay hilos disponibles
              </h3>
              <p className="text-gray-500 mb-4">
                {search ? 
                  `No se encontraron hilos que coincidan con "${search}"` :
                  dropdownFilter === "user" ? 
                    "Aún no has creado ningún hilo." :
                    "Sé el primero en iniciar una discusión."
                }
              </p>
              <button
                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                onClick={() => setShowModal(true)}
              >
                Crear primer hilo
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredThreads.map((thread) => (
              <article 
                key={thread.thread_id || thread.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-medium">
                        {(thread.authorName || thread.userName || "U").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {thread.authorName || thread.userName || "Usuario"}
                      </h3>
                      <span className="text-gray-400">•</span>
                      <time className="text-sm text-gray-500">
                        {new Date(
                          thread.creation_date ||
                          thread.creationDate ||
                          thread.createdAt
                        ).toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                      {thread.title}
                    </h2>
                    
                    <p className="text-gray-700 line-clamp-3">
                      {thread.content}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

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

// /**
//  * Vista optimizada del foro que maneja su propia carga de hilos
//  */
// export const ThreadForumView = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user?.id || user?.userId;

//   // ✅ Estados de UI
//   const [search, setSearch] = useState("");
//   const [sortOption, setSortOption] = useState("recent");
//   const [showModal, setShowModal] = useState(false);
//   const [showSortOptions, setShowSortOptions] = useState(false);
//   const [dropdownFilter, setDropdownFilter] = useState("all");
//   const [selectedGroup, setSelectedGroup] = useState("");

//   // ✅ Hook para manejar hilos directamente
//   const {
//     threads,
//     loading,
//     error,
//     fetchForumThreads,
//     fetchThreadsByUser,
//     fetchThreadsByGroup,
//     successMessage
//   } = useThread();

//   // ✅ Estados para grupos (esto debería venir de un contexto de grupos)
//   const [groups, setGroups] = useState([]);

//   // ✅ Cargar hilos según el filtro seleccionado
//   useEffect(() => {
//     const loadThreads = async () => {
//       try {
//         if (dropdownFilter === "user" && userId) {
//           await fetchThreadsByUser(userId);
//         } else if (dropdownFilter === "group" && selectedGroup) {
//           await fetchThreadsByGroup(selectedGroup);
//         } else {
//           // ✅ Cargar hilos del foro general
//           await fetchForumThreads();
//         }
//       } catch (err) {
//         console.error('Error cargando hilos:', err);
//       }
//     };

//     loadThreads();
//   }, [dropdownFilter, userId, selectedGroup, fetchForumThreads, fetchThreadsByUser, fetchThreadsByGroup]);

//   // ✅ Filtrado y ordenamiento de hilos
//   const filteredAndSortedThreads = useCallback(() => {
//     if (!threads || !Array.isArray(threads)) return [];

//     return threads
//       .filter((thread) => {
//         // Filtro de búsqueda
//         const searchLower = search.toLowerCase();
//         const matchesSearch = 
//           thread.content?.toLowerCase().includes(searchLower) ||
//           thread.title?.toLowerCase().includes(searchLower) ||
//           thread.authorName?.toLowerCase().includes(searchLower);

//         return matchesSearch;
//       })
//       .sort((a, b) => {
//         const dateA = new Date(a.creation_date || a.creationDate || a.createdAt);
//         const dateB = new Date(b.creation_date || b.creationDate || b.createdAt);
        
//         return sortOption === "recent" ? dateB - dateA : dateA - dateB;
//       });
//   }, [threads, search, sortOption]);

//   // ✅ Callbacks memoizados
//   const handleCloseModal = useCallback(() => setShowModal(false), []);
  
//   const handleThreadCreated = useCallback(() => {
//     setShowModal(false);
//     // Recargar hilos según el filtro actual
//     if (dropdownFilter === "user" && userId) {
//       fetchThreadsByUser(userId);
//     } else if (dropdownFilter === "group" && selectedGroup) {
//       fetchThreadsByGroup(selectedGroup);
//     } else {
//       fetchForumThreads();
//     }
//   }, [dropdownFilter, userId, selectedGroup, fetchThreadsByUser, fetchThreadsByGroup, fetchForumThreads]);

//   const displayedThreads = filteredAndSortedThreads();

//   return (
//     <div className="w-full px-0 sm:px-4 my-8">
//       {/* ✅ Header */}
//       <header className="flex items-center justify-between border-b pb-2 mb-5">
//         <h1 className="text-2xl font-bold">Foro de discusión</h1>
//         <button
//           className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition-colors duration-200"
//           onClick={() => setShowModal(true)}
//         >
//           <FaPlus aria-hidden="true" />
//           Crear hilo
//         </button>
//       </header>

//       {/* ✅ Mensajes de estado */}
//       {successMessage && (
//         <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
//           <p className="text-green-600 font-medium">{successMessage}</p>
//         </div>
//       )}

//       {/* ✅ Filtros y búsqueda */}
//       <section className="flex flex-col sm:flex-row items-center gap-4 mb-8">
//         {/* Dropdown de ordenamiento y filtro */}
//         <div className="relative min-w-[220px]">
//           <button
//             className="w-full border rounded p-2 font-semibold text-gray-700 flex items-center justify-between cursor-pointer select-none hover:bg-gray-50 transition-colors"
//             onClick={() => setShowSortOptions((prev) => !prev)}
//             aria-expanded={showSortOptions}
//             aria-haspopup="true"
//           >
//             Ordenar y ver
//             <span className="ml-2" aria-hidden="true">
//               {showSortOptions ? <FaChevronUp /> : <FaChevronDown />}
//             </span>
//           </button>
          
//           {showSortOptions && (
//             <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
//               {/* Filtros de visualización */}
//               <div className="p-2 border-b">
//                 <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
//                   Mostrar hilos
//                 </h4>
//                 <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
//                   <input
//                     type="radio"
//                     name="dropdown-filter"
//                     checked={dropdownFilter === "all"}
//                     onChange={() => setDropdownFilter("all")}
//                   />
//                   <span className="text-sm">Todos los hilos</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
//                   <input
//                     type="radio"
//                     name="dropdown-filter"
//                     checked={dropdownFilter === "user"}
//                     onChange={() => setDropdownFilter("user")}
//                   />
//                   <span className="text-sm">Mis hilos</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
//                   <input
//                     type="radio"
//                     name="dropdown-filter"
//                     checked={dropdownFilter === "group"}
//                     onChange={() => setDropdownFilter("group")}
//                   />
//                   <span className="text-sm">Filtrar por grupo</span>
//                 </label>
                
//                 {/* Selector de grupo */}
//                 {dropdownFilter === "group" && (
//                   <div className="mt-2">
//                     <select
//                       className="w-full border rounded px-3 py-2 text-sm"
//                       value={selectedGroup}
//                       onChange={(e) => setSelectedGroup(e.target.value)}
//                     >
//                       <option value="">Todos los grupos</option>
//                       {groups.length === 0 ? (
//                         <option value="" disabled>No hay grupos disponibles</option>
//                       ) : (
//                         groups.map((group) => (
//                           <option
//                             key={group.group_id || group.id}
//                             value={group.group_id || group.id}
//                           >
//                             {group.name}
//                           </option>
//                         ))
//                       )}
//                     </select>
//                   </div>
//                 )}
//               </div>
              
//               {/* Opciones de ordenamiento */}
//               <div className="p-2">
//                 <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">
//                   Ordenar por
//                 </h4>
//                 <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
//                   <input
//                     type="radio"
//                     name="sort"
//                     checked={sortOption === "recent"}
//                     onChange={() => setSortOption("recent")}
//                   />
//                   <span className="text-sm">Más recientes</span>
//                 </label>
//                 <label className="flex items-center gap-2 cursor-pointer p-1 hover:bg-gray-100 rounded">
//                   <input
//                     type="radio"
//                     name="sort"
//                     checked={sortOption === "date"}
//                     onChange={() => setSortOption("date")}
//                   />
//                   <span className="text-sm">Más antiguos</span>
//                 </label>
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Búsqueda */}
//         <div className="flex-grow flex items-center gap-2">
//           <div className="relative flex-grow">
//             <input
//               type="text"
//               className="border rounded-full px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
//               placeholder="Buscar hilos..."
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//             <button 
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" 
//               tabIndex={-1} 
//               type="button"
//               aria-hidden="true"
//             >
//               <FaSearch />
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* ✅ Lista de hilos */}
//       <main>
//         {loading ? (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mr-3"></div>
//             <span className="text-gray-500">Cargando hilos...</span>
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-md p-4">
//             <p className="text-red-600 font-medium">Error al cargar hilos</p>
//             <p className="text-red-500 text-sm mt-1">{error}</p>
//           </div>
//         ) : displayedThreads.length === 0 ? (
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
//             {displayedThreads.map((thread) => (
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
//       </main>

//       {/* ✅ Modal para crear hilo */}
//       {showModal && (
//         <ThreadFormModal
//           groupId={null} // Hilo sin grupo específico (foro general)
//           onClose={handleCloseModal}
//           onThreadCreated={handleThreadCreated}
//         />
//       )}
//     </div>
//   );
// };



// import React, { useState, useContext, useCallback } from "react";
// import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { ThreadFormModal } from "../ui/ThreadFormModal";
// import { ThreadList } from "../ui/ThreadList";
// import { AuthContext } from "../../authentication/context/AuthContext";

// const exampleThreads = [
//   {
//     thread_id: 1,
//     authorName: "Santiago Ramirez",
//     creation_date: "2024-04-27T13:09:00",
//     title: "¿Qué sistema de hidroponía es mejor?",
//     content:
//       "¡Hola a todos! Estoy comenzando con hidroponía y quiero saber qué tipo de sistema es mejor para cultivos de lechuga. ¿Alguna recomendación?",
//     group_id: 1,
//     user_id: 1,
//   },
// ];

// export const ThreadForumView = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user?.id || user?.userId;
//   const [search, setSearch] = useState("");
//   const [sortOption, setSortOption] = useState("recent");
//   const [showModal, setShowModal] = useState(false);
//   const [showSortOptions, setShowSortOptions] = useState(false);
//   const [dropdownFilter, setDropdownFilter] = useState("all");
//   const [selectedGroup, setSelectedGroup] = useState("");
//   const [allThreads, setAllThreads] = useState(exampleThreads); // fallback inicial
//   const [groups, setGroups] = useState([]);

//   // Callback para obtener los hilos cargados por ThreadList
//   const handleThreadsLoaded = useCallback((threads) => {
//     if (Array.isArray(threads) && threads.length > 0) {
//       setAllThreads(threads);
//     } else {
//       setAllThreads(exampleThreads); // fallback si la API falla o retorna vacío
//     }
//   }, []);

//   // Filtro y ordenamiento aplicados sobre allThreads
//   let filteredThreads = allThreads
//     .filter(
//       (thread) =>
//         thread.content?.toLowerCase().includes(search.toLowerCase()) ||
//         thread.title?.toLowerCase().includes(search.toLowerCase())
//     )
//     .filter((thread) => {
//       let matchesDropdown = true;
//       if (dropdownFilter === "user" && userId) {
//         matchesDropdown = thread.user_id === userId || thread.userId === userId;
//       } else if (dropdownFilter === "group" && selectedGroup) {
//         matchesDropdown =
//           String(thread.group_id) === String(selectedGroup) ||
//           String(thread.groupId) === String(selectedGroup);
//       }
//       return matchesDropdown;
//     })
//     .sort((a, b) => {
//       if (sortOption === "recent") {
//         return (
//           new Date(b.creation_date || b.creationDate || b.createdAt) -
//           new Date(a.creation_date || a.creationDate || a.createdAt)
//         );
//       } else {
//         return (
//           new Date(a.creation_date || a.creationDate || a.createdAt) -
//           new Date(b.creation_date || b.creationDate || b.createdAt)
//         );
//       }
//     });

//   return (
//     <div className="w-full px-0 sm:px-4 my-8">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b pb-2 mb-5">
//         <h1 className="text-2xl font-bold">Foro de discusion</h1>
//         <button
//           className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
//           onClick={() => setShowModal(true)}
//         >
//           <FaPlus /> Crear hilo
//         </button>
//       </div>
//       {/* Filtros y búsqueda */}
//       <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
//         {/* Dropdown de ordenamiento y filtro */}
//         <div className="relative min-w-[220px]">
//           <div
//             className="border rounded p-2 font-semibold text-gray-700 flex items-center justify-between cursor-pointer select-none"
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
//                   onChange={() => setDropdownFilter("all")}
//                 />
//                 <span className="text-sm">Ver todos los hilos</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
//                 <input
//                   type="radio"
//                   name="dropdown-filter"
//                   checked={dropdownFilter === "user"}
//                   onChange={() => setDropdownFilter("user")}
//                 />
//                 <span className="text-sm">Mis hilos</span>
//               </label>
//               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
//                 <input
//                   type="radio"
//                   name="dropdown-filter"
//                   checked={dropdownFilter === "group"}
//                   onChange={() => setDropdownFilter("group")}
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
//                     {groups.length === 0 ? (
//                       <option value="">No hay grupos disponibles</option>
//                     ) : (
//                       groups.map((group) => (
//                         <option
//                           key={group.group_id || group.id}
//                           value={group.group_id || group.id}
//                         >
//                           {group.name}
//                         </option>
//                       ))
//                     )}
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
//         {/* Buscar */}
//         <div className="flex-grow flex items-center gap-2">
//           <input
//             type="text"
//             className="border rounded-full px-4 py-2 w-full focus:outline-none"
//             placeholder="Buscar"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//           <button className="text-gray-600" tabIndex={-1} type="button">
//             <FaSearch />
//           </button>
//         </div>
//       </div>
//       {/* Lista de hilos */}
//       <div>
//         {filteredThreads.length === 0 ? (
//           <div className="text-gray-400 text-center py-10">
//             No hay hilos disponibles.
//           </div>
//         ) : (
//           filteredThreads.map((thread) => (
//             <div key={thread.thread_id || thread.id} className="mb-7">
//               <div className="flex items-start gap-3">
//                 <div className="text-3xl text-gray-400 mt-1">👤</div>
//                 <div className="flex-1">
//                   <div className="font-semibold">
//                     {thread.authorName || thread.userName || "Usuario"}{" "}
//                     <span className="text-xs font-normal text-gray-600">
//                       —{" "}
//                       {new Date(
//                         thread.creation_date ||
//                           thread.creationDate ||
//                           thread.createdAt
//                       ).toLocaleDateString("es-ES", {
//                         year: "numeric",
//                         month: "numeric",
//                         day: "numeric",
//                       })}
//                       ,{" "}
//                       {new Date(
//                         thread.creation_date ||
//                           thread.creationDate ||
//                           thread.createdAt
//                       ).toLocaleTimeString("es-ES", {
//                         hour: "2-digit",
//                         minute: "2-digit",
//                       })}
//                     </span>
//                   </div>
//                   <div className="font-bold text-lg">{thread.title}</div>
//                   <div className="mt-1 text-gray-800">{thread.content}</div>
//                 </div>
//               </div>
//               <div className="text-xs text-gray-400 mt-2 mb-2 flex items-center">
//                 <div className="flex-grow border-t border-gray-200"></div>
//                 <span className="mx-2">
//                   {new Date(
//                     thread.creation_date ||
//                       thread.creationDate ||
//                       thread.createdAt
//                   ).toLocaleDateString("es-ES", {
//                     year: "numeric",
//                     month: "long",
//                     day: "numeric",
//                   })}
//                 </span>
//                 <div className="flex-grow border-t border-gray-200"></div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//       {/* ThreadList "oculta", solo para cargar los hilos y pasarlos al padre */}
//       <div style={{ display: "none" }}>
//         <ThreadList onThreadsLoaded={handleThreadsLoaded} />
//       </div>
//       {showModal && (
//         <ThreadFormModal
//           groupId={null} // hilo sin grupo
//           onClose={() => setShowModal(false)}
//           onThreadCreated={() => {
//             setShowModal(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };
// // import React, { useState, useEffect, useContext } from "react";
// // import { FaUserCircle, FaSearch, FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";
// // import { ThreadFormModal } from "../ui/ThreadFormModal";
// // import { communityService } from "../services/communityService";
// // import { isThreadValid } from "../utils/threadHelpers";
// // import { AuthContext } from "../../authentication/context/AuthContext"; // Ajusta la ruta según tu estructura

// // const exampleThreads = [
// //   {
// //     thread_id: 1,
// //     authorName: "Santiago Ramirez",
// //     creation_date: "2024-04-27T13:09:00",
// //     title: "¿Qué sistema de hidroponía es mejor?",
// //     content:
// //       "¡Hola a todos! Estoy comenzando con hidroponía y quiero saber qué tipo de sistema es mejor para cultivos de lechuga. ¿Alguna recomendación?",
// //     group_id: 1,
// //     user_id: 1,
// //   },
// // ];

// // export const ThreadForumView = () => {
// //   const { user } = useContext(AuthContext); // Ajusta si tu contexto usa otro nombre o estructura
// //   const userId = user?.id || user?.userId;   // Ajusta si tu contexto es diferente
// //   const [threads, setThreads] = useState([]);
// //   const [groups, setGroups] = useState([]);
// //   const [search, setSearch] = useState("");
// //   const [sortOption, setSortOption] = useState("recent");
// //   const [showModal, setShowModal] = useState(false);
// //   const [showSortOptions, setShowSortOptions] = useState(false);
// //   const [dropdownFilter, setDropdownFilter] = useState("all"); // "all", "user", "group"
// //   const [selectedGroup, setSelectedGroup] = useState(""); // Para opción de grupo en el dropdown

// //   // Fetch grupos del usuario
// //   useEffect(() => {
// //     const fetchGroups = async () => {
// //       try {
// //         const allGroups = await communityService.getAllGroups();
// //         let userGroups = Array.isArray(allGroups)
// //           ? allGroups
// //           : Array.isArray(allGroups?.data)
// //           ? allGroups.data
// //           : [];

// //         // Si cada grupo tiene un campo miembros, filtra solo los grupos donde el userId esté presente
// //         userGroups = userGroups.filter(
// //           (group) =>
// //             !group.members ||
// //             group.members.includes(userId) ||
// //             group.user_id === userId ||
// //             (group.users && group.users.some((u) => u.id === userId))
// //         );

// //         setGroups(userGroups);
// //       } catch (err) {
// //         setGroups([]);
// //       }
// //     };
// //     if (userId) fetchGroups();
// //   }, [userId]);

// //   // Fetch threads
// //   const fetchThreads = async () => {
// //     try {
// //       const response = await communityService.getAllThreads();
// //       let threadsData = [];
// //       if (Array.isArray(response.data)) {
// //         threadsData = response.data;
// //       } else if (Array.isArray(response)) {
// //         threadsData = response;
// //       } else if (Array.isArray(response.data?.data)) {
// //         threadsData = response.data.data;
// //       }
// //       setThreads(threadsData.length ? threadsData : exampleThreads);
// //     } catch (err) {
// //       setThreads(exampleThreads);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchThreads();
// //   }, []);

// //   // Refresca después de crear un hilo
// //   const handleThreadCreated = () => {
// //     fetchThreads();
// //     setShowModal(false);
// //   };

// //   // Filtro y ordenamiento
// //   let filteredThreads = threads
// //     .filter(isThreadValid)
// //     .filter((thread) => {
// //       // Filtro por texto
// //       const matchesText =
// //         thread.content.toLowerCase().includes(search.toLowerCase()) ||
// //         thread.title.toLowerCase().includes(search.toLowerCase());
// //       // Filtro de dropdown
// //       let matchesDropdown = true;
// //       if (dropdownFilter === "user" && userId) {
// //         matchesDropdown =
// //           thread.user_id === userId ||
// //           thread.userId === userId; // Por compatibilidad con ambos keys
// //       } else if (dropdownFilter === "group" && selectedGroup) {
// //         matchesDropdown =
// //           String(thread.group_id) === String(selectedGroup) ||
// //           String(thread.groupId) === String(selectedGroup); // Por compatibilidad con ambos keys
// //       }
// //       return matchesText && matchesDropdown;
// //     })
// //     .sort((a, b) => {
// //       if (sortOption === "recent") {
// //         return new Date(b.creation_date || b.creationDate) - new Date(a.creation_date || a.creationDate);
// //       } else {
// //         return new Date(a.creation_date || a.creationDate) - new Date(b.creation_date || b.creationDate);
// //       }
// //     });

// //   return (
// //     <div className="w-full px-0 sm:px-4 my-8">
// //       {/* Header */}
// //       <div className="flex items-center justify-between border-b pb-2 mb-5">
// //         <h1 className="text-2xl font-bold">Foro de discusion</h1>
// //         <button
// //           className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
// //           onClick={() => setShowModal(true)}
// //         >
// //           <FaPlus /> Crear hilo
// //         </button>
// //       </div>
// //       {/* Filtros y búsqueda */}
// //       <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
// //         {/* Dropdown de ordenamiento y filtro */}
// //         <div className="relative min-w-[220px]">
// //           <div
// //             className="border rounded p-2 font-semibold text-gray-700 flex items-center justify-between cursor-pointer select-none"
// //             onClick={() => setShowSortOptions((prev) => !prev)}
// //           >
// //             Ordenar y ver
// //             <span className="ml-2">
// //               {showSortOptions ? <FaChevronUp /> : <FaChevronDown />}
// //             </span>
// //           </div>
// //           {showSortOptions && (
// //             <div className="absolute z-10 w-full bg-white border rounded mt-1 shadow-lg">
// //               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
// //                 <input
// //                   type="radio"
// //                   name="dropdown-filter"
// //                   checked={dropdownFilter === "all"}
// //                   onChange={() => setDropdownFilter("all")}
// //                 />
// //                 <span className="text-sm">Ver todos los hilos</span>
// //               </label>
// //               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
// //                 <input
// //                   type="radio"
// //                   name="dropdown-filter"
// //                   checked={dropdownFilter === "user"}
// //                   onChange={() => setDropdownFilter("user")}
// //                 />
// //                 <span className="text-sm">Mis hilos</span>
// //               </label>
// //               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
// //                 <input
// //                   type="radio"
// //                   name="dropdown-filter"
// //                   checked={dropdownFilter === "group"}
// //                   onChange={() => setDropdownFilter("group")}
// //                 />
// //                 <span className="text-sm">Filtrar por grupo</span>
// //               </label>
// //               {dropdownFilter === "group" && (
// //                 <div className="p-2">
// //                   <select
// //                     className="w-full border rounded px-3 py-2"
// //                     value={selectedGroup}
// //                     onChange={(e) => setSelectedGroup(e.target.value)}
// //                   >
// //                     <option value="">Todos los grupos</option>
// //                     {groups.length === 0 ? (
// //                       <option value="">No hay grupos disponibles</option>
// //                     ) : (
// //                       groups.map((group) => (
// //                         <option key={group.group_id || group.id} value={group.group_id || group.id}>
// //                           {group.name}
// //                         </option>
// //                       ))
// //                     )}
// //                   </select>
// //                 </div>
// //               )}
// //               <div className="border-t my-1"></div>
// //               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
// //                 <input
// //                   type="radio"
// //                   name="sort"
// //                   checked={sortOption === "recent"}
// //                   onChange={() => setSortOption("recent")}
// //                 />
// //                 <span className="text-sm">Activo recientemente</span>
// //               </label>
// //               <label className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-100">
// //                 <input
// //                   type="radio"
// //                   name="sort"
// //                   checked={sortOption === "date"}
// //                   onChange={() => setSortOption("date")}
// //                 />
// //                 <span className="text-sm">Fecha de publicación</span>
// //               </label>
// //             </div>
// //           )}
// //         </div>
// //         {/* Buscar */}
// //         <div className="flex-grow flex items-center gap-2">
// //           <input
// //             type="text"
// //             className="border rounded-full px-4 py-2 w-full focus:outline-none"
// //             placeholder="Buscar"
// //             value={search}
// //             onChange={(e) => setSearch(e.target.value)}
// //           />
// //           <button className="text-gray-600" tabIndex={-1} type="button">
// //             <FaSearch />
// //           </button>
// //         </div>
// //       </div>
// //       {/* Lista de hilos */}
// //       <div>
// //         {filteredThreads.length === 0 ? (
// //           <div className="text-gray-400 text-center py-10">
// //             No hay hilos disponibles.
// //           </div>
// //         ) : (
// //           filteredThreads.map((thread) => (
// //             <div key={thread.thread_id || thread.id} className="mb-7">
// //               <div className="flex items-start gap-3">
// //                 <FaUserCircle className="text-3xl text-gray-400 mt-1" />
// //                 <div className="flex-1">
// //                   <div className="font-semibold">
// //                     {thread.authorName || thread.userName || "Usuario"}{" "}
// //                     <span className="text-xs font-normal text-gray-600">
// //                       —{" "}
// //                       {new Date(thread.creation_date || thread.creationDate).toLocaleDateString("es-ES", {
// //                         year: "numeric",
// //                         month: "numeric",
// //                         day: "numeric",
// //                       })}
// //                       ,{" "}
// //                       {new Date(thread.creation_date || thread.creationDate).toLocaleTimeString("es-ES", {
// //                         hour: "2-digit",
// //                         minute: "2-digit",
// //                       })}
// //                     </span>
// //                   </div>
// //                   <div className="font-bold text-lg">{thread.title}</div>
// //                   <div className="mt-1 text-gray-800">{thread.content}</div>
// //                 </div>
// //               </div>
// //               <div className="text-xs text-gray-400 mt-2 mb-2 flex items-center">
// //                 <div className="flex-grow border-t border-gray-200"></div>
// //                 <span className="mx-2">
// //                   {new Date(thread.creation_date || thread.creationDate).toLocaleDateString("es-ES", {
// //                     year: "numeric",
// //                     month: "long",
// //                     day: "numeric",
// //                   })}
// //                 </span>
// //                 <div className="flex-grow border-t border-gray-200"></div>
// //               </div>
// //             </div>
// //           ))
// //         )}
// //       </div>
// //       {showModal && (
// //         <ThreadFormModal
// //           onClose={() => setShowModal(false)}
// //           onThreadCreated={handleThreadCreated}
// //         />
// //       )}
// //     </div>
// //   );
// // };
