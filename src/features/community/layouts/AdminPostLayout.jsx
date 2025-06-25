import { useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { AdminPostList } from "../ui/AdminPostList";
import { useNavigate } from "react-router-dom";

export const AdminPostLayout = ({ searchTerm = "" }) => {
  const navigate = useNavigate();
  const { posts, loading, error, fetchAllPostsRaw } = usePost();

  useEffect(() => {
    fetchAllPostsRaw();
  }, []);

  // Filtrado por barra de búsqueda (título o contenido)
  const filteredPosts = searchTerm
    ? posts.filter(
        (post) =>
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

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

      {/* Contenedor con altura fija y scroll interno */}
      <div className="max-h-96 overflow-y-auto px-2 py-4">
        <AdminPostList posts={filteredPosts} isLoading={loading} />
      </div>
    </div>
  );
};


// import { useEffect } from "react";
// import { usePost } from "../hooks/usePost";
// import { AdminPostList } from "../ui/AdminPostList";
// import { useNavigate } from "react-router-dom";

// export const AdminPostLayout = () => {
//   const navigate = useNavigate();
//   const { posts, loading, error, fetchAllPostsRaw } = usePost();

//   useEffect(() => {
//     fetchAllPostsRaw();
//   }, []);

//   const firstThree = posts.slice(0, 1);
//   const rest = posts.slice(3);

//   return (
//     <div>
//       <div className="bg-gray-100 p-4">
//         <h2 className="text-xl font-semibold mb-4">publicaciones de la comunidad</h2>
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={() => navigate(`/comunity/posts`)}
//             className="text-secondary underline text-sm"
//           >
//             Administrar publicaciones
//           </button>
//         </div>
//       </div>
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
//           <p>{error}</p>
//         </div>
//       )}

//       {/* Los primeros 3 posts */}
//       <AdminPostList posts={firstThree} isLoading={loading} />

//       {/* El resto en scroll interno */}
//       {rest.length > 0 && (
//         <div className="max-h-64 overflow-y-auto mt-4 border-t pt-2">
//           <AdminPostList posts={rest} />
//         </div>
//       )}
//     </div>
//   );
// };


// import { useEffect } from "react";
// import { usePost } from "../hooks/usePost";
// import { AdminPostList } from "../ui/AdminPostList";
// import { useNavigate } from "react-router-dom";

// export const AdminPostLayout = () => {
//   const navigate = useNavigate();
//   // Usa el nuevo método fetchAllPostsRaw del hook
//   const { posts, loading, error, fetchAllPostsRaw } = usePost();

//   useEffect(() => {
//     fetchAllPostsRaw();
//   }, []);

//   // Verifica el valor de posts y loading en cada render
//   console.log("POSTS EN AdminPostLayout (SIN FILTRO):", posts);
//   console.log("LOADING EN AdminPostLayout:", loading);

//   return (
//     <div>
//       <div className="bg-gray-100 p-4">
//         <h2 className="text-xl font-semibold mb-4">publicaciones de la comunidad</h2>
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={() => navigate(`/comunity/posts`)}
//             className="text-secondary underline text-sm"
//           >
//             Administrar publicaciones
//           </button>
//         </div>
//       </div>
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
//           <p>{error}</p>
//         </div>
//       )}

//       <AdminPostList posts={posts} isLoading={loading} />
//     </div>
//   );
// };


// import { useEffect } from "react";
// import { usePost } from "../hooks/usePost";
// import { AdminPostList } from "../ui/AdminPostList";
// import { useNavigate } from "react-router-dom";

// export const AdminPostLayout = () => {
//   const navigate = useNavigate();
//   const { posts, loading, error, fetchAllPosts } = usePost();

//   useEffect(() => {
//     fetchAllPosts();
//   }, []);

//   // Verifica el valor de posts y loading en cada render
//   console.log("POSTS EN AdminPostLayout:", posts);
//   console.log("LOADING EN AdminPostLayout:", loading);

//   return (
//     <div>
//       <div className="bg-gray-100 p-4">
//         <h2 className="text-xl font-semibold mb-4">publicaciones de la comunidad</h2>
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={() => navigate(`/comunity/posts`)}
//             className="text-secondary underline text-sm"
//           >
//             Administrar publicaciones
//           </button>
//         </div>
//       </div>
//       {error && (
//         <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
//           <p>{error}</p>
//         </div>
//       )}

//       <AdminPostList posts={posts} isLoading={loading} />
      
//     </div>
//   );
// };