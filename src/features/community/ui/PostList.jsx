import { PlusCircle } from "lucide-react";
import { PostCard } from "./PostCard";
import { CreatePostButton } from "./CreatePostButton";
import PropTypes from "prop-types";

/**
 * Componente que muestra una lista de publicaciones
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.posts - Lista de publicaciones a mostrar
 * @param {boolean} props.isLoading - Indica si se están cargando las publicaciones
 * @param {string} props.searchTerm - Término de búsqueda actual (para mensajes vacíos)
 * @param {Function} props.onCreatePost - Función para iniciar la creación de una publicación
 * @param {Function} props.onRefresh - Función para actualizar la lista de publicaciones
 */
export const PostList = ({ 
  posts = [], 
  isLoading = false, 
  searchTerm = "", 
  onCreatePost,
  onRefresh
}) => {
  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si no hay publicaciones, mostrar mensaje apropiado
  if (!posts || posts.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <p className="text-gray-600 mb-6">
          {searchTerm
            ? `No se encontraron publicaciones con "${searchTerm}"`
            : "Aún no hay publicaciones disponibles"}
        </p>
        
        {onCreatePost ? (
          <CreatePostButton 
            onPostCreated={onRefresh}
            label={searchTerm ? "Crear nueva publicación" : "¡Sé el primero en publicar!"}
            variant="primary"
          />
        ) : (
          <button
            onClick={onCreatePost}
            className="inline-flex items-center text-primary hover:underline"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            {searchTerm ? "Crear nueva publicación" : "¡Sé el primero en publicar!"}
          </button>
        )}
      </div>
    );
  }

  // Renderizar la lista de publicaciones
  return (
    <div className="space-y-6">
      {posts.map(post => (
        <PostCard 
          key={post.id || post.post_id} 
          post={post} 
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.array,
  isLoading: PropTypes.bool,
  searchTerm: PropTypes.string,
  onCreatePost: PropTypes.func,
  onRefresh: PropTypes.func
};