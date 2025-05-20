import React, { useEffect, useState } from "react";
import { PostCard } from "../ui/PostCard";
import { SearchBar } from "../ui/SearchBar";
import { PostFormModal } from "../ui/PostFormModal";
import { communityService } from "../services/communityService";

export const PostListView = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const defaultPost = [
    {
      post_id: 0,
      user_name: "Usuario Ejemplo",
      content: "Este es un ejemplo de post en la comunidad",
      post_type: "general",
      group_id: null,
      multimedia_content: null,
    },
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await communityService.getAllPosts();
        if (Array.isArray(data) && data.length > 0) {
          setPosts(data);
          setFilteredPosts(data);
        } else {
          setPosts(defaultPost);
          setFilteredPosts(defaultPost);
        }
      } catch (error) {
        console.error("Error al obtener publicaciones:", error);
        setPosts(defaultPost);
        setFilteredPosts(defaultPost);
      }
    };

    fetchPosts();
  }, []);

  const handleSearch = (query) => {
    const filtered = posts.filter(
      (post) =>
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.user_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredPosts(filtered);
  };

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
    setFilteredPosts([newPost, ...filteredPosts]);
  };

  return (
    <div className="p-4">
      {/* Barra de búsqueda ocupa todo el ancho */}
      <div className="mb-4">
        <SearchBar onSearch={handleSearch} className="w-full" />
      </div>

      {/* Botón alineado a la derecha */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Crear Nuevo Post
        </button>
      </div>

      {/* Lista de publicaciones */}
      <div className="grid grid-cols-1 gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.post_id} post={post} />
          ))
        ) : (
          <p className="text-gray-500 text-center">No hay publicaciones disponibles.</p>
        )}
      </div>

      {/* Modal para crear nueva publicación */}
      {isModalOpen && (
        <PostFormModal
          onClose={() => setIsModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};


// import React, { useEffect, useState } from "react";
// import { PostCard } from "../ui/PostCard";
// import { SearchBar } from "../ui/SearchBar";
// import { PostFormModal } from "../ui/PostFormModal";
// import { communityService } from "../services/communityService";

// export const PostListView = () => {
//   const [posts, setPosts] = useState([]);
//   const [filteredPosts, setFilteredPosts] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     communityService
//       .getAllPosts()
//       .then((data) => {
//         if (Array.isArray(data)) {
//           setPosts(data);
//           setFilteredPosts(data);
//         } else {
//           console.error("La API no devolvió un array:", data);
//           setPosts([]);
//           setFilteredPosts([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error al obtener publicaciones:", error);
//         setPosts([]);
//         setFilteredPosts([]);
//       });
//   }, []);

//   const handleSearch = (query) => {
//     const filtered = posts.filter(
//       (post) =>
//         post.content.toLowerCase().includes(query.toLowerCase()) ||
//         post.user_name.toLowerCase().includes(query.toLowerCase())
//     );
//     setFilteredPosts(filtered);
//   };

//   const handlePostCreated = (newPost) => {
//     setPosts([newPost, ...posts]);
//     setFilteredPosts([newPost, ...filteredPosts]);
//   };

//   return (
//     <div className="p-4">
//       <div className="flex justify-between items-center mb-4">
//         <SearchBar onSearch={handleSearch} />
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Crear Nuevo Post
//         </button>
//       </div>

//       <div className="grid grid-cols-1 gap-6">
//         {Array.isArray(filteredPosts) && filteredPosts.map((post) => (
//           <PostCard key={post.post_id} post={post} />
//         ))}
//       </div>

//       {isModalOpen && (
//         <PostFormModal
//           onClose={() => setIsModalOpen(false)}
//           onPostCreated={handlePostCreated}
//         />
//       )}
//     </div>
//   );
// };