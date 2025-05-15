import React, { useEffect, useContext, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { useMessage } from "../hooks/useMessage";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { AuthContext } from "../../authentication/context/AuthContext";

export const PostComments = ({ postId }) => {
  const { 
    messages,
    getMessagesByPostId, 
    formData, 
    handleChange, 
    setMessageContext, 
    handleCreateMessage, 
    deleteMessage, 
    canDeleteMessage 
  } = useMessage();
  
  const { user } = useContext(AuthContext);
  
  // Usar useMemo para memoizar los comentarios
  const comments = useMemo(() => 
    getMessagesByPostId(postId),
    [getMessagesByPostId, postId, messages]
  );
  
  // Inicializar el contexto del mensaje cuando cambia el postId
  useEffect(() => {
    if (postId) {
      setMessageContext(postId);
    }
  }, [postId]); // Eliminar setMessageContext de las dependencias
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.content.trim()) {
      handleCreateMessage(e);
    }
  };
  
  return (
    <div>
      {/* Lista de comentarios */}
      {comments.length === 0 ? (
        <p className="text-center text-sm text-gray-500 py-2">
          No hay comentarios aún. ¡Sé el primero en comentar!
        </p>
      ) : (
        <div className="space-y-3 mb-4">
          {comments.map(comment => {
            const messageDate = new Date(comment.messageDate || new Date());
            const timeAgo = formatDistanceToNow(messageDate, { addSuffix: true, locale: es });
            // Simplificar la lógica de canDelete para evitar problemas
            const canDelete = user && (user.id === comment.userId || user.isAdmin || user.isModerator);
            
            return (
              <div key={comment.id} className="flex group">
                <div className="rounded-full overflow-hidden w-8 h-8 mr-2 flex-shrink-0">
                  <div className="bg-gray-600 text-white w-full h-full flex items-center justify-center text-sm">
                    {comment.author?.charAt(0).toUpperCase() || user?.firstName?.charAt(0) || "U"}
                  </div>
                </div>
                
                <div className="flex-grow">
                  <div className="bg-white rounded-lg p-2 shadow-sm relative">
                    <div className="flex justify-between">
                      <div className="font-medium text-sm">
                        {comment.author || `${user?.firstName} ${user?.lastName}` || "Usuario"}
                      </div>
                      {canDelete && (
                        <button
                          onClick={() => deleteMessage(comment.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                          title="Eliminar comentario"
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{timeAgo}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Formulario para nuevo comentario */}
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          name="content"
          value={formData.content}
          onChange={handleChange}
          placeholder="Escribe un comentario..."
          className="flex-grow p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-green-700"
          disabled={!formData.content.trim()}
        >
          Comentar
        </button>
      </form>
    </div>
  );
};