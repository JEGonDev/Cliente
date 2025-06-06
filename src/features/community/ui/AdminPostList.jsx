import PropTypes from "prop-types";
import { PostCard } from "./PostCard";

/**
 * Componente simple para mostrar todas las publicaciones (solo visualización).
 * @param {Object} props
 * @param {Array} props.posts - Lista de publicaciones
 * @param {boolean} props.isLoading - Estado de carga
 */
export const AdminPostList = ({ posts = [], isLoading = false }) => {
    console.log("AdminPostList posts:", posts);
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-gray-600 mb-6">
          Aún no hay publicaciones disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard
          key={post.id || post.post_id}
          post={post}
        />
      ))}
    </div>
  );
};

AdminPostList.propTypes = {
  posts: PropTypes.array,
  isLoading: PropTypes.bool
};