import React from "react";
import { useState } from "react";
import { PostCard } from "../ui/PostCard";


const dummyPosts = [
  {
    id: 1,
    title: "¿Cómo mejorar la calidad del tomate?",
    content: "Estoy buscando consejos...",
  },
  {
    id: 2,
    title: "Riego por goteo vs inmersión",
    content: "¿Qué método usan y por qué?",
  },
];

export const Forum = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handleCreatePost = () => {
    if (!newPost.title || !newPost.content) return;
    const newEntry = { ...newPost, id: Date.now() };
    setPosts([newEntry, ...posts]);
    setNewPost({ title: "", content: "" });
  };

  return (
    
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Foro de Comunidad</h1>

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
            onClick={handleCreatePost}
          >
            Publicar
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    
  );
};
