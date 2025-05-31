import React, { useEffect, useState, useRef } from 'react';
import { MessageCard } from './MessageCard';
import { PostCard } from './PostCard';
import { communityService } from '../services/communityService';
import { RefreshCw } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Componente que muestra una lista unificada de mensajes y posts de un hilo
 * ordenados cronológicamente (del más antiguo al más nuevo)
 */
export const ThreadContentList = ({
  threadId,
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
  const [hasNewContent, setHasNewContent] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const contentEndRef = useRef(null);
  const prevContentLengthRef = useRef(0);

  // Función para hacer scroll al final
  const scrollToBottom = (behavior = 'smooth') => {
    if (contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior, block: 'end' });
    }
  };

  // Función para cargar posts
  const fetchThreadPosts = async () => {
    setLoadingPosts(true);
    try {
      // TODO: Cuando el endpoint esté disponible, usar communityService.getPostsByThread
      // Por ahora retornamos un array vacío
      // const response = await communityService.getPostsByThread(threadId);
      // setPosts(response?.data || []);
      setPosts([]);
      setHasNewContent(false);
    } catch (err) {
      console.error('Error al cargar posts del hilo:', err);
      setPostsError(err?.message || 'Error al cargar publicaciones');
    } finally {
      setLoadingPosts(false);
    }
  };

  // Cargar posts del hilo
  useEffect(() => {
    if (threadId) {
      fetchThreadPosts();
    }
  }, [threadId]);

  // Verificar si hay nuevo contenido cada 30 segundos
  useEffect(() => {
    const checkNewContent = async () => {
      try {
        // TODO: Cuando el endpoint esté disponible, verificar nuevos posts
        // const response = await communityService.getPostsByThread(threadId);
        // const newPosts = response?.data || [];
        // if (newPosts.length > posts.length) {
        //   setHasNewContent(true);
        // }
      } catch (error) {
        console.error('Error al verificar nuevo contenido:', error);
      }
    };

    const interval = setInterval(checkNewContent, 30000);
    return () => clearInterval(interval);
  }, [threadId, posts.length]);

  // Efecto para hacer scroll al final cuando hay nuevo contenido
  useEffect(() => {
    const currentContentLength = messages.length + posts.length;

    // Si hay más contenido que antes, hacer scroll al final
    if (currentContentLength > prevContentLengthRef.current) {
      scrollToBottom();
    }

    // Actualizar la referencia del tamaño anterior
    prevContentLengthRef.current = currentContentLength;
  }, [messages.length, posts.length]);

  // Función para manejar la actualización manual
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchThreadPosts();
      if (onRefresh) {
        await onRefresh();
      }
      // Hacer scroll al final después de actualizar
      setTimeout(() => scrollToBottom('auto'), 100);
    } finally {
      setIsRefreshing(false);
    }
  };

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
            onClick={handleRefresh}
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
            No hay contenido en este hilo
          </h3>
          <p className="text-gray-500 text-sm">
            ¡Sé el primero en compartir algo! Puedes enviar un mensaje o crear una publicación.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Botón de actualización */}
      {hasNewContent && (
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="sticky top-0 left-0 right-0 w-full bg-primary text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2 z-10 mb-4"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Actualizando...' : 'Hay nuevas publicaciones disponibles'}</span>
        </button>
      )}

      {/* Lista de contenido */}
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
                showInThread={true}
              />
            )}
          </div>
        ))}
        {/* Elemento de referencia para el scroll */}
        <div ref={contentEndRef} />
      </div>
    </div>
  );
};

// Agregar PropTypes para validación
ThreadContentList.propTypes = {
  threadId: PropTypes.number.isRequired,
  messages: PropTypes.array,
  isLoading: PropTypes.bool,
  error: PropTypes.string,
  onDeleteMessage: PropTypes.func,
  onDeletePost: PropTypes.func,
  onRefresh: PropTypes.func
};

export default ThreadContentList;