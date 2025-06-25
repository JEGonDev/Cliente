import React, { useEffect, useState, useContext, useCallback } from "react";
import { PostCard } from "../ui/PostCard";
import { SearchBar } from "../ui/SearchBar";
import { PostFormModal } from "../ui/PostFormModal";
import { communityService } from "../services/communityService";
import { AuthContext } from "../../authentication/context/AuthContext";
import { UserIcon, RefreshCw, Filter } from "lucide-react";
import { PlantGrow } from "../ui/PlantGrow";
import { motion, AnimatePresence } from "framer-motion";

export const PostListView = () => {
  const { user } = useContext(AuthContext);

  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showOnlyUserPosts, setShowOnlyUserPosts] = useState(false);

  const fetchAllPosts = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await communityService.getAllPosts();
      const postsArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      const sortedPosts = sortPostsByDateDesc(postsArray);

      setPosts(sortedPosts);
      applyFilters(sortedPosts);
      setShowOnlyUserPosts(false);
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      setLoadError(
        "En el momento no hay publicaciones para mostrar, ¡sé el primero en crear una!"
      );
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await communityService.getPostsByUser();
      const postsArray = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : [];
      const sortedPosts = sortPostsByDateDesc(postsArray);

      setPosts(sortedPosts);
      applyFilters(sortedPosts);
    } catch (error) {
      console.error("Error al obtener publicaciones del usuario:", error);
      setLoadError(
        "No se pudieron cargar tus publicaciones. Intente nuevamente."
      );
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sortPostsByDateDesc = (posts) => {
    return [...posts].sort((a, b) => {
      const dateA = new Date(a.postDate || a.creation_date || a.post_date || 0);
      const dateB = new Date(b.postDate || b.creation_date || b.post_date || 0);
      return dateB - dateA;
    });
  };

  const applyFilters = useCallback(
    (postsToFilter) => {
      if (!searchTerm.trim()) {
        setFilteredPosts(postsToFilter);
        return;
      }
      const term = searchTerm.toLowerCase();

      const filtered = postsToFilter.filter((post) => {
        const contentMatch =
          post.content && post.content.toLowerCase().includes(term);
        const userName = post.userName || post.user_name || post.author || "";
        const userMatch = userName.toLowerCase().includes(term);
        const userIdMatch =
          !isNaN(term) &&
          (post.userId?.toString() === term ||
            post.user_id?.toString() === term);
        const postType = post.postType || post.post_type || "";
        const typeMatch = postType.toLowerCase().includes(term);

        return contentMatch || userMatch || userIdMatch || typeMatch;
      });

      setFilteredPosts(filtered);
    },
    [searchTerm]
  );

  const handleSearch = (query) => {
    setSearchTerm(query);
    applyFilters(posts);
  };

  const toggleUserPostsFilter = () => {
    if (showOnlyUserPosts) {
      fetchAllPosts();
    } else {
      setShowOnlyUserPosts(true);
      fetchUserPosts();
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  useEffect(() => {
    applyFilters(posts);
  }, [searchTerm, applyFilters]);

  // --- Optimistic updates ---
  const handlePostCreated = (newPost) => {
    setIsModalOpen(false);
    const updatedPosts = [newPost, ...posts];
    const sortedPosts = sortPostsByDateDesc(updatedPosts);
    setPosts(sortedPosts);
    applyFilters(sortedPosts);
  };

  const handlePostUpdated = (updatedPost) => {
    const postId = updatedPost.id || updatedPost.post_id;
    const updatedPosts = posts.map((post) =>
      post.id === postId || post.post_id === postId ? updatedPost : post
    );
    setPosts(updatedPosts);
    applyFilters(updatedPosts);
  };

  const handlePostDeleted = (postId) => {
    const updatedPosts = posts.filter(
      (post) => post.id !== postId && post.post_id !== postId
    );
    setPosts(updatedPosts);
    applyFilters(updatedPosts);
  };

  // Si algún modal está abierto, desactiva animaciones de hover en todas las cards
  const anyModalOpen = isModalOpen;

  return (
    <div className="p-2 md:p-4 w-full max-w-full">
      {/* HEADER */}
      <div className="flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between mb-6 gap-2 lg:gap-0">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight font-poppins mb-2 lg:mb-0 text-center lg:text-left bg-gradient-to-r from-[#23582a] via-[#059669] to-[#10b981] bg-clip-text text-transparent">
          Publicaciones de la Comunidad
        </h1>
        <div className="flex justify-center gap-2 flex-wrap mt-2 lg:mt-0">
          <PlantGrow className="w-12 h-12 lg:w-16 lg:h-16" />
          <PlantGrow className="w-12 h-12 lg:w-16 lg:h-16" />
          <PlantGrow className="w-12 h-12 lg:w-16 lg:h-16" />
          <PlantGrow className="w-12 h-12 lg:w-16 lg:h-16" />
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
        <div className="flex-grow">
          <SearchBar
            onSearch={handleSearch}
            className="w-full"
            placeholder="Buscar por contenido, autor o tipo..."
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={toggleUserPostsFilter}
            className={`flex items-center px-2 py-2 md:px-3 rounded-md border text-sm md:text-base
              ${
                showOnlyUserPosts
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            title={
              showOnlyUserPosts
                ? "Mostrar todas las publicaciones"
                : "Mostrar solo mis publicaciones"
            }
          >
            <UserIcon className="h-5 w-5 mr-1" />
            <span className="hidden xxs:inline md:inline">
              {showOnlyUserPosts
                ? "Mis publicaciones"
                : "Filtrar por mis publicaciones"}
            </span>
          </button>
          <button
            onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
            className="flex items-center px-2 py-2 md:px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
            title="Refrescar publicaciones"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Botón para crear nueva publicación */}
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
          <span className="hidden xs:inline">Crear Publicación</span>
          <span className="xs:hidden">Nuevo</span>
        </button>
      </div>

      {/* Mensaje sobre el modo de filtrado activo */}
      {showOnlyUserPosts && (
        <div className="bg-blue-50 text-blue-700 p-2 md:p-3 rounded mb-3 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            <span>Mostrando solo tus publicaciones</span>
          </div>
          <button
            onClick={fetchAllPosts}
            className="text-sm underline hover:text-blue-900"
          >
            Ver todas
          </button>
        </div>
      )}

      {/* Mensaje de carga */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {loadError && !isLoading && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{loadError}</p>
          <button
            onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
            className="mt-2 text-sm underline hover:text-red-800"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {/* Lista de publicaciones - en vertical, animadas */}
      {!isLoading && !loadError && (
        <div className="flex flex-col gap-4 w-full max-w-full">
          <AnimatePresence>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id || post.post_id}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -32 }}
                  transition={{
                    duration: 0.35,
                    delay: idx * 0.06,
                    ease: "easeInOut",
                  }}
                  whileHover={
                    !anyModalOpen
                      ? {
                          scale: 1.015,
                          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                        }
                      : {}
                  }
                  className="w-full"
                >
                  <PostCard
                    post={post}
                    onRefresh={
                      showOnlyUserPosts ? fetchUserPosts : fetchAllPosts
                    }
                    onUpdate={handlePostUpdated}
                    onDelete={handlePostDeleted}
                  />
                </motion.div>
              ))
            ) : (
              <div className="bg-gray-50 text-center py-8 px-2 rounded-lg w-full">
                <p className="text-gray-500">
                  {searchTerm
                    ? `No se encontraron publicaciones para "${searchTerm}"`
                    : showOnlyUserPosts
                    ? "Aún no has creado publicaciones."
                    : "No hay publicaciones disponibles."}
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 text-primary hover:underline"
                >
                  ¡Crea la primera publicación!
                </button>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {isModalOpen && (
        <PostFormModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

// import React, { useEffect, useState, useContext, useCallback } from "react";
// import { PostCard } from "../ui/PostCard";
// import { SearchBar } from "../ui/SearchBar";
// import { PostFormModal } from "../ui/PostFormModal";
// import { communityService } from "../services/communityService";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { UserIcon, RefreshCw, Filter } from "lucide-react";
// import { PlantGrow } from "../ui/PlantGrow";
// import { motion, AnimatePresence } from "framer-motion";

// export const PostListView = () => {
//   const { user } = useContext(AuthContext);

//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showOnlyUserPosts, setShowOnlyUserPosts] = useState(false);

//   const fetchAllPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getAllPosts();
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       applyFilters(sortedPosts);
//       setShowOnlyUserPosts(false);
//     } catch (error) {
//       console.error("Error al obtener publicaciones:", error);
//       setLoadError(
//         "En el momento no hay publicaciones para mostrar, ¡sé el primero en crear una!"
//       );
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchUserPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getPostsByUser();
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       applyFilters(sortedPosts);
//     } catch (error) {
//       console.error("Error al obtener publicaciones del usuario:", error);
//       setLoadError("No se pudieron cargar tus publicaciones. Intente nuevamente.");
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sortPostsByDateDesc = (posts) => {
//     return [...posts].sort((a, b) => {
//       const dateA = new Date(a.postDate || a.creation_date || a.post_date || 0);
//       const dateB = new Date(b.postDate || b.creation_date || b.post_date || 0);
//       return dateB - dateA;
//     });
//   };

//   const applyFilters = useCallback(
//     (postsToFilter) => {
//       if (!searchTerm.trim()) {
//         setFilteredPosts(postsToFilter);
//         return;
//       }
//       const term = searchTerm.toLowerCase();

//       const filtered = postsToFilter.filter((post) => {
//         const contentMatch =
//           post.content && post.content.toLowerCase().includes(term);
//         const userName = post.userName || post.user_name || post.author || "";
//         const userMatch = userName.toLowerCase().includes(term);
//         const userIdMatch =
//           !isNaN(term) &&
//           (post.userId?.toString() === term ||
//             post.user_id?.toString() === term);
//         const postType = post.postType || post.post_type || "";
//         const typeMatch = postType.toLowerCase().includes(term);

//         return contentMatch || userMatch || userIdMatch || typeMatch;
//       });

//       setFilteredPosts(filtered);
//     },
//     [searchTerm]
//   );

//   const handleSearch = (query) => {
//     setSearchTerm(query);
//     applyFilters(posts);
//   };

//   const toggleUserPostsFilter = () => {
//     if (showOnlyUserPosts) {
//       fetchAllPosts();
//     } else {
//       setShowOnlyUserPosts(true);
//       fetchUserPosts();
//     }
//   };

//   useEffect(() => {
//     fetchAllPosts();
//   }, []);

//   useEffect(() => {
//     applyFilters(posts);
//   }, [searchTerm, applyFilters]);

//   // --- Optimistic updates ---
//   const handlePostCreated = (newPost) => {
//     setIsModalOpen(false);
//     const updatedPosts = [newPost, ...posts];
//     const sortedPosts = sortPostsByDateDesc(updatedPosts);
//     setPosts(sortedPosts);
//     applyFilters(sortedPosts);
//   };

//   const handlePostUpdated = (updatedPost) => {
//     const postId = updatedPost.id || updatedPost.post_id;
//     const updatedPosts = posts.map((post) =>
//       post.id === postId || post.post_id === postId ? updatedPost : post
//     );
//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   const handlePostDeleted = (postId) => {
//     const updatedPosts = posts.filter(
//       (post) => post.id !== postId && post.post_id !== postId
//     );
//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   return (
//     <div className="p-2 md:p-4 w-full max-w-full">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
//         <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-6">
//           Publicaciones de la comunidad
//         </h1>
//         <div className="flex justify-center gap-2 flex-wrap">
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//         </div>
//       </div>

//       {/* Barra de búsqueda y filtros */}
//       <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
//         <div className="flex-grow">
//           <SearchBar
//             onSearch={handleSearch}
//             className="w-full"
//             placeholder="Buscar por contenido, autor o tipo..."
//           />
//         </div>
//         <div className="flex gap-2 justify-end">
//           <button
//             onClick={toggleUserPostsFilter}
//             className={`flex items-center px-2 py-2 md:px-3 rounded-md border text-sm md:text-base
//               ${
//                 showOnlyUserPosts
//                   ? "bg-primary text-white border-primary"
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//               }`}
//             title={
//               showOnlyUserPosts
//                 ? "Mostrar todas las publicaciones"
//                 : "Mostrar solo mis publicaciones"
//             }
//           >
//             <UserIcon className="h-5 w-5 mr-1" />
//             <span className="hidden xxs:inline md:inline">
//               {showOnlyUserPosts
//                 ? "Mis publicaciones"
//                 : "Filtrar por mis publicaciones"}
//             </span>
//           </button>
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="flex items-center px-2 py-2 md:px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//             title="Refrescar publicaciones"
//           >
//             <RefreshCw className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Botón para crear nueva publicación */}
//       <div className="flex justify-end mb-3">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-primary text-white px-2 py-2 md:px-4 rounded-md hover:bg-green-600 flex items-center text-sm md:text-base"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//           <span className="hidden xs:inline">Crear Publicación</span>
//           <span className="xs:hidden">Nuevo</span>
//         </button>
//       </div>

//       {/* Mensaje sobre el modo de filtrado activo */}
//       {showOnlyUserPosts && (
//         <div className="bg-blue-50 text-blue-700 p-2 md:p-3 rounded mb-3 flex flex-col md:flex-row items-center justify-between gap-2">
//           <div className="flex items-center">
//             <Filter className="w-5 h-5 mr-2" />
//             <span>Mostrando solo tus publicaciones</span>
//           </div>
//           <button
//             onClick={fetchAllPosts}
//             className="text-sm underline hover:text-blue-900"
//           >
//             Ver todas
//           </button>
//         </div>
//       )}

//       {/* Mensaje de carga */}
//       {isLoading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//           <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
//         </div>
//       )}

//       {/* Mensaje de error */}
//       {loadError && !isLoading && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//           <p>{loadError}</p>
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="mt-2 text-sm underline hover:text-red-800"
//           >
//             Intentar nuevamente
//           </button>
//         </div>
//       )}

//       {/* Lista de publicaciones - en vertical, animadas */}
//       {!isLoading && !loadError && (
//         <div className="flex flex-col gap-4 w-full max-w-full">
//           <AnimatePresence>
//             {filteredPosts.length > 0 ? (
//               filteredPosts.map((post, idx) => (
//                 <motion.div
//                   key={post.id || post.post_id}
//                   initial={{ opacity: 0, y: 32 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -32 }}
//                   transition={{
//                     duration: 0.35,
//                     delay: idx * 0.06,
//                     ease: "easeInOut",
//                   }}
//                   whileHover={{
//                     scale: 1.015,
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                   }}
//                   className="w-full"
//                 >
//                   <PostCard
//                     post={post}
//                     onRefresh={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//                     onUpdate={handlePostUpdated}
//                     onDelete={handlePostDeleted}
//                   />
//                 </motion.div>
//               ))
//             ) : (
//               <div className="bg-gray-50 text-center py-8 px-2 rounded-lg w-full">
//                 <p className="text-gray-500">
//                   {searchTerm
//                     ? `No se encontraron publicaciones para "${searchTerm}"`
//                     : showOnlyUserPosts
//                     ? "Aún no has creado publicaciones."
//                     : "No hay publicaciones disponibles."}
//                 </p>
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="mt-4 text-primary hover:underline"
//                 >
//                   ¡Crea la primera publicación!
//                 </button>
//               </div>
//             )}
//           </AnimatePresence>
//         </div>
//       )}

//       {isModalOpen && (
//         <PostFormModal
//           onClose={() => setIsModalOpen(false)}
//           onPostCreated={handlePostCreated}
//         />
//       )}
//     </div>
//   );
// };

// import React, { useEffect, useState, useContext, useCallback } from "react";
// import { PostCard } from "../ui/PostCard";
// import { SearchBar } from "../ui/SearchBar";
// import { PostFormModal } from "../ui/PostFormModal";
// import { communityService } from "../services/communityService";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { UserIcon, RefreshCw, Filter } from "lucide-react";
// import { PlantGrow } from "../ui/PlantGrow";
// import { motion, AnimatePresence } from "framer-motion";

// export const PostListView = () => {
//   const { user } = useContext(AuthContext);

//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showOnlyUserPosts, setShowOnlyUserPosts] = useState(false);

//   const fetchAllPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getAllPosts();
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       applyFilters(sortedPosts);
//       setShowOnlyUserPosts(false);
//     } catch (error) {
//       console.error("Error al obtener publicaciones:", error);
//       setLoadError(
//         "En el momento no hay publicaciones para mostrar, ¡sé el primero en crear una!"
//       );
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchUserPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getPostsByUser();
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       applyFilters(sortedPosts);
//     } catch (error) {
//       console.error("Error al obtener publicaciones del usuario:", error);
//       setLoadError("No se pudieron cargar tus publicaciones. Intente nuevamente.");
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const sortPostsByDateDesc = (posts) => {
//     return [...posts].sort((a, b) => {
//       const dateA = new Date(a.postDate || a.creation_date || a.post_date || 0);
//       const dateB = new Date(b.postDate || b.creation_date || b.post_date || 0);
//       return dateB - dateA;
//     });
//   };

//   const applyFilters = useCallback(
//     (postsToFilter) => {
//       if (!searchTerm.trim()) {
//         setFilteredPosts(postsToFilter);
//         return;
//       }
//       const term = searchTerm.toLowerCase();

//       const filtered = postsToFilter.filter((post) => {
//         const contentMatch =
//           post.content && post.content.toLowerCase().includes(term);
//         const userName = post.userName || post.user_name || post.author || "";
//         const userMatch = userName.toLowerCase().includes(term);
//         const userIdMatch =
//           !isNaN(term) &&
//           (post.userId?.toString() === term ||
//             post.user_id?.toString() === term);
//         const postType = post.postType || post.post_type || "";
//         const typeMatch = postType.toLowerCase().includes(term);

//         return contentMatch || userMatch || userIdMatch || typeMatch;
//       });

//       setFilteredPosts(filtered);
//     },
//     [searchTerm]
//   );

//   const handleSearch = (query) => {
//     setSearchTerm(query);
//     applyFilters(posts);
//   };

//   const toggleUserPostsFilter = () => {
//     if (showOnlyUserPosts) {
//       fetchAllPosts();
//     } else {
//       setShowOnlyUserPosts(true);
//       fetchUserPosts();
//     }
//   };

//   useEffect(() => {
//     fetchAllPosts();
//   }, []);

//   useEffect(() => {
//     applyFilters(posts);
//   }, [searchTerm, applyFilters]);

//   // --- Optimistic updates ---
//   const handlePostCreated = (newPost) => {
//     setIsModalOpen(false);
//     const updatedPosts = [newPost, ...posts];
//     const sortedPosts = sortPostsByDateDesc(updatedPosts);
//     setPosts(sortedPosts);
//     applyFilters(sortedPosts);
//   };

//   const handlePostUpdated = (updatedPost) => {
//     const postId = updatedPost.id || updatedPost.post_id;
//     const updatedPosts = posts.map((post) =>
//       post.id === postId || post.post_id === postId ? updatedPost : post
//     );
//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   const handlePostDeleted = (postId) => {
//     const updatedPosts = posts.filter(
//       (post) => post.id !== postId && post.post_id !== postId
//     );
//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   return (
//     <div className="p-2 md:p-4">
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
//         <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-6">
//           Publicaciones de la comunidad
//         </h1>
//         <div className="flex justify-center gap-2 flex-wrap">
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//         </div>
//       </div>

//       {/* Barra de búsqueda y filtros */}
//       <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
//         <div className="flex-grow">
//           <SearchBar
//             onSearch={handleSearch}
//             className="w-full"
//             placeholder="Buscar por contenido, autor o tipo..."
//           />
//         </div>
//         <div className="flex gap-2 justify-end">
//           <button
//             onClick={toggleUserPostsFilter}
//             className={`flex items-center px-2 py-2 md:px-3 rounded-md border text-sm md:text-base
//               ${
//                 showOnlyUserPosts
//                   ? "bg-primary text-white border-primary"
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//               }`}
//             title={
//               showOnlyUserPosts
//                 ? "Mostrar todas las publicaciones"
//                 : "Mostrar solo mis publicaciones"
//             }
//           >
//             <UserIcon className="h-5 w-5 mr-1" />
//             <span className="hidden xxs:inline md:inline">
//               {showOnlyUserPosts
//                 ? "Mis publicaciones"
//                 : "Filtrar por mis publicaciones"}
//             </span>
//           </button>
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="flex items-center px-2 py-2 md:px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//             title="Refrescar publicaciones"
//           >
//             <RefreshCw className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Botón para crear nueva publicación */}
//       <div className="flex justify-end mb-3">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-primary text-white px-2 py-2 md:px-4 rounded-md hover:bg-green-600 flex items-center text-sm md:text-base"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//           <span className="hidden xs:inline">Crear Publicación</span>
//           <span className="xs:hidden">Nuevo</span>
//         </button>
//       </div>

//       {/* Mensaje sobre el modo de filtrado activo */}
//       {showOnlyUserPosts && (
//         <div className="bg-blue-50 text-blue-700 p-2 md:p-3 rounded mb-3 flex flex-col md:flex-row items-center justify-between gap-2">
//           <div className="flex items-center">
//             <Filter className="w-5 h-5 mr-2" />
//             <span>Mostrando solo tus publicaciones</span>
//           </div>
//           <button
//             onClick={fetchAllPosts}
//             className="text-sm underline hover:text-blue-900"
//           >
//             Ver todas
//           </button>
//         </div>
//       )}

//       {/* Mensaje de carga */}
//       {isLoading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//           <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
//         </div>
//       )}

//       {/* Mensaje de error */}
//       {loadError && !isLoading && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//           <p>{loadError}</p>
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="mt-2 text-sm underline hover:text-red-800"
//           >
//             Intentar nuevamente
//           </button>
//         </div>
//       )}

//       {/* Lista de publicaciones - en vertical, animadas */}
//       {!isLoading && !loadError && (
//         <div className="flex flex-col gap-4 max-w-2xl mx-auto">
//           <AnimatePresence>
//             {filteredPosts.length > 0 ? (
//               filteredPosts.map((post, idx) => (
//                 <motion.div
//                   key={post.id || post.post_id}
//                   initial={{ opacity: 0, y: 32 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: -32 }}
//                   transition={{
//                     duration: 0.35,
//                     delay: idx * 0.06,
//                     ease: "easeInOut",
//                   }}
//                   whileHover={{
//                     scale: 1.015,
//                     boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//                   }}
//                 >
//                   <PostCard
//                     post={post}
//                     onRefresh={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//                     onUpdate={handlePostUpdated}
//                     onDelete={handlePostDeleted}
//                   />
//                 </motion.div>
//               ))
//             ) : (
//               <div className="bg-gray-50 text-center py-8 px-2 rounded-lg">
//                 <p className="text-gray-500">
//                   {searchTerm
//                     ? `No se encontraron publicaciones para "${searchTerm}"`
//                     : showOnlyUserPosts
//                     ? "Aún no has creado publicaciones."
//                     : "No hay publicaciones disponibles."}
//                 </p>
//                 <button
//                   onClick={() => setIsModalOpen(true)}
//                   className="mt-4 text-primary hover:underline"
//                 >
//                   ¡Crea la primera publicación!
//                 </button>
//               </div>
//             )}
//           </AnimatePresence>
//         </div>
//       )}

//       {isModalOpen && (
//         <PostFormModal
//           onClose={() => setIsModalOpen(false)}
//           onPostCreated={handlePostCreated}
//         />
//       )}
//     </div>
//   );
// };

// import React, { useEffect, useState, useContext, useCallback } from "react";
// import { PostCard } from "../ui/PostCard";
// import { SearchBar } from "../ui/SearchBar";
// import { PostFormModal } from "../ui/PostFormModal";
// import { communityService } from "../services/communityService";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { UserIcon, RefreshCw, Filter } from "lucide-react";
// import { PlantGrow } from "../ui/PlantGrow";

// export const PostListView = () => {
//   // Contexto de autenticación para obtener datos del usuario
//   const { user } = useContext(AuthContext);

//   // Estados para manejar las publicaciones
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Filtrado por usuario
//   const [showOnlyUserPosts, setShowOnlyUserPosts] = useState(false);

//   // Función para cargar todas las publicaciones
//   const fetchAllPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getAllPosts();

//       // Verificamos que la respuesta sea un array
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];

//       // Ordenamos posts del más reciente al más antiguo
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       // Aplicamos cualquier filtro de búsqueda existente
//       applyFilters(sortedPosts);

//       // Desactivamos filtro de usuario si estábamos en ese modo
//       setShowOnlyUserPosts(false);
//     } catch (error) {
//       console.error("Error al obtener publicaciones:", error);
//       setLoadError(
//         "En el momento no hay publicaciones para mostrar, ¡sé el primero en crear una!"
//       );
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Función para cargar solo las publicaciones del usuario autenticado
//   const fetchUserPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getPostsByUser();

//       // Verificamos que la respuesta sea un array
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];

//       // Ordenamos posts del más reciente al más antiguo
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       // Aplicamos cualquier filtro de búsqueda existente
//       applyFilters(sortedPosts);
//     } catch (error) {
//       console.error("Error al obtener publicaciones del usuario:", error);
//       setLoadError(
//         "No se pudieron cargar tus publicaciones. Intente nuevamente."
//       );
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Ordenar por fecha (más reciente primero)
//   const sortPostsByDateDesc = (posts) => {
//     return [...posts].sort((a, b) => {
//       const dateA = new Date(a.postDate || a.creation_date || a.post_date || 0);
//       const dateB = new Date(b.postDate || b.creation_date || b.post_date || 0);
//       return dateB - dateA;
//     });
//   };

//   // Aplicar filtros de búsqueda
//   const applyFilters = useCallback(
//     (postsToFilter) => {
//       if (!searchTerm.trim()) {
//         setFilteredPosts(postsToFilter);
//         return;
//       }

//       const term = searchTerm.toLowerCase();

//       const filtered = postsToFilter.filter((post) => {
//         // 1. Filtrar por contenido
//         const contentMatch =
//           post.content && post.content.toLowerCase().includes(term);

//         // 2. Filtrar por autor
//         // Nota: Esto funciona si ya hemos cargado los nombres de usuario en las cards
//         const userName = post.userName || post.user_name || post.author || "";
//         const userMatch = userName.toLowerCase().includes(term);

//         // También busca por userId si el término parece ser un número
//         const userIdMatch =
//           !isNaN(term) &&
//           (post.userId?.toString() === term ||
//             post.user_id?.toString() === term);

//         // 3. Filtrar por tipo de publicación
//         const postType = post.postType || post.post_type || "";
//         const typeMatch = postType.toLowerCase().includes(term);

//         return contentMatch || userMatch || userIdMatch || typeMatch;
//       });

//       setFilteredPosts(filtered);
//     },
//     [searchTerm]
//   );

//   // Manejar cambios en la búsqueda
//   const handleSearch = (query) => {
//     setSearchTerm(query);
//     applyFilters(posts);
//   };

//   // Alternar entre todas las publicaciones y solo las del usuario
//   const toggleUserPostsFilter = () => {
//     if (showOnlyUserPosts) {
//       // Si ya estamos mostrando solo las del usuario, volvemos a mostrar todas
//       fetchAllPosts();
//     } else {
//       // Si estamos mostrando todas, cambiamos a mostrar solo las del usuario
//       setShowOnlyUserPosts(true);
//       fetchUserPosts();
//     }
//   };

//   // Cargamos las publicaciones al montar el componente
//   useEffect(() => {
//     fetchAllPosts();
//   }, []);

//   // Actualizamos los filtros cuando cambia el término de búsqueda
//   useEffect(() => {
//     applyFilters(posts);
//   }, [searchTerm, applyFilters]);

//   // Funciones para manejar actualizaciones optimistas

//   // Función para manejar la creación de una nueva publicación
//   const handlePostCreated = (newPost) => {
//     // Cerramos el modal
//     setIsModalOpen(false);

//     // Optimistic update: Actualizamos el estado local sin hacer refetch
//     const updatedPosts = [newPost, ...posts];
//     const sortedPosts = sortPostsByDateDesc(updatedPosts);
//     setPosts(sortedPosts);
//     applyFilters(sortedPosts);
//   };

//   // Función para manejar la actualización de una publicación
//   const handlePostUpdated = (updatedPost) => {
//     // Actualizamos localmente el post sin hacer refetch
//     const postId = updatedPost.id || updatedPost.post_id;
//     const updatedPosts = posts.map((post) =>
//       post.id === postId || post.post_id === postId ? updatedPost : post
//     );

//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   // Función para manejar la eliminación de una publicación
//   const handlePostDeleted = (postId) => {
//     // Eliminamos localmente el post sin hacer refetch
//     const updatedPosts = posts.filter(
//       (post) => post.id !== postId && post.post_id !== postId
//     );

//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   return (
//     <div className="p-2 md:p-4">
//       {/* HEADER: stackea en móvil */}
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-2 md:gap-0">
//         <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-6">
//           Publicaciones de la comunidad
//         </h1>
//         <div className="flex justify-center gap-2 flex-wrap">
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//           <PlantGrow className="w-12 h-12 md:w-16 md:h-16 mb-2 md:mb-4" />
//         </div>
//       </div>

//       {/* Barra de búsqueda y filtros */}
//       <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
//         <div className="flex-grow">
//           <SearchBar
//             onSearch={handleSearch}
//             className="w-full"
//             placeholder="Buscar por contenido, autor o tipo..."
//           />
//         </div>
//         <div className="flex gap-2 justify-end">
//           <button
//             onClick={toggleUserPostsFilter}
//             className={`flex items-center px-2 py-2 md:px-3 rounded-md border text-sm md:text-base
//               ${
//                 showOnlyUserPosts
//                   ? "bg-primary text-white border-primary"
//                   : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//               }`}
//             title={
//               showOnlyUserPosts
//                 ? "Mostrar todas las publicaciones"
//                 : "Mostrar solo mis publicaciones"
//             }
//           >
//             <UserIcon className="h-5 w-5 mr-1" />
//             <span className="hidden xxs:inline md:inline">
//               {showOnlyUserPosts
//                 ? "Mis publicaciones"
//                 : "Filtrar por mis publicaciones"}
//             </span>
//           </button>
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="flex items-center px-2 py-2 md:px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//             title="Refrescar publicaciones"
//           >
//             <RefreshCw className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Botón para crear nueva publicación */}
//       <div className="flex justify-end mb-3">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-primary text-white px-2 py-2 md:px-4 rounded-md hover:bg-green-600 flex items-center text-sm md:text-base"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//           <span className="hidden xs:inline">Crear Publicación</span>
//           <span className="xs:hidden">Nuevo</span>
//         </button>
//       </div>

//       {/* Mensaje sobre el modo de filtrado activo */}
//       {showOnlyUserPosts && (
//         <div className="bg-blue-50 text-blue-700 p-2 md:p-3 rounded mb-3 flex flex-col md:flex-row items-center justify-between gap-2">
//           <div className="flex items-center">
//             <Filter className="w-5 h-5 mr-2" />
//             <span>Mostrando solo tus publicaciones</span>
//           </div>
//           <button
//             onClick={fetchAllPosts}
//             className="text-sm underline hover:text-blue-900"
//           >
//             Ver todas
//           </button>
//         </div>
//       )}

//       {/* Mensaje de carga */}
//       {isLoading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//           <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
//         </div>
//       )}

//       {/* Mensaje de error */}
//       {loadError && !isLoading && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//           <p>{loadError}</p>
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="mt-2 text-sm underline hover:text-red-800"
//           >
//             Intentar nuevamente
//           </button>
//         </div>
//       )}

//       {/* Lista de publicaciones */}
//       {!isLoading && !loadError && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredPosts.length > 0 ? (
//             filteredPosts.map((post) => (
//               <PostCard
//                 key={post.id || post.post_id}
//                 post={post}
//                 onRefresh={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//                 onUpdate={handlePostUpdated}
//                 onDelete={handlePostDeleted}
//               />
//             ))
//           ) : (
//             <div className="bg-gray-50 text-center py-8 px-2 rounded-lg col-span-full">
//               <p className="text-gray-500">
//                 {searchTerm
//                   ? `No se encontraron publicaciones para "${searchTerm}"`
//                   : showOnlyUserPosts
//                   ? "Aún no has creado publicaciones."
//                   : "No hay publicaciones disponibles."}
//               </p>
//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="mt-4 text-primary hover:underline"
//               >
//                 ¡Crea la primera publicación!
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {isModalOpen && (
//         <PostFormModal
//           onClose={() => setIsModalOpen(false)}
//           onPostCreated={handlePostCreated}
//         />
//       )}
//     </div>
//   );
// };

// import React, { useEffect, useState, useContext, useCallback } from "react";
// import { PostCard } from "../ui/PostCard";
// import { SearchBar } from "../ui/SearchBar";
// import { PostFormModal } from "../ui/PostFormModal";
// import { communityService } from "../services/communityService";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { UserIcon, RefreshCw, Filter } from "lucide-react";
// import { PlantGrow } from "../ui/PlantGrow";

// export const PostListView = () => {
//   // Contexto de autenticación para obtener datos del usuario
//   const { user } = useContext(AuthContext);

//   // Estados para manejar las publicaciones
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [loadError, setLoadError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   // Filtrado por usuario
//   const [showOnlyUserPosts, setShowOnlyUserPosts] = useState(false);

//   // Función para cargar todas las publicaciones
//   const fetchAllPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getAllPosts();

//       // Verificamos que la respuesta sea un array
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];

//       // Ordenamos posts del más reciente al más antiguo
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       // Aplicamos cualquier filtro de búsqueda existente
//       applyFilters(sortedPosts);

//       // Desactivamos filtro de usuario si estábamos en ese modo
//       setShowOnlyUserPosts(false);
//     } catch (error) {
//       console.error("Error al obtener publicaciones:", error);
//       setLoadError(
//         "En el momento no hay publicaciones para mostrar, ¡sé el primero en crear una!"
//       );
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Función para cargar solo las publicaciones del usuario autenticado
//   const fetchUserPosts = async () => {
//     setIsLoading(true);
//     setLoadError(null);

//     try {
//       const response = await communityService.getPostsByUser();

//       // Verificamos que la respuesta sea un array
//       const postsArray = Array.isArray(response)
//         ? response
//         : Array.isArray(response?.data)
//         ? response.data
//         : [];

//       // Ordenamos posts del más reciente al más antiguo
//       const sortedPosts = sortPostsByDateDesc(postsArray);

//       setPosts(sortedPosts);
//       // Aplicamos cualquier filtro de búsqueda existente
//       applyFilters(sortedPosts);
//     } catch (error) {
//       console.error("Error al obtener publicaciones del usuario:", error);
//       setLoadError(
//         "No se pudieron cargar tus publicaciones. Intente nuevamente."
//       );
//       setPosts([]);
//       setFilteredPosts([]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Ordenar por fecha (más reciente primero)
//   const sortPostsByDateDesc = (posts) => {
//     return [...posts].sort((a, b) => {
//       const dateA = new Date(a.postDate || a.creation_date || a.post_date || 0);
//       const dateB = new Date(b.postDate || b.creation_date || b.post_date || 0);
//       return dateB - dateA;
//     });
//   };

//   // Aplicar filtros de búsqueda
//   const applyFilters = useCallback(
//     (postsToFilter) => {
//       if (!searchTerm.trim()) {
//         setFilteredPosts(postsToFilter);
//         return;
//       }

//       const term = searchTerm.toLowerCase();

//       const filtered = postsToFilter.filter((post) => {
//         // 1. Filtrar por contenido
//         const contentMatch =
//           post.content && post.content.toLowerCase().includes(term);

//         // 2. Filtrar por autor
//         // Nota: Esto funciona si ya hemos cargado los nombres de usuario en las cards
//         const userName = post.userName || post.user_name || post.author || "";
//         const userMatch = userName.toLowerCase().includes(term);

//         // También busca por userId si el término parece ser un número
//         const userIdMatch =
//           !isNaN(term) &&
//           (post.userId?.toString() === term ||
//             post.user_id?.toString() === term);

//         // 3. Filtrar por tipo de publicación
//         const postType = post.postType || post.post_type || "";
//         const typeMatch = postType.toLowerCase().includes(term);

//         return contentMatch || userMatch || userIdMatch || typeMatch;
//       });

//       setFilteredPosts(filtered);
//     },
//     [searchTerm]
//   );

//   // Manejar cambios en la búsqueda
//   const handleSearch = (query) => {
//     setSearchTerm(query);
//     applyFilters(posts);
//   };

//   // Alternar entre todas las publicaciones y solo las del usuario
//   const toggleUserPostsFilter = () => {
//     if (showOnlyUserPosts) {
//       // Si ya estamos mostrando solo las del usuario, volvemos a mostrar todas
//       fetchAllPosts();
//     } else {
//       // Si estamos mostrando todas, cambiamos a mostrar solo las del usuario
//       setShowOnlyUserPosts(true);
//       fetchUserPosts();
//     }
//   };

//   // Cargamos las publicaciones al montar el componente
//   useEffect(() => {
//     fetchAllPosts();
//   }, []);

//   // Actualizamos los filtros cuando cambia el término de búsqueda
//   useEffect(() => {
//     applyFilters(posts);
//   }, [searchTerm, applyFilters]);

//   // Funciones para manejar actualizaciones optimistas

//   // Función para manejar la creación de una nueva publicación
//   const handlePostCreated = (newPost) => {
//     // Cerramos el modal
//     setIsModalOpen(false);

//     // Optimistic update: Actualizamos el estado local sin hacer refetch
//     const updatedPosts = [newPost, ...posts];
//     const sortedPosts = sortPostsByDateDesc(updatedPosts);
//     setPosts(sortedPosts);
//     applyFilters(sortedPosts);
//   };

//   // Función para manejar la actualización de una publicación
//   const handlePostUpdated = (updatedPost) => {
//     // Actualizamos localmente el post sin hacer refetch
//     const postId = updatedPost.id || updatedPost.post_id;
//     const updatedPosts = posts.map((post) =>
//       post.id === postId || post.post_id === postId ? updatedPost : post
//     );

//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   // Función para manejar la eliminación de una publicación
//   const handlePostDeleted = (postId) => {
//     // Eliminamos localmente el post sin hacer refetch
//     const updatedPosts = posts.filter(
//       (post) => post.id !== postId && post.post_id !== postId
//     );

//     setPosts(updatedPosts);
//     applyFilters(updatedPosts);
//   };

//   return (
//     <div className="p-4 ">
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="text-2xl font-bold mb-6">
//           Publicaciones de la comunidad
//         </h1>
//         <div className="flex">
//           <PlantGrow className="w-16 h-16 mb-4 mx-auto" />
//           <PlantGrow className="w-16 h-16 mb-4 mx-auto" />
//           <PlantGrow className="w-16 h-16 mb-4 mx-auto" />
//           <PlantGrow className="w-16 h-16 mb-4 mx-auto" />
//         </div>
//       </div>

//       {/* Barra de búsqueda y filtros */}
//       <div className="flex flex-col md:flex-row gap-4 mb-6">
//         <div className="flex-grow">
//           <SearchBar
//             onSearch={handleSearch}
//             className="w-full"
//             placeholder="Buscar por contenido, autor o tipo..."
//           />
//         </div>

//         <div className="flex gap-2">
//           {/* Botón para alternar entre todas/mis publicaciones */}
//           <button
//             onClick={toggleUserPostsFilter}
//             className={`flex items-center px-3 py-2 rounded-md border
//                       ${
//                         showOnlyUserPosts
//                           ? "bg-primary text-white border-primary"
//                           : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
//                       }`}
//             title={
//               showOnlyUserPosts
//                 ? "Mostrar todas las publicaciones"
//                 : "Mostrar solo mis publicaciones"
//             }
//           >
//             <UserIcon className="h-5 w-5 mr-1" />
//             <span className="hidden sm:inline">
//               {showOnlyUserPosts
//                 ? "Mis publicaciones"
//                 : "Filtrar por mis publicaciones"}
//             </span>
//           </button>

//           {/* Botón para refrescar */}
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="flex items-center px-3 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
//             title="Refrescar publicaciones"
//           >
//             <RefreshCw className="h-5 w-5" />
//           </button>
//         </div>
//       </div>

//       {/* Botón para crear nueva publicación */}
//       <div className="flex justify-end mb-4">
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-5 w-5 mr-2"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 4v16m8-8H4"
//             />
//           </svg>
//           Crear Publicación
//         </button>
//       </div>

//       {/* Mensaje sobre el modo de filtrado activo */}
//       {showOnlyUserPosts && (
//         <div className="bg-blue-50 text-blue-700 p-3 rounded mb-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <Filter className="w-5 h-5 mr-2" />
//             <span>Mostrando solo tus publicaciones</span>
//           </div>
//           <button
//             onClick={fetchAllPosts}
//             className="text-sm underline hover:text-blue-900"
//           >
//             Ver todas
//           </button>
//         </div>
//       )}

//       {/* Mensaje de carga */}
//       {isLoading && (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
//           <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
//         </div>
//       )}

//       {/* Mensaje de error */}
//       {loadError && !isLoading && (
//         <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
//           <p>{loadError}</p>
//           <button
//             onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//             className="mt-2 text-sm underline hover:text-red-800"
//           >
//             Intentar nuevamente
//           </button>
//         </div>
//       )}

//       {/* Lista de publicaciones */}
//       {!isLoading && !loadError && (
//         <div className="grid grid-cols-1 gap-6">
//           {filteredPosts.length > 0 ? (
//             filteredPosts.map((post) => (
//               <PostCard
//                 key={post.id || post.post_id}
//                 post={post}
//                 onRefresh={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
//                 onUpdate={handlePostUpdated}
//                 onDelete={handlePostDeleted}
//               />
//             ))
//           ) : (
//             <div className="bg-gray-50 text-center py-8 rounded-lg">
//               <p className="text-gray-500">
//                 {searchTerm
//                   ? `No se encontraron publicaciones para "${searchTerm}"`
//                   : showOnlyUserPosts
//                   ? "Aún no has creado publicaciones."
//                   : "No hay publicaciones disponibles."}
//               </p>
//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="mt-4 text-primary hover:underline"
//               >
//                 ¡Crea la primera publicación!
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Modal para crear nueva publicación */}
//       {isModalOpen && (
//         <PostFormModal
//           onClose={() => setIsModalOpen(false)}
//           onPostCreated={handlePostCreated}
//         />
//       )}
//     </div>
//   );
// };
