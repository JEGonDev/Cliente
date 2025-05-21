import { useEffect, useState } from "react";
import { PostCard } from "../ui/PostCard";
import { SearchBar } from "../ui/SearchBar";
import { PostFormModal } from "../ui/PostFormModal";
import { communityService } from "../services/communityService";

export const PostListView = () => {
  // Estados para manejar las publicaciones
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  // Función para cargar las publicaciones
  const fetchPosts = async () => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      const response = await communityService.getAllPosts();
      
      // Verificamos que la respuesta sea un array
      const postsArray = Array.isArray(response) 
        ? response 
        : Array.isArray(response?.data) 
          ? response.data 
          : [];
      
      console.log("Publicaciones cargadas:", postsArray);
      
      setPosts(postsArray);
      setFilteredPosts(postsArray);
    } catch (error) {
      console.error("Error al obtener publicaciones:", error);
      setLoadError("No se pudieron cargar las publicaciones. Intente nuevamente.");
      setPosts([]);
      setFilteredPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargamos las publicaciones al montar el componente
  useEffect(() => {
    fetchPosts();
  }, []);

  // Función para filtrar publicaciones
  const handleSearch = (query) => {
    if (!query.trim()) {
      setFilteredPosts(posts);
      return;
    }
    
    const filtered = posts.filter(post => {
      // Verificamos que content y user_name existan antes de filtrar
      const content = post.content || "";
      const userName = post.user_name || post.userName || post.author || "";
      
      return content.toLowerCase().includes(query.toLowerCase()) ||
             userName.toLowerCase().includes(query.toLowerCase());
    });
    
    setFilteredPosts(filtered);
  };

  // Función para manejar la creación de una nueva publicación
  const handlePostCreated = (newPost) => {
    if (newPost) {
      console.log("Nueva publicación creada:", newPost);
      // Actualizamos la lista de publicaciones
      fetchPosts();
    }
    
    // Cerramos el modal
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Publicaciones de la comunidad</h1>
      
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} className="w-full" />
      </div>

      {/* Botón para crear nueva publicación */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Nuevo Post
        </button>
      </div>

      {/* Mensaje de carga */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {loadError && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{loadError}</p>
          <button 
            onClick={fetchPosts}
            className="mt-2 text-sm underline hover:text-red-800"
          >
            Intentar nuevamente
          </button>
        </div>
      )}

      {/* Lista de publicaciones */}
      {!isLoading && !loadError && (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <PostCard 
                key={post.id || post.post_id} 
                post={post} 
                onRefresh={fetchPosts} 
              />
            ))
          ) : (
            <div className="bg-gray-50 text-center py-8 rounded-lg">
              <p className="text-gray-500">No hay publicaciones disponibles.</p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-4 text-primary hover:underline"
              >
                ¡Sé el primero en publicar!
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal para crear nueva publicación */}
      {isModalOpen && (
        <PostFormModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};