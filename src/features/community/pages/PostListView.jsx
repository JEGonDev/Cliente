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

  return (
    <div className="container mx-auto p-2 md:p-4 w-full">
      <div className="flex flex-col items-center justify-center lg:flex-row lg:items-start lg:justify-between mb-6 gap-2 lg:gap-0">
        <div className="text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-poppins mb-4 bg-gradient-to-r from-[#23582a] via-[#059669] to-[#10b981] bg-clip-text text-transparent">
            Publicaciones de la Comunidad
          </h1>
          <p className="text-gray-600 text-base sm:text-lg font-inter mb-4">
            Inspira, comparte y crece junto a la comunidad.
          </p>
        </div>
        <div className="flex justify-center gap-2 flex-wrap mt-2 lg:mt-0">
          <PlantGrow className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          <PlantGrow className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          <PlantGrow className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
          <PlantGrow className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-2 md:gap-4 mb-4">
        <div className="flex-grow">
          <SearchBar
            onSearch={handleSearch}
            className="w-full"
            placeholder="Buscar por contenido, autor o tipo..."
          />
        </div>
        <div className="flex gap-2 justify-end flex-wrap">
          <button
            onClick={toggleUserPostsFilter}
            className={`flex items-center px-2 py-2 md:px-3 rounded-md border text-xs sm:text-sm md:text-base
              ${showOnlyUserPosts
                ? "bg-primary text-white border-primary"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
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
            className="flex items-center px-2 py-2 md:px-3 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-xs sm:text-sm md:text-base"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex justify-end mb-3">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-2 py-2 md:px-4 rounded-md hover:bg-green-600 flex items-center text-xs sm:text-sm md:text-base"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden xs:inline">Crear Publicación</span>
          <span className="xs:hidden">Nuevo</span>
        </button>
      </div>

      {showOnlyUserPosts && (
        <div className="bg-blue-50 text-blue-700 p-2 md:p-3 rounded mb-3 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            <span>Mostrando solo tus publicaciones</span>
          </div>
          <button
            onClick={fetchAllPosts}
            className="text-xs sm:text-sm underline hover:text-blue-900"
          >
            Ver todas
          </button>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
        </div>
      )}

      {loadError && !isLoading && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{loadError}</p>
          <button
            onClick={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
            className="mt-2 text-xs sm:text-sm underline hover:text-red-800"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {!isLoading && !loadError && (
        <div className="flex p-2 sm:p-4 flex-col items-center gap-10 w-full">
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
                  className="w-full max-w-4xl px-2 sm:px-4"
                >
                  <PostCard
                    post={post}
                    onRefresh={showOnlyUserPosts ? fetchUserPosts : fetchAllPosts}
                    onUpdate={handlePostUpdated}
                    onDelete={handlePostDeleted}
                  />
                </motion.div>
              ))
            ) : (
              <div className="bg-gray-50 text-center py-8 px-2 rounded-lg w-full max-w-2xl">
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
