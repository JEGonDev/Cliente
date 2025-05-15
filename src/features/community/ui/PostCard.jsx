
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCommunity } from "../context/CommunityContext";
import { AuthContext } from "../../authentication/context/AuthContext";
import { MessageCircle, Heart, ThumbsUp, Edit, Trash2 } from "lucide-react";

export const PostCard = ({ post, onRefresh }) => {
  const { canEditPost, canDeletePost, deletePost } = useCommunity();
  const { isAuthenticated, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  // Formato de fecha
  const formatDate = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Manejar navegación a detalle de post
  const handleViewPost = () => {
    navigate(`/community/post/${post.id}`);
  };

  // Manejar navegación a edición de post
  const handleEditPost = (e) => {
    e.stopPropagation(); // Evitar navegación a detalle
    navigate(`/community/post/edit/${post.id}`);
  };

  // Manejar eliminación de post
  const handleDeletePost = async (e) => {
    e.stopPropagation(); // Evitar navegación a detalle
    
    if (isConfirmingDelete) {
      try {
        await deletePost(post.id);
        if (onRefresh) onRefresh();
      } catch (error) {
        console.error("Error al eliminar post:", error);
      }
      setIsConfirmingDelete(false);
    } else {
      setIsConfirmingDelete(true);
    }
  };

  // Cancelar eliminación
  const cancelDelete = (e) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  // Determinar si el usuario actual puede editar/eliminar el post
  const canEdit = isAuthenticated && post.id && canEditPost(post);
  const canDelete = isAuthenticated && post.id && canDeletePost(post);

  return (
    <div 
      className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition cursor-pointer"
      onClick={handleViewPost}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold">{post.title}</h3>
        
        {/* Acciones de edición/eliminación */}
        {(canEdit || canDelete) && (
          <div className="flex space-x-2">
            {canEdit && (
              <button 
                onClick={handleEditPost}
                className="text-blue-500 hover:text-blue-700"
                title="Editar"
              >
                <Edit size={18} />
              </button>
            )}
            
            {canDelete && (
              <button 
                onClick={handleDeletePost}
                className="text-red-500 hover:text-red-700"
                title="Eliminar"
              >
                <Trash2 size={18} />
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Metadatos del post */}
      <div className="flex items-center text-xs text-gray-500 mb-2">
        <span>{post.user?.username || "Usuario"}</span>
        <span className="mx-2">•</span>
        <span>{formatDate(post.createdAt) || "Fecha desconocida"}</span>
      </div>
      
      {/* Contenido */}
      <p className="text-gray-700 mb-2">{post.content}</p>
      
      {/* Estadísticas */}
      <div className="flex items-center text-xs text-gray-500 mt-3">
        <div className="flex items-center mr-4">
          <Heart size={14} className="mr-1" />
          <span>{post._count?.reactions || 0}</span>
        </div>
        
        <div className="flex items-center">
          <MessageCircle size={14} className="mr-1" />
          <span>{post._count?.messages || 0}</span>
        </div>
      </div>
      
      {/* Confirmación de eliminación */}
      {isConfirmingDelete && (
        <div className="mt-2 p-2 bg-red-50 rounded border border-red-200">
          <p className="text-sm text-red-700 mb-2">¿Estás seguro de eliminar esta publicación?</p>
          <div className="flex space-x-2">
            <button 
              onClick={handleDeletePost}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded"
            >
              Confirmar
            </button>
            <button 
              onClick={cancelDelete}
              className="text-xs bg-gray-200 px-2 py-1 rounded"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};