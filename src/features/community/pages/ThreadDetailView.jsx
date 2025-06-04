import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Hash, ChevronRightIcon } from "lucide-react";
import { AuthContext } from "../../authentication/context/AuthContext";
import { useThread } from "../hooks/useThread";
import { useGroup } from "../hooks/useGroup";
import { Button } from "../../../ui/components/Button";
import { ThreadEditModal } from "../ui/ThreadEditModal";
import { ThreadDeleteDialog } from "../ui/ThreadDeleteDialog";
import { MessageList } from "../ui/MessageList";
import { MessageForm } from "../ui/MessageForm";
import { useCompleteMessage } from "../hooks/useCompleteMessage";
import { websocketService } from "../../../common/services/webSocketService";
import { PostFormModal } from "../ui/PostFormModal";
import { ThreadContentList } from '../ui/ThreadContentList';
import { communityService } from "../services/communityService";

export const ThreadDetailView = () => {
  const { isAdmin, isModerator } = useContext(AuthContext);
  const { threadId } = useParams();
  const navigate = useNavigate();
  const threadContentListRef = useRef(null);

  // Estados locales para modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estado para WebSocket
  const [wsConnected, setWsConnected] = useState(false);
  const [wsSubscriptionId, setWsSubscriptionId] = useState(null);

  // Hook de hilos
  const {
    threads,
    loading,
    error,
    fetchThreadById,
    handleUpdateThread,
    handleDeleteThread,
    canUpdateThread,
    canDeleteThread,
    formData,
    handleChange,
    resetForm,
    formErrors,
    setFormDataFromThread
  } = useThread();

  // Hook de mensajes
  const {
    messages,
    loading: messagesLoading,
    error: messagesError,
    handleCreateMessage,
    handleDeleteMessage,
    setMessageContext,
    loadMessagesByType,
    getMessagesByType,
    clearError
  } = useCompleteMessage();

  // Extraer el hilo individual del array
  const thread = threads && threads.length > 0 ? threads[0] : null;

  // Cargar hilo y mensajes al montar el componente
  useEffect(() => {
    if (threadId) {
      console.log("Cargando hilo con ID:", threadId);
      fetchThreadById(threadId);
      loadMessagesByType('thread', threadId);
      setMessageContext(null, threadId, null); // Configurar contexto para nuevos mensajes
    }
  }, [threadId]);

  // Hook de grupo
  const { selectedGroup, groupLoading, groupError } = useGroup(thread?.groupId);

  // Conectar al WebSocket y suscribirse al topic de mensajes del hilo
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        // Conectar al WebSocket si no está conectado
        if (!websocketService.isConnected()) {
          await websocketService.connect(
            () => console.log('✅ WebSocket conectado en ThreadDetailView'),
            (error) => console.error('❌ Error WebSocket en ThreadDetailView:', error)
          );
        }

        // Desuscribirse si ya había una suscripción
        if (wsSubscriptionId) {
          websocketService.unsubscribe(wsSubscriptionId);
        }

        // Suscribirse al topic de mensajes del hilo
        const subscriptionId = websocketService.subscribe(
          `/topic/message/thread/${threadId}`,
          (message) => {
            console.log('📨 Mensaje recibido por WebSocket:', message);
            // Recargar mensajes cuando se recibe uno nuevo
            loadMessagesByType('thread', threadId);
          }
        );

        setWsSubscriptionId(subscriptionId);
        setWsConnected(true);
      } catch (error) {
        console.error('Error al conectar WebSocket:', error);
        setWsConnected(false);
      }
    };

    if (threadId) {
      connectWebSocket();
    }

    return () => {
      if (wsSubscriptionId) {
        websocketService.unsubscribe(wsSubscriptionId);
      }
    };
  }, [threadId]);

  // Handlers para mensajes
  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;

    try {
      // Enviar mensaje a través de WebSocket
      websocketService.send(`/app/message/thread/${threadId}`, {
        content: content.trim(),
        threadId: parseInt(threadId),
        postId: null,
        groupId: null,
        messageId: null,
        creationDate: null
      });

      return true;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return false;
    }
  };

  // Handlers para acciones del hilo
  const handleEditClick = () => {
    if (thread && setFormDataFromThread) {
      setFormDataFromThread(thread);
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const result = await handleUpdateThread(threadId, e);
      if (result) {
        setIsEditModalOpen(false);
        resetForm();
        await fetchThreadById(threadId);
      }
    } catch (error) {
      console.error("Error al actualizar hilo:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await handleDeleteThread(threadId);
      if (success) {
        setIsDeleteDialogOpen(false);
        navigate(-1);
      }
    } catch (error) {
      console.error("Error al eliminar hilo:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  const [showPostModal, setShowPostModal] = useState(false);

  // Handler para abrir el modal de posts
  const handleAttachmentClick = () => {
    setShowPostModal(true);
  };

  // Handler para cuando se crea un post
  const handlePostCreated = (newPost) => {
    setShowPostModal(false);

    // Asegurarnos de que el post tenga toda la información necesaria
    const enrichedPost = {
      ...newPost,
      threadId: parseInt(threadId),
      id: newPost.id || newPost.post_id || Date.now(),
      postDate: newPost.postDate || newPost.creation_date || new Date().toISOString()
    };

    // Actualizar la vista inmediatamente (optimistic update)
    if (threadContentListRef.current) {
      threadContentListRef.current.updatePostsLocally(enrichedPost);
    }

    // Recargar en segundo plano para asegurar sincronización
    loadMessagesByType('thread', threadId);
  };

  // Handler para eliminar post
  const handleDeletePost = async (postId) => {
    try {
      await communityService.deletePost(postId);
      // Recargar mensajes después de eliminar
      loadMessagesByType('thread', threadId);
      // Forzar la recarga de posts
      handleRefreshContent();
    } catch (error) {
      console.error('Error al eliminar post:', error);
    }
  };

  // Handler para refrescar el contenido
  const handleRefreshContent = async () => {
    await loadMessagesByType('thread', threadId);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-gray-600">Cargando hilo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <div className="text-red-500 mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">Error al cargar el hilo</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button variant="primary" size="sm" onClick={() => fetchThreadById(threadId)}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-center">
          <div className="text-yellow-500 mr-3">📝</div>
          <div>
            <h3 className="text-yellow-800 font-medium">Hilo no encontrado</h3>
            <p className="text-yellow-700 text-sm mt-1">
              El hilo solicitado no existe o ha sido eliminado.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="h-screen flex flex-col">
        {/* Header con información del grupo y título - Más compacto */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mr-2">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 text-gray-600">
              <Hash className="w-5 h-5" />
              <span className="font-medium">
                {selectedGroup?.name || thread.groupName || "Grupo desconocido"}
              </span>
              <ChevronRightIcon className="w-5 h-5" />
              <h1 className="font-bold text-gray-900">
                {thread.title || "Título del hilo no disponible"}
              </h1>
            </div>
          </div>
        </div>

        {/* Contenedor principal con scroll */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full max-w-5xl mx-auto px-4 flex flex-col">
            {/* Tarjeta del hilo - Más compacta */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 my-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <time>
                      {new Date(thread.creation_date || thread.creationDate || thread.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>
                  <p className="text-gray-700 text-sm">{thread.content}</p>
                </div>

                {/* Acciones de administración */}
                {(canUpdateThread(thread) || canDeleteThread(thread)) && (
                  <div className="flex gap-2 flex-shrink-0">
                    {canUpdateThread(thread) && (
                      <Button variant="ghost" size="sm" onClick={handleEditClick}>
                        Editar
                      </Button>
                    )}
                    {canDeleteThread(thread) && (
                      <Button variant="ghost" size="sm" onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600 hover:text-red-700">
                        Eliminar
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sección de mensajes - Ahora con más espacio */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-0">
              {/* Lista de mensajes - Área scrolleable */}
              <div className="flex-1 overflow-y-auto p-4">
                <ThreadContentList
                  ref={threadContentListRef}
                  threadId={parseInt(threadId)}
                  messages={getMessagesByType('thread', parseInt(threadId))}
                  isLoading={messagesLoading}
                  error={messagesError}
                  onDeleteMessage={handleDeleteMessage}
                  onDeletePost={handleDeletePost}
                  onRefresh={handleRefreshContent}
                />
              </div>

              {/* Formulario para enviar mensaje - Fijo en la parte inferior */}
              <div className="border-t border-gray-200">
                <MessageForm
                  onSendMessage={handleSendMessage}
                  isLoading={false}
                  placeholder="Escribe un mensaje en este hilo..."
                  disabled={!wsConnected}
                  showAttachment={true}
                  onAttachmentClick={handleAttachmentClick}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modales */}
      {isEditModalOpen && (
        <ThreadEditModal
          isOpen={isEditModalOpen}
          isUpdating={isUpdating}
          formData={formData}
          formErrors={formErrors}
          handleChange={handleChange}
          handleSubmit={handleUpdateSubmit}
          handleCancel={() => setIsEditModalOpen(false)}
        />
      )}

      {isDeleteDialogOpen && (
        <ThreadDeleteDialog
          isOpen={isDeleteDialogOpen}
          loading={isDeleting}
          threadTitle={thread?.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      )}

      {/* Modal para crear post */}
      {showPostModal && (
        <PostFormModal
          onClose={() => setShowPostModal(false)}
          onPostCreated={handlePostCreated}
          context={{
            type: 'thread',
            id: parseInt(threadId),
            name: thread.title
          }}
        />
      )}
    </>
  );
};
