import React from "react";
import { useState } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { PostCard } from "../components/PostCard";

const dummyGroupPosts = [
  {
    id: 1,
    title: "Problemas con plagas",
    content: "Necesito ayuda con mi cultivo",
  },
];

export const GroupDetail = () => {
  const [posts, setPosts] = useState(dummyGroupPosts);
  const [newPost, setNewPost] = useState({ title: "", content: "" });

  const handlePost = () => {
    if (!newPost.title || !newPost.content) return;
    setPosts([{ ...newPost, id: Date.now() }, ...posts]);
    setNewPost({ title: "", content: "" });
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Grupo: Hidroponía</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Título"
            className="w-full border p-2 rounded mb-2"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <textarea
            placeholder="Contenido"
            className="w-full border p-2 rounded"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
          />
          <button
            className="bg-green-600 text-white px-4 py-2 mt-2 rounded"
            onClick={handlePost}
          >
            Publicar
          </button>
        </div>

        <div className="space-y-4">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
