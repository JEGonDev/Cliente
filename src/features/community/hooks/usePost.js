import { useState } from 'react';
import { communityService } from '../services/communityService';

/**
 * Hook personalizado para manejar la lógica de publicaciones
 * 
 * Este hook encapsula:
 * - Estados del formulario de publicación
 * - Estado de UI (errores, mensajes de éxito, carga)
 * - Handlers para operaciones CRUD de publicaciones
 * 
 * @returns {Object} Propiedades y métodos para trabajar con publicaciones
 */
export const usePost = () => {
  // Estado para almacenar todas las publicaciones
  const [posts, setPosts] = useState([]);

  // Estado para la publicación seleccionada (para edición/visualización detallada)
  const [selectedPost, setSelectedPost] = useState(null);

  // Estados para el formulario
  const [formData, setFormData] = useState({
    postType: 'general',
    content: '',
    file: null,
    groupId: null,
    threadId: null
  });

  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Valida el formulario antes de enviar
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = () => {
    const errors = {};

    // Permitir si hay texto O archivo
    if (!formData.content.trim() && !formData.file) {
      errors.content = 'Debes ingresar contenido o adjuntar una imagen/video';
    }

    if (!formData.postType) {
      errors.postType = 'El tipo de publicación es obligatorio';
    }

    // Si hay un archivo, validar tamaño y tipo
    if (formData.file) {
      const fileType = formData.file.type;
      const isImage = fileType.startsWith('image/');
      const isVideo = fileType.startsWith('video/');

      if (!isImage && !isVideo) {
        errors.file = 'El archivo debe ser una imagen o video';
      } else {
        // Tamaño máximo: 10MB para imágenes, 1GB para videos
        const maxSize = isImage ? 10 * 1024 * 1024 : 1024 * 1024 * 1024;
        if (formData.file.size > maxSize) {
          errors.file = isImage
            ? 'La imagen no debe ser mayor a 10MB'
            : 'El video no debe ser mayor a 1GB';
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file' && files && files.length > 0) {
      // Si es un campo de archivo, guardar el archivo
      setFormData({
        ...formData,
        file: files[0]
      });
    } else if (name === 'groupId' || name === 'threadId') {
      // Convertir a número o null si está vacío
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : null
      });
    } else {
      // Para el resto de campos, guardar el valor normalmente
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Limpiar errores cuando el usuario cambia un campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  /**
   * Resetea el formulario a su estado inicial
   */
  const resetForm = () => {
    setFormData({
      postType: 'general',
      content: '',
      file: null,
      groupId: null,
      threadId: null
    });
    setFormErrors({});
  };

  /**
   * Carga una publicación para edición
   * @param {number} postId - ID de la publicación a editar
   */
  const loadPostForEdit = async (postId) => {
    setLoading(true);
    try {
      const post = await communityService.getPostById(postId);

      if (post) {
        setFormData({
          postType: post.postType || 'general',
          content: post.content || '',
          file: null, // No podemos cargar el archivo, solo el nuevo
          groupId: post.groupId
        });

        setSelectedPost(post);
      }
    } catch (error) {
      setError('Error al cargar la publicación para editar');
      console.error('Error al cargar post para editar:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene todas las publicaciones desde el backend
   */
  const fetchAllPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await communityService.getAllPosts();

      if (response) {
        setPosts(Array.isArray(response) ? response : []);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Error al obtener publicaciones:', err);
      setError('Error al cargar las publicaciones. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene publicaciones por ID de grupo
   * @param {number} groupId - ID del grupo
   * @returns {Promise<Array>} Lista de publicaciones
   */
  const fetchPostsByGroupId = async (groupId) => {
    setLoading(true);

    try {
      const response = await communityService.getPostsByGroup(groupId);

      if (response) {
        return Array.isArray(response) ? response : [];
      }

      return [];
    } catch (err) {
      console.error(`Error al obtener publicaciones del grupo ${groupId}:`, err);
      setError(`Error al cargar las publicaciones del grupo. Inténtalo de nuevo.`);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Crea una nueva publicación
   * @param {Event|Object} eventOrData - Evento del formulario o datos directos
   * @returns {Promise<Object|null>} La publicación creada o null si hay error
   */
  const handleCreatePost = async (eventOrData) => {
    // Si es un evento, prevenimos el comportamiento por defecto
    if (eventOrData && eventOrData.preventDefault) {
      eventOrData.preventDefault();
    }

    // Limpiar mensajes previos
    setSuccessMessage('');
    setError(null);

    // Validar el formulario
    if (!validateForm()) {
      return null;
    }

    setLoading(true);

    try {
      // Preparar los datos para enviar
      let postData;

      if (formData.file) {
        // Si hay un archivo, usar FormData
        postData = new FormData();

        // 1. Agregar postType (OBLIGATORIO)
        postData.append('postType', formData.postType);

        // 2. Agregar content (OBLIGATORIO)
        postData.append('content', formData.content);

        // 3. Agregar el archivo como 'file', NO como 'multimediaContent'
        postData.append('file', formData.file);

        // 4. Agregar groupId si existe (como Integer)
        if (formData.groupId) {
          postData.append('groupId', Number(formData.groupId));
        }

        // 5. Agregar threadId si existe (como Integer)
        if (formData.threadId) {
          postData.append('threadId', Number(formData.threadId));
        }

        // Importante: NO agregamos un campo 'multimediaContent', ese lo generará el backend
      } else {
        // Si no hay archivo, enviamos un objeto JSON
        postData = {
          postType: formData.postType,
          content: formData.content
        };

        // Agregar campos opcionales solo si tienen valor
        if (formData.groupId) {
          postData.groupId = Number(formData.groupId);
        }

        if (formData.threadId) {
          postData.threadId = Number(formData.threadId);
        }
      }

      // Mostrar en consola lo que estamos enviando (para depuración)
      console.log('Enviando datos al servidor:',
        formData.file ? 'FormData con archivo' : postData
      );

      // Llamar al servicio para crear la publicación
      const response = await communityService.createPost(postData);

      if (response) {
        setSuccessMessage('Publicación creada correctamente');
        resetForm();

        // Actualizar la lista de publicaciones
        await fetchAllPosts();

        return response;
      }

      return null;
    } catch (err) {
      console.error('Error al crear publicación:', err);

      // Intentar extraer mensaje de error del backend
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Error al crear la publicación. Inténtalo de nuevo.';

      setError(errorMessage);
      setFormErrors({
        ...formErrors,
        general: errorMessage
      });

      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza una publicación existente
   * @param {number} postId - ID de la publicación a actualizar
   * @param {Event} e - Evento del formulario
   * @returns {Promise<Object|null>} La publicación actualizada o null si hay error
   */
  const handleUpdatePost = async (postId, e) => {
    if (e) e.preventDefault();

    setSuccessMessage('');

    if (!validateForm()) return null;

    setLoading(true);

    try {
      // Para actualización, solo enviamos los campos básicos
      const updateData = {
        postType: formData.postType,
        content: formData.content
      };

      // Si hay un archivo nuevo, lo procesamos
      if (formData.file) {
        const updateFormData = new FormData();
        updateFormData.append('postType', formData.postType);
        updateFormData.append('content', formData.content);
        updateFormData.append('multimediaContent', formData.file);

        const response = await communityService.updatePost(postId, updateFormData);

        if (response) {
          setSuccessMessage('Publicación actualizada correctamente');
          resetForm();
          await fetchAllPosts();
          return response;
        }
      } else {
        // Sin archivo nuevo
        const response = await communityService.updatePost(postId, updateData);

        if (response) {
          setSuccessMessage('Publicación actualizada correctamente');
          resetForm();
          await fetchAllPosts();
          return response;
        }
      }

      return null;
    } catch (err) {
      console.error(`Error al actualizar publicación ${postId}:`, err);
      setFormErrors({
        ...formErrors,
        general: err.message || 'Error al actualizar la publicación'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una publicación
   * @param {number} postId - ID de la publicación a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  const handleDeletePost = async (postId) => {
    setLoading(true);
    setError(null);

    try {
      await communityService.deletePost(postId);
      setSuccessMessage('Publicación eliminada correctamente');
      await fetchAllPosts();
      return true;
    } catch (err) {
      console.error(`Error al eliminar publicación ${postId}:`, err);
      setError(err.message || 'Error al eliminar la publicación');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Verifica si el usuario puede editar una publicación
   * @param {Object} post - La publicación a verificar
   * @returns {boolean} true si puede editar
   */
  const canEditPost = (post) => {
    // Por simplicidad, asumimos que el creador puede editar
    // En un caso real, verificaríamos si el usuario actual es el creador
    // o tiene roles especiales (admin/moderador)
    return true;
  };

  /**
   * Verifica si el usuario puede eliminar una publicación
   * @param {Object} post - La publicación a verificar
   * @returns {boolean} true si puede eliminar
   */
  const canDeletePost = (post) => {
    // Similar a canEditPost
    return true;
  };

  return {
    // Estados
    posts,
    selectedPost,
    formData,
    loading,
    error,
    formErrors,
    successMessage,

    // Getters
    canEditPost,
    canDeletePost,

    // Setters
    setSelectedPost,
    setFormData,

    // Operaciones CRUD
    fetchAllPosts,
    fetchPostsByGroupId,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    loadPostForEdit,

    // Funciones de formulario
    handleChange,
    resetForm,
    validateForm
  };
};