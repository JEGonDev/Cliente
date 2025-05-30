import React, { useEffect, useState } from 'react';
import { MessageCard } from './MessageCard';
import { PostCard } from './PostCard';
import { communityService } from '../services/communityService';

/**
 * Componente que muestra una lista unificada de mensajes y posts de un grupo
 * ordenados cronológicamente (del más antiguo al más nuevo)
 */
export const GroupContentList = ({
  groupId,
  messages = [],
  isLoading = false,
  error = null,
  onDeleteMessage,
  onDeletePost,
  onRefresh
}) => {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [postsError, setPostsError] = useState(null);

  // Función para cargar posts
  const fetchGroupPosts = async () => {
    setLoadingPosts(true);
    try {
      const response = await communityService.getPostsByGroup(groupId);
      setPosts(response?.data || []);
    } catch (err) {
      console.error('Error al cargar posts del grupo:', err);
      setPostsError(err?.message || 'Error al cargar publicaciones');
    } finally {
      setLoadingPosts(false);
    }
  };

  // Cargar posts del grupo
  useEffect(() => {
    if (groupId) {
      fetchGroupPosts();
    }
  }, [groupId]);

  // Recargar posts cuando cambian los mensajes
  useEffect(() => {
    fetchGroupPosts();
  }, [messages.length]); // Solo recargar cuando cambia el número de mensajes

  // Combinar y ordenar mensajes y posts por tiempo de creación
  const sortedContent = React.useMemo(() => {
    // Función auxiliar para obtener el timestamp de un elemento
    const getTimestamp = (item) => {
      // Normalizar las diferentes formas en que puede venir la fecha
      const date = item.creationDate || item.creation_date || item.postDate || item.post_date;
      return new Date(date).getTime();
    };

    // Procesar mensajes
    const processedMessages = messages.map(msg => ({
      ...msg,
      type: 'message',
      timestamp: getTimestamp(msg)
    }));

    // Procesar posts
    const processedPosts = posts.map(post => ({
      ...post,
      type: 'post',
      timestamp: getTimestamp(post)
    }));

    // Combinar todos los elementos en un solo array
    const allContent = [...processedMessages, ...processedPosts];

    // Ordenar por timestamp (del más antiguo al más nuevo)
    return allContent.sort((a, b) => a.timestamp - b.timestamp);
  }, [messages, posts]);

  if (isLoading && loadingPosts) {
    return (
      <div className="flex justify-center items-center h-full min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-600">Cargando contenido...</p>
        </div>
      </div>
    );
  }

  if (error || postsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-medium">Error al cargar contenido</p>
        <p className="text-red-500 text-sm mt-1">{error || postsError}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-3 text-primary hover:text-green-700 text-sm font-medium"
          >
            Intentar nuevamente
          </button>
        )}
      </div>
    );
  }

  if (sortedContent.length === 0) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <div className="text-center max-w-md mx-auto">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay contenido en este grupo
          </h3>
          <p className="text-gray-500 text-sm">
            ¡Sé el primero en compartir algo! Puedes enviar un mensaje o crear una publicación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedContent.map((item) => (
        <div key={`${item.type}-${item.id}`} className="animate-fadeIn">
          {item.type === 'message' ? (
            <MessageCard
              message={item}
              onDelete={onDeleteMessage}
            />
          ) : (
            <PostCard
              post={item}
              onDelete={onDeletePost}
              showInGroup={true}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default GroupContentList; 