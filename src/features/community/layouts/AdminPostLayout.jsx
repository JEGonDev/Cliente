import { useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { AdminPostList } from "../ui/AdminPostList";
import { useNavigate } from "react-router-dom";

export const AdminPostLayout = () => {
  const navigate = useNavigate();
  const { posts, loading, error, fetchAllPosts } = usePost();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  // Verifica el valor de posts y loading en cada render
  console.log("POSTS EN AdminPostLayout:", posts);
  console.log("LOADING EN AdminPostLayout:", loading);

  return (
    <div>
      <div className="bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">publicaciones de la comunidad</h2>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/comunity/posts`)}
            className="text-secondary underline text-sm"
          >
            Administrar publicaciones
          </button>
        </div>
      </div>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <AdminPostList posts={posts} isLoading={loading} />
      
    </div>
  );
};