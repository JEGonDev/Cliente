import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { SearchBar } from "../ui/SearchBar";
import { usePost } from "../hooks/usePost";
import { PostList } from "../ui/PostList"; // Componente existente según mencionas
import { CreatePostForm } from "../ui/CreatePostForm"; // Componente existente según mencionas

export const HomeComunity = () => {
  const { posts, loading: postsLoading } = usePost();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Filtrar posts por término de búsqueda
  const filteredPosts = posts.filter(post => 
    post.content && post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Manejar la actualización del término de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <SearchBar 
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Buscar publicaciones"
        />
      </div>

      {/* Botón para mostrar/ocultar formulario de creación */}
      <div className="mb-4">
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="w-full flex items-center justify-center bg-primary text-white p-3 rounded-md hover:bg-green-700 transition-colors"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          <span>{showCreateForm ? "Cancelar" : "Crear nueva publicación"}</span>
        </button>
      </div>

      {/* Formulario de creación de posts (condicional) */}
      {showCreateForm && (
        <div className="mb-4">
          <CreatePostForm onPostCreated={() => setShowCreateForm(false)} />
        </div>
      )}

      {/* Lista de posts */}
      <PostList 
        posts={filteredPosts} 
        isLoading={postsLoading} 
        searchTerm={searchTerm}
        onCreatePost={() => setShowCreateForm(true)}
      />
    </div>
  );
};