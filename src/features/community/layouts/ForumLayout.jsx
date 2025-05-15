// src/features/community/layouts/ForumLayout.jsx
import React, { useState, useEffect } from "react";
import { ForumHeader } from "../ui/ForumHeader";
import { Forum } from "./Forum";
import { useCommunity } from "../context/CommunityContext";

export const ForumLayout = () => {
  const { fetchAllPosts, posts, loadingPosts, postError } = useCommunity();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Cargar posts al montar el componente
  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);
  
  // Filtrar posts según término de búsqueda
  const filteredPosts = searchTerm
    ? posts.filter(
        post =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;
  
  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <ForumHeader 
        onCreatePost={() => setShowCreateForm(true)}
        onSearch={setSearchTerm}
      />
      
      <Forum 
        posts={filteredPosts}
        loading={loadingPosts}
        error={postError}
        showCreateForm={showCreateForm}
        onCreateFormClose={() => setShowCreateForm(false)}
      />
    </div>
  );
};