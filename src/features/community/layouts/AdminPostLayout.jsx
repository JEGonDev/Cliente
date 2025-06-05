import { useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { AdminPostList } from "../ui/AdminPostList";

export const AdminPostLayout = () => {
  const { posts, loading, error, fetchAllPosts } = usePost();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Verifica el valor de posts y loading en cada render
  console.log("POSTS EN AdminPostLayout:", posts);
  console.log("LOADING EN AdminPostLayout:", loading);

  return (
    <div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <AdminPostList posts={posts} isLoading={loading} />
      console.log("¿Está cargando?", isLoading);
    </div>
  );
};