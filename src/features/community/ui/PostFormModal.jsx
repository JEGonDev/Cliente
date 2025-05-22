import React, { useState, useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { communityService } from "../services/communityService";
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';
import { Film, Image, Upload, X } from 'lucide-react';
import PropTypes from "prop-types";

/**
 * Modal para crear/editar publicaciones adaptado a diferentes contextos
 * Mantiene la misma interfaz gráfica que EditPostModal para consistencia visual
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Function} props.onPostCreated - Callback cuando se crea el post
 * @param {Object} props.postToEdit - Post a editar (opcional)
 * @param {Object} props.context - Contexto donde se crea la publicación
 * @param {string} props.context.type - Tipo de contexto ('general', 'group', 'thread')
 * @param {number} props.context.id - ID del grupo o hilo (si aplica)
 * @param {string} props.context.name - Nombre del grupo o hilo (si aplica)
 */
export const PostFormModal = ({
  onClose,
  onPostCreated,
  postToEdit,
  context = { type: 'general' }
}) => {
  // Usamos el hook personalizado para la lógica
  const {
    formData,
    setFormData,
    handleChange: originalHandleChange,
    handleCreatePost,
    handleUpdatePost,
    formErrors,
    loading,
    error,
    successMessage
  } = usePost();

  // Estados locales para manejo de grupos y archivos
  const [groups, setGroups] = useState([]);
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Establecer el contexto inicial al montar el componente
  useEffect(() => {
    // Si estamos en un grupo, asociar automáticamente con ese grupo
    if (context.type === 'group' && context.id) {
      setFormData(prev => ({
        ...prev,
        groupId: context.id
      }));
    }

    // Si estamos en un hilo, asociar automáticamente con ese hilo
    if (context.type === 'thread' && context.id) {
      setFormData(prev => ({
        ...prev,
        threadId: context.id
      }));
    }
  }, [context, setFormData]);

  // Solo cargar los grupos si estamos en el contexto general y mostraremos el selector
  useEffect(() => {
    if (context.type === 'general') {
      const fetchGroups = async () => {
        try {
          const groupsData = await communityService.getAllGroups();
          // Manejar diferentes formatos de respuesta
          const groupsList = Array.isArray(groupsData)
            ? groupsData
            : Array.isArray(groupsData?.data)
              ? groupsData.data
              : [];

          setGroups(groupsList);
        } catch (error) {
          console.error("Error al cargar grupos:", error);
          setGroups([]);
        }
      };

      fetchGroups();
    }
  }, [context.type]);

  // Si hay un post para editar, cargar sus datos
  useEffect(() => {
    if (postToEdit) {
      // Cargar los datos del post a editar, manteniendo el contexto
      setFormData({
        postType: postToEdit.postType || postToEdit.post_type || 'general',
        content: postToEdit.content || ''
      });
    }
  }, [postToEdit, setFormData]);

  // Limpiar recursos al desmontar el componente
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Sobreescribir el manejador de cambios para mantener el contexto
  const handleChange = (e) => {
    // Si estamos en un contexto específico y el campo es relevante al contexto,
    // no permitimos cambiarlo
    if ((context.type === 'group' && e.target.name === 'groupId') ||
      (context.type === 'thread' && e.target.name === 'threadId')) {
      return; // No permitir cambiar estos campos
    }

    // Para todos los demás campos, usar el manejador original
    originalHandleChange(e);
  };

  // Manejador para archivos con vista previa
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // Limpiar preview anterior si existe
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }

    // Verificar si el archivo es un video
    const isVideoFile =
      selectedFile.type.startsWith('video/') ||
      selectedFile.name.endsWith('.mkv') ||
      selectedFile.name.endsWith('.mp4') ||
      selectedFile.name.endsWith('.webm');

    // Establecer estados del archivo
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
    setIsVideo(isVideoFile);

    // Disparar el cambio al hook original
    const syntheticEvent = {
      target: {
        name: 'file',
        type: 'file',
        files: [selectedFile],
      },
    };
    originalHandleChange(syntheticEvent);
  };

  // Función para eliminar el archivo seleccionado
  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setIsVideo(false);

    // Limpiar el input de archivo
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Realizar validaciones adicionales según el contexto

      let result;
      if (postToEdit) {
        // Si estamos editando un post
        result = await handleUpdatePost(postToEdit.id, e);
      } else {
        // Si estamos creando un post nuevo
        result = await handleCreatePost(e);
      }

      // Si se creó/editó correctamente
      if (result) {
        // Limpiar la vista previa
        if (filePreview) {
          URL.revokeObjectURL(filePreview);
        }

        // Preparar el post para actualización optimista
        const postData = result?.data || result;

        // Asegurarnos de que el post tenga toda la información necesaria para la UI
        if (postData) {
          // Si el backend no devuelve un post completo, enriquecemos la respuesta
          if (!postData.id && !postData.post_id && postData.postId) {
            postData.id = postData.postId; // Normalizar ID
          }

          // Asegurarnos de que tenga fecha para ordenamiento
          if (!postData.postDate && !postData.creation_date && !postData.post_date) {
            postData.postDate = new Date().toISOString();
          }

          // Notificar al componente padre con el post enriquecido
          if (onPostCreated) {
            onPostCreated(postData);
          }
        } else {
          // Fallback si no tenemos datos del post
          if (onPostCreated) {
            onPostCreated({
              id: Date.now(), // ID temporal
              postType: formData.postType,
              content: formData.content,
              postDate: new Date().toISOString(),
              multimediaContent: filePreview
            });
          }
        }

        // Cerrar el modal
        onClose();
      }
    } catch (err) {
      console.error('Error al procesar publicación:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener el título según el contexto
  const getContextTitle = () => {
    if (postToEdit) {
      return "Editar Publicación";
    }

    switch (context.type) {
      case 'group':
        return `Nueva Publicación en ${context.name || 'Grupo'}`;
      case 'thread':
        return `Nueva Publicación en ${context.name || 'Hilo'}`;
      default:
        return "Crear Nueva Publicación";
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={getContextTitle()}
      size="md"
    >
      {/* Mensajes de estado - éxito y error */}
      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 mb-4 rounded">
          {successMessage}
        </div>
      )}

      {(error || formErrors.general) && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          {error || formErrors.general}
        </div>
      )}

      {/* Contexto visual (solo visible si no es general) */}
      {context.type !== 'general' && (
        <div className="mb-4 bg-blue-50 p-3 rounded-md flex items-center">
          <div className="w-8 h-8 bg-primary text-white flex items-center justify-center rounded-full mr-2">
            {context.type === 'group' ? 'G' : 'T'}
          </div>
          <div>
            <p className="text-sm font-medium">{context.name || (context.type === 'group' ? 'Grupo' : 'Hilo')}</p>
            <p className="text-xs text-gray-500">
              Tu publicación será visible para todos los miembros de este {context.type === 'group' ? 'grupo' : 'hilo'}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Campo: Tipo de publicación */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de publicación
          </label>
          <select
            name="postType"
            value={formData.postType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            disabled={isSubmitting}
          >
            <option value="general">General</option>
            <option value="question">Pregunta</option>
            <option value="resource">Recurso</option>
            <option value="tutorial">Tutorial</option>
          </select>
          {formErrors.postType && (
            <p className="mt-1 text-sm text-red-600">{formErrors.postType}</p>
          )}
        </div>

        {/* Campo: Contenido de la publicación */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenido
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            rows="4"
            placeholder="¿Qué quieres compartir?"
            disabled={isSubmitting}
            required
          ></textarea>
          {formErrors.content && (
            <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
          )}
        </div>

        {/* Sección de contenido multimedia */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido multimedia
          </label>

          {/* Input para nuevo archivo si no hay uno seleccionado */}
          <div className="space-y-3">
            {!file ? (
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                <label className="cursor-pointer flex flex-col items-center">
                  <Upload className="mb-2 text-gray-400" size={24} />
                  <span className="text-sm text-gray-600 mb-1">
                    Haz clic para subir una imagen o video
                  </span>
                  <span className="text-xs text-gray-500">
                    Formatos: JPG, PNG, GIF, MP4, MKV, WEBM
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,video/*,.mkv,.webm"
                    disabled={isSubmitting}
                  />
                </label>
              </div>
            ) : (
              /* Mostrar archivo seleccionado con vista previa */
              <div className="relative border border-gray-200 rounded-md p-3 bg-gray-50">
                <div className="flex items-center">
                  {/* Icono según tipo de archivo */}
                  {isVideo ? (
                    <Film className="text-gray-500 mr-2" size={18} />
                  ) : (
                    <Image className="text-gray-500 mr-2" size={18} />
                  )}
                  <span className="text-sm text-gray-600 truncate flex-1">
                    {file.name}
                  </span>
                  {/* Botón para eliminar archivo */}
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="text-gray-500 hover:text-red-500"
                    disabled={isSubmitting}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Vista previa del archivo seleccionado */}
                {filePreview && (
                  <div className="mt-2 border rounded overflow-hidden max-h-40">
                    {isVideo ? (
                      <video
                        src={filePreview}
                        controls
                        className="w-full h-40 object-cover"
                      />
                    ) : (
                      <img
                        src={filePreview}
                        alt="Vista previa"
                        className="w-full h-40 object-cover"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Texto informativo sobre el estado del archivo */}
            <p className="text-xs text-gray-500 italic">
              {!file ?
                "No se enviará ningún contenido multimedia con esta publicación." :
                "Se incluirá este archivo con la publicación."
              }
            </p>
          </div>

          {/* Mostrar errores de archivo si existen */}
          {formErrors.file && (
            <p className="mt-1 text-sm text-red-600">{formErrors.file}</p>
          )}
        </div>

        {/* Campo: Selector de grupo (solo para contexto general) */}
        {context.type === 'general' && groups.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Publicar en grupo (opcional)
            </label>
            <select
              name="groupId"
              value={formData.groupId || ""}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
              disabled={isSubmitting}
            >
              <option value="">Publicación general</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Botones de acción del formulario */}
        <div className="flex justify-end gap-2">
          <Button
            variant="white"
            onClick={onClose}
            disabled={isSubmitting}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Procesando...' : postToEdit ? 'Guardar cambios' : 'Publicar'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Validación de propiedades con PropTypes
PostFormModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onPostCreated: PropTypes.func,
  postToEdit: PropTypes.object,
  context: PropTypes.shape({
    type: PropTypes.oneOf(['general', 'group', 'thread']),
    id: PropTypes.number,
    name: PropTypes.string
  })
};

export default PostFormModal;