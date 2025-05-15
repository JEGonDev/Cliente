import React, { useState, useContext, useEffect } from "react";
import { MessageCircle, Heart, MoreVertical, Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { usePost } from "../hooks/usePost";
import { useReaction } from "../hooks/useReaction";
import { useMessage } from "../hooks/useMessage";
import { AuthContext } from "../../authentication/context/AuthContext";
import { PostComments } from "./PostComments";
import { EditPostForm } from "./EditPostForm";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";

export const PostItem = ({ post }) => {
  const { deletePost, canEditPost, canDeletePost, fetchAllPosts } = usePost();
  const { getReactionCounts, hasUserReacted, toggleReaction } = useReaction();
  const { getMessagesByPostId } = useMessage();
  const { user } = useContext(AuthContext);
  
  const [showComments, setShowComments] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  
  const reactionCounts = getReactionCounts(post.id);
  const likeCount = reactionCounts['like'] || 0;
  const hasLiked = hasUserReacted(post.id, 'like');
  const comments = getMessagesByPostId(post.id);
  const canEdit = canEditPost(post);
  const canDelete = canDeletePost(post);
  
  const postDate = new Date(post.postDate || new Date());
  const timeAgo = formatDistanceToNow(postDate, { addSuffix: true, locale: es });

  // Efecto para ocultar el mensaje de éxito después de un tiempo
  useEffect(() => {
    if (editSuccess) {
      const timer = setTimeout(() => {
        setEditSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [editSuccess]);
  
  const handleLikeToggle = () => {
    toggleReaction(post.id, 'like');
  };
  
  const handleCommentsToggle = () => {
    setShowComments(!showComments);
  };
  
  const handleEditSuccess = () => {
    setIsEditing(false);
    setEditSuccess(true);
    fetchAllPosts(); // Recargar los posts para obtener la versión actualizada
  };
  
  const handleDeletePost = async () => {
    const success = await deletePost(post.id);
    if (success) {
      setShowDeleteConfirm(false);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Mensaje de éxito para edición */}
      {editSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mb-2">
          La publicación ha sido actualizada exitosamente.
        </div>
      )}
      
      {/* Modo edición - Ahora estará siempre disponible pero condicionalmente visible */}
      {isEditing ? (
        <div className="p-4">
          <EditPostForm 
            post={post} 
            onCancel={() => setIsEditing(false)}
            onSuccess={handleEditSuccess}
          />
        </div>
      ) : (
        <div className="p-4">
          {/* Cabecera del post */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center">
              <div className="bg-gray-800 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
                {post.author?.charAt(0).toUpperCase() || user?.firstName?.charAt(0) || "U"}
              </div>
              <div>
                <div className="font-medium">
                  {post.author || `${user?.firstName} ${user?.lastName}` || "Usuario"}
                </div>
                <div className="text-gray-500 text-xs">{timeAgo}</div>
              </div>
            </div>
            
            {/* Opciones (editar/eliminar) */}
            {(canEdit || canDelete) && (
              <div className="relative">
                <button
                  onClick={() => setShowOptions(!showOptions)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                
                {showOptions && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    {canEdit && (
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowOptions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar publicación
                      </button>
                    )}
                    
                    {canDelete && (
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true);
                          setShowOptions(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar publicación
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Contenido del post */}
          <p className="text-sm whitespace-pre-line mb-4">{post.content}</p>
          
          {/* Imagen o multimedia si existe */}
          {post.multimediaContent && (
            <div className="mb-4">
              <img
                src={post.multimediaContent}
                alt="Contenido multimedia"
                className="w-full rounded-lg"
              />
            </div>
          )}
          
          {/* Contador de reacciones y comentarios */}
          <div className="flex justify-between text-sm border-t border-gray-100 pt-3">
            <button
              onClick={handleLikeToggle}
              className={`flex items-center ${hasLiked ? 'text-red-500' : 'text-gray-500'}`}
            >
              <Heart className={`h-5 w-5 mr-1 ${hasLiked ? 'fill-current' : ''}`} />
              <span>{likeCount} Me gusta</span>
            </button>
            
            <button
              onClick={handleCommentsToggle}
              className="flex items-center text-gray-500"
            >
              <MessageCircle className="h-5 w-5 mr-1" />
              <span>{comments.length} Comentarios</span>
            </button>
          </div>
        </div>
      )}
      
      {/* Sección de comentarios (condicional) */}
      {showComments && !isEditing && (
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <PostComments postId={post.id} />
        </div>
      )}
      
      {/* Diálogo de confirmación para eliminar */}
      {showDeleteConfirm && (
        <ConfirmationDialog
          title="Eliminar publicación"
          message="¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeletePost}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};