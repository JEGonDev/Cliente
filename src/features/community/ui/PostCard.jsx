import { useState, useEffect, useContext } from "react";
import {
  MoreVertical,
  Calendar,
  Image,
  Film,
  Pencil,
  Trash,
} from "lucide-react";
import { usePost } from "../hooks/usePost";
import PropTypes from "prop-types";
import { profileService } from "../../profile/services/profileService";
import { AuthContext } from "../../authentication/context/AuthContext";
import { DeletePostModal } from "./DeletePostModal";
import { EditPostModal } from "./EditPostModal";
import { ReactionButton } from "./ReactionButton";
import { motion } from "framer-motion";

export const PostCard = ({ post, onRefresh, onUpdate, onDelete }) => {
  const { user, isAdmin, isModerator } = useContext(AuthContext);
  const { handleDeletePost } = usePost();

  const [showOptions, setShowOptions] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [postOwnerUsername, setPostOwnerUsername] = useState(null);
  const [mediaError, setMediaError] = useState(false);
  const [isVideo, setIsVideo] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const postId = post.id || post.post_id;
  const userId = post.userId || post.user_id;
  const postType = post.postType || post.post_type || "general";
  const postDate =
    post.postDate ||
    post.creation_date ||
    post.post_date ||
    new Date().toISOString();
  const content = post.content || "";
  const imageUrl = post.multimediaContent || post.multimedia_content;

  const isCurrentUserPost =
    user && postOwnerUsername && user.username === postOwnerUsername;
  const canManagePost = isAdmin || isModerator || isCurrentUserPost;

  useEffect(() => {
    if (imageUrl) {
      const isVideoContent =
        imageUrl.endsWith(".mkv") ||
        imageUrl.endsWith(".mp4") ||
        imageUrl.endsWith(".webm") ||
        imageUrl.includes("video") ||
        imageUrl.includes(".mkv?") ||
        imageUrl.includes(".mp4?") ||
        imageUrl.includes(".webm?");
      setIsVideo(isVideoContent);
    }
  }, [imageUrl]);

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
          const displayName =
            userData.username ||
            (userData.firstName &&
              userData.lastName &&
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

  const formattedDate = new Date(postDate).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const success = await handleDeletePost(postId);
      if (success) {
        if (onDelete) {
          onDelete(postId);
        } else if (onRefresh) {
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

  const formatPostType = (type) => {
    const types = {
      general: "General",
      question: "Pregunta",
      resource: "Recurso",
      tutorial: "Tutorial",
    };

    return types[type.toLowerCase()] || type;
  };

  const handleMediaError = (e) => {
    console.error("Error al cargar contenido multimedia:", e);
    setMediaError(true);
  };

  const handleEditSuccess = (editedPost) => {
    if (onUpdate) {
      onUpdate(editedPost);
    } else if (onRefresh) {
      onRefresh();
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-full text-sm bg-white border border-gray-100"
        style={{ minWidth: 0, maxWidth: "840px" }}
      >
        {/* Cabecera con autor, fecha y gif al extremo derecho */}
        <div className="relative h-20 sm:h-24 overflow-hidden">
          {/* Fondo gradiente verde mejorado */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#23582a] via-[#2d6b34] to-[#3a8741] opacity-95" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPgo=')] opacity-30" />

          {/* Cabecera */}
          <div className="relative z-10 h-full flex items-center justify-between px-4 sm:px-6">
            {/* Izquierda: avatar, nombre, fecha */}
            <div className="flex items-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white text-[#23582a] flex items-center justify-center mr-3 font-bold shadow-lg ring-4 ring-white/20 backdrop-blur-sm">
                {isLoadingUser
                  ? "..."
                  : userName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-semibold text-white text-sm sm:text-base drop-shadow-sm">
                  {isLoadingUser ? "Cargando..." : userName}
                </p>
                <div className="flex items-center text-xs text-gray-100 drop-shadow-sm">
                  <Calendar className="w-3 h-3 mr-1 opacity-80" />
                  <span className="hidden sm:inline">{formattedDate}</span>
                  <span className="sm:hidden">
                    {new Date(postDate).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Derecha: menú de opciones y gif */}
            <div className="flex items-center gap-2 sm:gap-3">
              {canManagePost && (
                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm"
                    onClick={() => setShowOptions(!showOptions)}
                  >
                    <MoreVertical className="w-5 h-5 text-white drop-shadow-sm" />
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
                        <Pencil className="w-2 h-2 mr-2" />
                        Editar publicación
                      </button>
                      <button
                        onClick={() => {
                          setShowOptions(false);
                          setShowDeleteModal(true);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors duration-200 rounded-b-lg"
                      >
                        <Trash className="w-4 h-4 mr-3 text-red-500" />
                        Eliminar publicación
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="relative">
                <img
                  src="/animacionCard.gif"
                  alt="Decoración"
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain rounded-lg bg-white/90 p-1 shadow-lg ring-2 ring-white/20 backdrop-blur-sm"
                  style={{ minWidth: "40px", minHeight: "40px" }}
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de la publicación */}
        <div className="p-4 sm:p-6">
          {/* Tipo de publicación */}
          <div className="inline-flex items-center bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full mb-3 shadow-sm border border-gray-200">
            {formatPostType(postType)}
          </div>

          <p className="text-gray-800 mb-4 whitespace-pre-line leading-relaxed text-sm sm:text-base">
            {content}
          </p>

          {/* Contenido multimedia */}
          {imageUrl && !mediaError && (
            <div className="mb-4 rounded-xl overflow-hidden flex justify-center">
              {isVideo ? (
                <div className="relative w-full max-w-xl">
                  <video
                    controls
                    className="w-full h-72 sm:h-80 object-cover rounded-xl"
                    onError={handleMediaError}
                  >
                    <source src={imageUrl} type="video/mp4" />
                    <source src={imageUrl} type="video/webm" />
                    <source src={imageUrl} type="video/x-matroska" />
                    Tu navegador no soporta la etiqueta de video.
                  </video>
                  <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 text-xs rounded-md backdrop-blur-sm">
                    <Film className="w-4 h-4 inline-block mr-1" />
                    Video
                  </div>
                </div>
              ) : (
                <div className="relative w-full max-w-xl">
                  <img
                    src={imageUrl}
                    alt="Contenido multimedia"
                    className="w-full h-72 sm:h-80 object-cover rounded-xl"
                    onError={handleMediaError}
                    style={{ objectFit: "cover" }}
                  />
                  <div className="absolute top-3 left-3 bg-black/70 text-white px-2 py-1 text-xs rounded-md backdrop-blur-sm">
                    <Image className="w-4 h-4 inline-block mr-1" />
                    Imagen
                  </div>
                </div>
              )}
            </div>
          )}

          {imageUrl && mediaError && (
            <div className="mb-4 rounded-xl overflow-hidden">
              <div
                className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 p-6 text-center text-gray-600 rounded-xl flex flex-col items-center justify-center shadow-inner"
                style={{ minHeight: "120px" }}
              >
                {isVideo ? (
                  <>
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                      <Film className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-medium mb-2">No se pudo cargar el video</p>
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#23582a] text-sm font-medium hover:underline transition-colors duration-200"
                    >
                      Abrir video en nueva pestaña
                    </a>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                      <Image className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="font-medium mb-2">No se pudo cargar la imagen</p>
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#23582a] text-sm font-medium hover:underline transition-colors duration-200"
                    >
                      Abrir imagen en nueva pestaña
                    </a>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Barra de reacciones */}
          <div className="border-t border-gray-100 pt-4 mt-4">
            <ReactionButton postId={postId} size="md" />
          </div>
        </div>
      </motion.div>

      {/* Modales fuera del div principal */}
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
    </>
  );
};

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onRefresh: PropTypes.func,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};