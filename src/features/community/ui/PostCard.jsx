import { useState, useEffect, useContext } from "react";
import { MoreVertical, Calendar, Image, Film, Pencil, Trash } from "lucide-react";
import { usePost } from "../hooks/usePost";
import PropTypes from "prop-types";
import { profileService } from "../../profile/services/profileService";
import { AuthContext } from "../../authentication/context/AuthContext";
import { DeletePostModal } from "./DeletePostModal";
import { EditPostModal } from "./EditPostModal";
import { ReactionButton } from "./ReactionButton";

/**
 * Componente para mostrar una publicación en forma de tarjeta con reacciones integradas
 */
export const PostCard = ({ post, onRefresh, onUpdate, onDelete }) => {
  // Contextos
  const { user, isAdmin, isModerator } = useContext(AuthContext);

  // Hooks
  const { handleDeletePost } = usePost();

  // Estados UI
  const [showOptions, setShowOptions] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [postOwnerUsername, setPostOwnerUsername] = useState(null);
  const [mediaError, setMediaError] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  // Estados para modales
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Identificadores normalizados
  const postId = post.id || post.post_id;
  const userId = post.userId || post.user_id;
  const postType = post.postType || post.post_type || "general";
  const postDate = post.postDate || post.creation_date || post.post_date || new Date().toISOString();
  const content = post.content || "";
  const imageUrl = post.multimediaContent || post.multimedia_content;

  // Verificación de permisos
  const isCurrentUserPost = user && postOwnerUsername && (
    user.username === postOwnerUsername
  );
  const canManagePost = isAdmin || isModerator || isCurrentUserPost;

  // Determinar si el contenido multimedia es un video
  useEffect(() => {
    if (imageUrl) {
      const isVideoContent =
        imageUrl.endsWith('.mkv') ||
        imageUrl.endsWith('.mp4') ||
        imageUrl.endsWith('.webm') ||
        imageUrl.includes('video') ||
        imageUrl.includes('.mkv?') ||
        imageUrl.includes('.mp4?') ||
        imageUrl.includes('.webm?');

      setIsVideo(isVideoContent);
    }
  }, [imageUrl]);

  // Cargar información del usuario
  useEffect(() => {
    const fetchUserName = async () => {
      if (!userId) {
        setUserName("Usuario desconocido");
        setIsLoadingUser(false);
        return;
      }

      try {
        const userData = await profileService.getUserById(userId);

        if (userData) {
          const displayName = userData.username ||
            (userData.firstName && userData.lastName &&
              `${userData.firstName} ${userData.lastName}`) ||
            userData.email;

          if (displayName) {
            setUserName(displayName);
          } else {
            setUserName(`Usuario #${userId}`);
          }

          setPostOwnerUsername(userData.username || userData.userName);
        } else {
          setUserName(`Usuario #${userId}`);
        }
      } catch (error) {
        console.error("Error al cargar información del usuario:", error);
        setUserName(`Usuario #${userId}`);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserName();
  }, [userId]);

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
    setIsDeleting(true);
    try {
      const success = await handleDeletePost(postId);
      if (success) {
        // Primero usamos las actualizaciones optimistas si están disponibles
        if (onDelete) {
          onDelete(postId);
        }
        // Como fallback, usamos el método anterior de actualización
        else if (onRefresh) {
          onRefresh();
        }
      }
    } catch (error) {
      console.error("Error al eliminar publicación:", error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  // Formatear tipo de publicación
  const formatPostType = (type) => {
    const types = {
      'general': 'General',
      'question': 'Pregunta',
      'resource': 'Recurso',
      'tutorial': 'Tutorial'
    };

    return types[type.toLowerCase()] || type;
  };

  // Manejador de error para contenido multimedia
  const handleMediaError = (e) => {
    console.error("Error al cargar contenido multimedia:", e);
    setMediaError(true);
  };

  // Manejar edición exitosa
  const handleEditSuccess = (editedPost) => {
    // Primero usamos las actualizaciones optimistas si están disponibles
    if (onUpdate) {
      onUpdate(editedPost);
    }
    // Como fallback, usamos el método anterior de actualización
    else if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
      {/* Cabecera con autor y fecha */}
      <div className="p-4 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center">
          {/* Avatar generado con iniciales */}
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mr-3">
            {isLoadingUser ? "..." : userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-gray-800">{isLoadingUser ? "Cargando..." : userName}</p>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Menú de opciones */}
        {canManagePost && (
          <div className="relative">
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <button
                  onClick={() => {
                    setShowOptions(false);
                    setShowEditModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar publicación
                </button>

                <button
                  onClick={() => {
                    setShowOptions(false);
                    setShowDeleteModal(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Eliminar publicación
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido de la publicación */}
      <div className="p-4">
        {/* Tipo de publicación */}
        <div className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mb-2">
          {formatPostType(postType)}
        </div>

        <p className="text-gray-800 mb-4 whitespace-pre-line">{content}</p>

        {/* Contenido multimedia */}
        {imageUrl && !mediaError && (
          <div className="mb-4 rounded-md overflow-hidden border border-gray-200">
            {isVideo ? (
              <div className="relative">
                <video
                  controls
                  className="w-full max-h-96"
                  onError={handleMediaError}
                >
                  <source src={imageUrl} type="video/mp4" />
                  <source src={imageUrl} type="video/webm" />
                  <source src={imageUrl} type="video/x-matroska" />
                  Tu navegador no soporta la etiqueta de video.
                </video>
                <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white px-2 py-1 text-xs rounded m-2">
                  <Film className="w-4 h-4 inline-block mr-1" />
                  Video
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imageUrl}
                  alt="Contenido multimedia"
                  className="w-full object-contain max-h-96"
                  onError={handleMediaError}
                />
                <div className="absolute top-0 left-0 bg-black bg-opacity-60 text-white px-2 py-1 text-xs rounded m-2">
                  <Image className="w-4 h-4 inline-block mr-1" />
                  Imagen
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mensaje de error para contenido multimedia */}
        {imageUrl && mediaError && (
          <div className="mb-4 rounded-md overflow-hidden">
            <div className="bg-gray-100 border border-gray-200 p-4 text-center text-gray-600 rounded flex flex-col items-center justify-center" style={{ minHeight: "120px" }}>
              {isVideo ? (
                <>
                  <Film className="w-8 h-8 mb-2 text-gray-400" />
                  <p>No se pudo cargar el video</p>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm mt-2 hover:underline"
                  >
                    Abrir video en nueva pestaña
                  </a>
                </>
              ) : (
                <>
                  <Image className="w-8 h-8 mb-2 text-gray-400" />
                  <p>No se pudo cargar la imagen</p>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm mt-2 hover:underline"
                  >
                    Abrir imagen en nueva pestaña
                  </a>
                </>
              )}
            </div>
          </div>
        )}

        {/* Barra de reacciones */}
        <div className="border-t border-gray-100 pt-3 mt-4">
          {/* Botón de reacción */}
          <ReactionButton postId={postId} size="md" />
        </div>
      </div>

      {/* Modales */}
      <DeletePostModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        post={post}
        isDeleting={isDeleting}
      />

      <EditPostModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleEditSuccess}
        post={post}
      />
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onRefresh: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func
};