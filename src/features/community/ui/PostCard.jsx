import { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, MoreVertical, Calendar } from "lucide-react";
import { usePost } from "../hooks/usePost";
import PropTypes from "prop-types";

/**
 * Componente para mostrar una publicación en forma de tarjeta
 * 
 * @param {Object} props - Propiedades del componente 
 * @param {Object} props.post - Datos de la publicación
 * @param {Function} props.onRefresh - Función para actualizar publicaciones
 */
export const PostCard = ({ post, onRefresh }) => {
  // Usar hook para lógica de publicaciones
  const { handleDeletePost } = usePost();
  
  // Estado para el menú de opciones
  const [showOptions, setShowOptions] = useState(false);
  
  // Identificadores normalizados
  const postId = post.id || post.post_id;
  const userId = post.userId || post.user_id;
  const userName = post.userName || post.user_name || post.author || "Usuario";
  const postDate = post.createdAt || post.creation_date || post.post_date || new Date();
  const content = post.content || "";
  const imageUrl = post.multimediaContent || post.multimedia_content;
  
  // Formatear fecha
  const formattedDate = new Date(postDate).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Manejar eliminación de publicación
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      const success = await handleDeletePost(postId);
      if (success && onRefresh) {
        onRefresh();
      }
    }
    setShowOptions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      {/* Cabecera con autor y fecha */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center">
          {/* Avatar generado con iniciales */}
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-gray-800">{userName}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
        
        {/* Menú de opciones (tres puntos verticales) */}
        <div className="relative">
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => setShowOptions(!showOptions)}
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Menú desplegable con opciones */}
          {showOptions && (
            <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
              <button
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Eliminar publicación
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Contenido de la publicación */}
      <div className="p-4">
        <p className="text-gray-800 mb-4 whitespace-pre-line">{content}</p>
        
        {/* Imagen adjunta si existe */}
        {imageUrl && (
          <div className="mb-4 rounded-md overflow-hidden">
            <img 
              src={imageUrl} 
              alt="Contenido multimedia" 
              className="w-full object-cover max-h-96"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
              }}
            />
          </div>
        )}
        
        {/* Barra de interacciones (me gusta, comentarios, compartir) */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-2">
          <button className="flex items-center text-gray-600 hover:text-blue-500">
            <ThumbsUp className="w-5 h-5 mr-1" />
            <span>Me gusta</span>
          </button>
          
          <button className="flex items-center text-gray-600 hover:text-green-500">
            <MessageSquare className="w-5 h-5 mr-1" />
            <span>Comentar</span>
          </button>
          
          <button className="flex items-center text-gray-600 hover:text-purple-500">
            <Share2 className="w-5 h-5 mr-1" />
            <span>Compartir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onRefresh: PropTypes.func
};