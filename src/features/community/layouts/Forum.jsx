import React, { useState, useEffect } from "react";
import { PostCard } from "../ui/PostCard";
import { useCommunity } from "../context/CommunityContext";
import { usePost } from "../hooks/usePost";

export const Forum = () => {
  // Obtenemos la funcionalidad del contexto y hooks
  const { posts, fetchAllPosts, loadingPosts, postError } = useCommunity();
  const { formData, handleChange, handleCreatePost, resetForm } = usePost();
  
  // Estado local para nuevos posts
  const [newPost, setNewPost] = useState({ title: "", content: "" });
  
  // Cargar posts al montar el componente
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);

  // Manejar creación de un nuevo post usando el contexto
  const handlePost = async () => {
    if (!newPost.title || !newPost.content) return;
    
    try {
      // Preparamos los datos para el formato esperado por usePost
      formData.title = newPost.title;
      formData.content = newPost.content;
      formData.postType = "FORUM"; // Asumimos un tipo específico para posts del foro
      
      // Enviamos el post mediante el hook
      await handleCreatePost();
      
      // Limpiamos formulario
      setNewPost({ title: "", content: "" });
      resetForm();
      
      // Recargamos posts
      fetchAllPosts();
    } catch (error) {
      console.error("Error al crear post:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Foro de Comunidad</h1>

      {/* Formulario para crear post */}
      <div className="bg-white p-4 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Crear nueva publicación
        </h2>
        <input
          type="text"
          placeholder="Título"
          className="w-full p-2 border rounded mb-2"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Contenido"
          className="w-full p-2 border rounded mb-2"
          value={newPost.content}
          onChange={(e) =>
            setNewPost({ ...newPost, content: e.target.value })
          }
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handlePost}
        >
          Publicar
        </button>
      </div>

      {/* Mostrar error si existe */}
      {postError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{postError}</p>
        </div>
      )}

      {/* Indicador de carga */}
      {loadingPosts ? (
        <div className="flex justify-center my-8">
          <p className="text-gray-500">Cargando publicaciones...</p>
        </div>
      ) : (
        /* Lista de posts */
        <div className="space-y-4">
          {posts && posts.length > 0 ? (
            posts.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onRefresh={fetchAllPosts} 
              />
            ))
          ) : (
            // Datos de ejemplo si no hay posts
            [
              {
                id: 1,
                title: "¿Cómo mejorar la calidad del tomate?",
                content: "Estoy buscando consejos para mejorar mis cultivos de tomate...",
              },
              {
                id: 2,
                title: "Riego por goteo vs inmersión",
                content: "¿Qué método usan y por qué? Estoy evaluando opciones...",
              },
            ].map(dummyPost => (
              <PostCard key={dummyPost.id} post={dummyPost} />
            ))
          )}
        </div>
      )}
    </div>
  );
};