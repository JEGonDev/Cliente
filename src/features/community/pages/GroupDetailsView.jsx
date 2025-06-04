import { useMemo, useState, useRef, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaHashtag, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { ThreadList } from "../ui/ThreadList";
import { useGroup } from "../hooks/useGroup";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { GroupEditModal } from "../ui/GroupEditModal";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";
import { MessageList } from "../ui/MessageList";
import { MessageForm } from "../ui/MessageForm";
import { useCompleteMessage } from "../hooks/useCompleteMessage";
import { websocketService } from "../../../common/services/webSocketService";
import { PostFormModal } from "../ui/PostFormModal";
import { GroupContentList } from "../ui/GroupContentList";
import { communityService } from "../services/communityService";
import { AuthContext } from "../../authentication/context/AuthContext";

export const GroupDetailsView = () => {
  const { groupId } = useParams();
  const reloadThreadsRef = useRef(null);
  const navigate = useNavigate();
  const groupContentListRef = useRef(null);

  // Estados locales para modales
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [activeTab, setActiveTab] = useState("messages"); // "messages" o "threads"
  const [showPostModal, setShowPostModal] = useState(false);

  // Estado para WebSocket
  const [wsConnected, setWsConnected] = useState(false);
  const [wsSubscriptionId, setWsSubscriptionId] = useState(null);

  // Hooks de permisos
  const { isAdmin, canModerateContent } = useAuthRoles();
  const { isModerator } = useContext(AuthContext);

  // Hook de grupo
  const {
    selectedGroup: group,
    groupLoading,
    groupError,
    formData,
    formErrors,
    successMessage,
    isEditing,
    updateLoading,
    handleChange,
    handleJoinGroup,
    handleDeleteGroup,
    handleUpdateGroup,
    loadGroupForEdit,
    cancelEdit,
    clearMessages,
    fetchGroups,
  } = useGroup(groupId);

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

  // Conectar al WebSocket y suscribirse al topic de mensajes del grupo
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        // Conectar al WebSocket si no está conectado
        if (!websocketService.isConnected()) {
          await websocketService.connect(
            () => console.log('✅ WebSocket conectado en GroupDetailsView'),
            (error) => console.error('❌ Error WebSocket en GroupDetailsView:', error)
          );
        }

        // Desuscribirse si ya había una suscripción
        if (wsSubscriptionId) {
          websocketService.unsubscribe(wsSubscriptionId);
        }

        // Suscribirse al topic de mensajes del grupo
        const subscriptionId = websocketService.subscribe(
          `/topic/message/group/${groupId}`,
          (message) => {
            console.log('📨 Mensaje recibido por WebSocket:', message);
            // Recargar mensajes cuando se recibe uno nuevo
            loadMessagesByType('group', groupId);
          }
        );

        setWsSubscriptionId(subscriptionId);
        setWsConnected(true);
      } catch (error) {
        console.error('Error al conectar WebSocket:', error);
        setWsConnected(false);
      }
    };

    if (groupId) {
      connectWebSocket();
      // Cargar mensajes iniciales
      loadMessagesByType('group', groupId);
      setMessageContext(null, null, groupId);
    }

    return () => {
      if (wsSubscriptionId) {
        websocketService.unsubscribe(wsSubscriptionId);
      }
    };
  }, [groupId]);

  // Handler para enviar mensajes
  const handleSendMessage = async (content) => {
    if (!content?.trim()) return;

    try {
      // Enviar mensaje a través de WebSocket
      websocketService.send(`/app/message/group/${groupId}`, {
        content: content.trim(),
        threadId: null,
        postId: null,
        groupId: parseInt(groupId),
        messageId: null,
        creationDate: null
      });

      return true;
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      return false;
    }
  };

  // Memo para evitar renders innecesarios
  const stableGroupId = useMemo(() => group?.id, [group]);

  // Handler para editar grupo
  const handleEditClick = () => {
    if (group) {
      loadGroupForEdit(group);
      setShowEditModal(true);
      clearMessages();
    }
  };

  const handleEditSubmit = async () => {
    const result = await handleUpdateGroup(group.id, formData);
    if (result) {
      await fetchGroups();
      setShowEditModal(false);
    }
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    cancelEdit();
    clearMessages();
  };

  // Handler para eliminar
  const handleConfirmDelete = async () => {
    const success = await handleDeleteGroup(group.id);
    if (success) {
      navigate('/groups');
      setShowDeleteConfirmation(false);
    }
  };

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
      groupId: parseInt(groupId),
      id: newPost.id || newPost.post_id || Date.now(),
      postDate: newPost.postDate || newPost.creation_date || new Date().toISOString()
    };

    // Actualizar la vista inmediatamente (optimistic update)
    if (groupContentListRef.current) {
      groupContentListRef.current.updatePostsLocally(enrichedPost);
    }

    // Recargar en segundo plano para asegurar sincronización
    loadMessagesByType('group', groupId);
  };

  // Handler para eliminar post
  const handleDeletePost = async (postId) => {
    try {
      await communityService.deletePost(postId);
      // Recargar posts después de eliminar
      loadMessagesByType('group', groupId);
    } catch (error) {
      console.error('Error al eliminar post:', error);
    }
  };

  // Handler para refrescar el contenido
  const handleRefreshContent = async () => {
    await loadMessagesByType('group', groupId);
  };

  // Estados de carga y error
  if (groupLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-500">
          Cargando detalles del grupo...
        </span>
      </div>
    );
  }

  if (groupError) {
    return (
      <div className="max-w-5xl mx-auto my-8 p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 font-medium">Error al cargar el grupo</p>
          <p className="text-red-500 text-sm mt-1">{groupError}</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-5xl mx-auto my-8 p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">No se encontró el grupo solicitado.</p>
        </div>
      </div>
    );
  }

  // Permisos
  const canEditGroup = isAdmin || canModerateContent();

  return (
    <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
      {/* Header con icono numeral y nombre */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-gray-300 rounded px-2 py-2 min-h-[40px] flex-1">
          <FaHashtag className="text-3xl text-gray-700" />
          <h1 className="text-3xl font-bold">{group.name}</h1>
        </div>
        {/* Botones de administración */}
        {canEditGroup && (
          <div className="flex gap-2 ml-4">
            <button
              className="bg-blue text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              onClick={handleEditClick}
              title="Editar grupo"
            >
              <FaEdit />
              <span className="hidden sm:inline">Editar</span>
            </button>

            <button
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              onClick={() => setShowDeleteConfirmation(true)}
              title="Eliminar grupo"
            >
              <FaTrash />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        )}
      </div>

      {/* Mensaje de bienvenida */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold">
          ¡Te damos la bienvenida a{" "}
          <span className="text-primary"># {group.name}!</span>
        </h2>
        <p className="text-lg font-bold mt-2">
          Un espacio para aprender, compartir experiencias sobre hidroponía.
        </p>
      </div>

      {/* Descripción y fecha */}
      <div className="mb-6">
        <div className="text-gray-700 mb-1">
          <strong>Descripción:</strong> {group.description || "Sin descripción"}
        </div>
        <div className="text-gray-500 text-sm">
          <strong>Fecha de creación:</strong>{" "}
          {group.creationDate
            ? new Date(group.creationDate).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
            : "Sin fecha"}
        </div>
      </div>

      {/* Mensajes de estado */}
      {!showEditModal && (successMessage || formErrors?.general) && (
        <div className="mb-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
              <p className="text-green-600 font-medium">{successMessage}</p>
            </div>
          )}
          {formErrors?.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 font-medium">{formErrors.general}</p>
            </div>
          )}
        </div>
      )}

      {/* Botones de acción para usuarios */}
      <div className="mb-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
        <button
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
          onClick={() => handleJoinGroup(group.id)}
        >
          Unirse al grupo
        </button>

        <button
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={() => setShowThreadModal(true)}
        >
          <FaPlus />
          <span>Crear hilo</span>
        </button>
      </div>

      {/* Navegación por pestañas */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("messages")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "messages"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center space-x-2">
              <FaHashtag className="w-4 h-4" />
              <span>Mensajes</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab("threads")}
            className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "threads"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
          >
            <div className="flex items-center space-x-2">
              <FaHashtag className="w-4 h-4" />
              <span>Hilos de Discusión</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Contenido de las pestañas */}
      <div className="space-y-6">
        {activeTab === "messages" ? (
          // Sección de Mensajes y Posts
          <div className="flex flex-col h-[calc(100vh-400px)] max-h-[600px]">
            {/* Lista unificada de mensajes y posts - Área scrolleable */}
            <div className="flex-1 overflow-y-auto p-4">
              <GroupContentList
                ref={groupContentListRef}
                groupId={parseInt(groupId)}
                messages={getMessagesByType('group', parseInt(groupId))}
                isLoading={messagesLoading}
                error={messagesError}
                onDeleteMessage={handleDeleteMessage}
                onDeletePost={handleDeletePost}
                onRefresh={handleRefreshContent}
              />
            </div>

            {/* Formulario para enviar mensaje - Fijo en la parte inferior */}
            <div className="flex-shrink-0 border-t border-gray-200 pt-4">
              <MessageForm
                onSendMessage={handleSendMessage}
                isLoading={false}
                placeholder="Comparte algo con el grupo..."
                disabled={!wsConnected}
                showAttachment={true}
                onAttachmentClick={handleAttachmentClick}
              />
            </div>
          </div>
        ) : (
          // Sección de Hilos
          <div>
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <FaHashtag className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-blue-900">
                    Hilos de Discusión
                  </h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Los hilos son conversaciones organizadas sobre temas específicos.
                    Crea un hilo para iniciar una discusión profunda sobre un tema particular.
                  </p>
                </div>
              </div>
            </div>

            {/* Lista de hilos */}
            <ThreadList groupId={group?.id} refetchRef={reloadThreadsRef} />
          </div>
        )}
      </div>

      {/* Modal para crear hilo */}
      {showThreadModal && (
        <ThreadFormModal
          groupId={group.id}
          onClose={() => setShowThreadModal(false)}
          onThreadCreated={() => {
            setShowThreadModal(false);
            if (reloadThreadsRef.current) {
              reloadThreadsRef.current();
            }
          }}
        />
      )}

      {/* Modal para editar grupo */}
      {showEditModal && (
        <GroupEditModal
          group={group}
          formData={formData}
          formErrors={formErrors}
          successMessage={successMessage}
          updateLoading={updateLoading}
          onInputChange={handleChange}
          onSubmit={handleEditSubmit}
          onClose={handleEditClose}
        />
      )}

      {/* Diálogo de confirmación para eliminar */}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Eliminar grupo"
          message={`¿Estás seguro de que deseas eliminar el grupo "${group.name}"? Esta acción no se puede deshacer y se eliminarán todos los hilos y mensajes asociados.`}
          confirmText="Eliminar grupo"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}

      {/* Modal para crear post */}
      {showPostModal && (
        <PostFormModal
          onClose={() => setShowPostModal(false)}
          onPostCreated={handlePostCreated}
          context={{
            type: 'group',
            id: parseInt(groupId),
            name: group.name
          }}
        />
      )}
    </div>
  );
};

export default GroupDetailsView;
