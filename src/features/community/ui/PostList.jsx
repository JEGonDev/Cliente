import React from "react";
import { PlusCircle } from "lucide-react";
import { PostItem } from "./PostItem"; // Componente que crearemos

export const PostList = ({ posts, isLoading, searchTerm, onCreatePost }) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
        <p className="mt-2 text-gray-600">Cargando publicaciones...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow text-center">
        <p className="text-gray-600">
          {searchTerm
            ? `No se encontraron publicaciones con "${searchTerm}"`
            : "No hay publicaciones disponibles"}
        </p>
        <button
          onClick={onCreatePost}
          className="mt-4 inline-flex items-center text-primary hover:underline"
        >
          <PlusCircle className="mr-1 h-4 w-4" />
          {searchTerm ? "Crear nueva publicación" : "Sé el primero en publicar"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map(post => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};