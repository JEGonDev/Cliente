import { useState, useEffect } from "react";
import { SearchBar } from "../ui/SearchBar";
import { PostList } from "../ui/PostList";
import { CreatePostButton } from "../ui/CreatePostButton";
import { usePost } from "../hooks/usePost";

/**
 * Página principal de la comunidad que muestra el feed de publicaciones
 */
export const HomeComunity = () => {
  // Usamos el hook personalizado para manejar publicaciones
  const { 
    posts, 
    loading, 
    error, 
    fetchAllPosts 
  } = usePost();
  
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  
  // Definir el contexto para la creación - Es el muro principal (general)
  const createContext = { type: 'general' };
  
  // Cargar publicaciones al montar el componente
  useEffect(() => {
    fetchAllPosts();
  }, []);
  
  // Filtrar publicaciones según el término de búsqueda
  const filteredPosts = searchTerm 
    ? posts.filter(post => 
        post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.postType?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;
  
  // Manejar cambio en la búsqueda
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };
  
  // Manejar la creación exitosa de una publicación
  const handlePostCreated = () => {
    // Actualizar la lista de publicaciones
    fetchAllPosts();
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Feed de la Comunidad</h1>
      
      {/* Barra de búsqueda y botón de crear publicación */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-grow">
          <SearchBar 
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar publicaciones..."
          />
        </div>
        
        <CreatePostButton 
          onPostCreated={handlePostCreated}
          variant="primary"
          className="w-full sm:w-auto"
          context={createContext}
        />
      </div>
      
      {/* Mensaje de error si existe */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {/* Lista de publicaciones */}
      <PostList 
        posts={filteredPosts}
        isLoading={loading}
        searchTerm={searchTerm}
        onCreatePost={() => document.querySelector('button[aria-label="Crear publicación"]').click()}
        onRefresh={fetchAllPosts}
        context={createContext}
      />
    </div>
  );
};