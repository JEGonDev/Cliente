import React, { useState, useEffect } from "react";
import { usePost } from "../hooks/usePost";
import { communityService } from "../services/communityService";
import PropTypes from "prop-types";

/**
 * Modal para crear/editar publicaciones adaptado a diferentes contextos
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

  // Estados locales
  const [groups, setGroups] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

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
      // Aquí se cargarían los datos del post a editar, manteniendo el contexto
    }
  }, [postToEdit]);

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

  // Manejador personalizado para archivos con vista previa
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Definimos los tipos permitidos
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/mkv', 'video/x-matroska'];

    // Determinamos el tamaño máximo según el tipo
    let maxSize;
    let typeLabel;
    if (validImageTypes.includes(file.type)) {
      maxSize = 10 * 1024 * 1024;    // 10 MB
      typeLabel = 'imagen';
    } else if (validVideoTypes.includes(file.type)) {
      maxSize = 1024 * 1024 * 1024;  // 1 GB
      typeLabel = 'video';
    } else {
      alert("Solo se permiten imágenes (JPG, PNG, GIF, WEBP) o vídeos (MP4, WEBM).");
      e.target.value = null;
      return;
    }

    // Comprobamos el tamaño
    if (file.size > maxSize) {
      alert(`El ${typeLabel} es demasiado grande. Tamaño máximo: ${typeLabel === 'imagen' ? '10 MB' : '1 GB'}.`);
      e.target.value = null;
      return;
    }

    // Creamos la vista previa
    const previewUrl = URL.createObjectURL(file);
    setFilePreview(previewUrl);

    // Disparamos el cambio al hook original
    const syntheticEvent = {
      target: {
        name: 'file',
        type: 'file',
        files: [file],
      },
    };
    originalHandleChange(syntheticEvent);
  };


  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

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

      // Notificar al componente padre
      if (onPostCreated) {
        onPostCreated(result);
      }

      // Si fue exitoso, cerramos después de un breve delay
      setTimeout(() => {
        onClose();
      }, 1500);
    }
  };

  // Obtener el título según el contexto
  const getContextTitle = () => {
    if (postToEdit) {
      return "Editar publicación";
    }

    switch (context.type) {
      case 'group':
        return `Publicar en grupo: ${context.name || 'Grupo'}`;
      case 'thread':
        return `Publicar en hilo: ${context.name || 'Hilo'}`;
      default:
        return "Crear nueva publicación";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {getContextTitle()}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Contexto visual (solo visible si no es general) */}
        {context.type !== 'general' && (
          <div className="mb-4 bg-gray-100 p-3 rounded-md flex items-center">
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

        {/* Mensajes de éxito/error */}
        {successMessage && (
          <div className="mb-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        {(error || formErrors.general) && (
          <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded">
            {error || formErrors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Tipo de publicación */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de publicación
            </label>
            <select
              name="postType"
              value={formData.postType}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary"
              disabled={loading}
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

          {/* Contenido */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenido
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary"
              rows="4"
              placeholder="¿Qué quieres compartir?"
              disabled={loading}
            ></textarea>
            {formErrors.content && (
              <p className="mt-1 text-sm text-red-600">{formErrors.content}</p>
            )}
          </div>

          {/* Archivo multimedia */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagen o video (opcional)
            </label>
            <input
              type="file"
              name="file"
              accept="image/*,video/*, .mkv, .webm, video/x-matroska"
              onChange={handleFileChange}
              className="w-full border rounded-md p-2 focus:ring-primary focus:border-primary"
              disabled={loading}
            />
            {formErrors.file && (
              <p className="mt-1 text-sm text-red-600">{formErrors.file}</p>
            )}

            {/* Vista previa del archivo */}
            {filePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-1">Vista previa:</p>
                <img
                  src={filePreview}
                  alt="Vista previa"
                  className="max-h-40 rounded-md"
                />
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700 flex items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
              ) : postToEdit ? "Actualizar" : "Publicar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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