import { useState, useContext } from 'react';
import { CommunityContext } from '../context/CommunityContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de posts
 * 
 * Este hook encapsula:
 * - Estados del formulario de creación y actualización de posts
 * - Estado de la UI (errores, carga)
 * - Handlers para interacción con posts (crear, actualizar, eliminar)
 * 
 * @returns {Object} Propiedades y métodos para trabajar con posts
 */
export const usePost = () => {
  // Contexto de comunidad
  const { 
    posts, 
    post, 
    loadingPosts, 
    postError,
    fetchAllPosts,
    fetchPostById,
    createPost: contextCreatePost,
    updatePost: contextUpdatePost,
    deletePost: contextDeletePost,
    canEditPost,
    canDeletePost
  } = useContext(CommunityContext);
  
  // Contexto de autenticación
  const { user, isAdmin } = useContext(AuthContext);
  
  // Estados locales para el formulario
  const [formData, setFormData] = useState({
    postType: '',
    content: '',
    multimediaContent: '',
    groupId: null,
    threadId: null,
    file: null
  });
  
  // Estado para errores del formulario
  const [formErrors, setFormErrors] = useState({});
  
  // Estado para mostrar mensaje de éxito
  const [successMessage, setSuccessMessage] = useState('');
  
  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.postType.trim()) {
      errors.postType = 'El tipo de post es obligatorio';
    }
    
    if (!formData.content.trim()) {
      errors.content = 'El contenido es obligatorio';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Maneja los cambios en los inputs del formulario
   * @param {Event} e - Evento de cambio del input
   */
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({ ...formData, file: files[0] });
    } else if (name === 'groupId' || name === 'threadId') {
      // Convertir a número o null si está vacío
      const numValue = value ? parseInt(value, 10) : null;
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  /**
   * Limpia el formulario después de una operación
   */
  const resetForm = () => {
    setFormData({
      postType: '',
      content: '',
      multimediaContent: '',
      groupId: null,
      threadId: null,
      file: null
    });
    setFormErrors({});
  };
  
  /**
   * Maneja el envío del formulario para crear un post
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    // Reset mensajes
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return;
    
    try {
      const newPost = await contextCreatePost(formData);
      if (newPost) {
        setSuccessMessage('Post creado correctamente');
        resetForm();
        return newPost;
      }
      return null;
    } catch (error) {
      console.error('Error al crear post:', error);
      setFormErrors({ general: error.message || 'Error al crear el post' });
      return null;
    }
  };
  
  /**
   * Carga los datos de un post para editarlo
   * @param {number} id - ID del post a editar
   */
  const loadPostForEdit = async (id) => {
    try {
      const postData = await fetchPostById(id);
      if (postData) {
        // Verificar permisos
        if (!canEditPost(postData)) {
          setFormErrors({
            permission: 'No tienes permisos para editar este post. Solo el creador o un administrador pueden editar este post.'
          });
          return null;
        }
        
        setFormData({
          postType: postData.postType || '',
          content: postData.content || '',
          multimediaContent: postData.multimediaContent || '',
          groupId: postData.groupId || null,
          threadId: postData.threadId || null,
          file: null // No podemos cargar el archivo original
        });
        
        return postData;
      }
      return null;
    } catch (error) {
      console.error(`Error al cargar post ${id} para editar:`, error);
      setFormErrors({ general: error.message || `Error al cargar el post ${id}` });
      return null;
    }
  };
  
  /**
   * Maneja el envío del formulario para actualizar un post
   * @param {number} id - ID del post a actualizar
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdatePost = async (id, e) => {
    e.preventDefault();
    
    // Obtenemos los datos del post
    const postData = await fetchPostById(id);
    if (!postData) {
      setFormErrors({ general: 'No se pudo encontrar el post' });
      return null;
    }
    
    // Verificar permisos
    if (!canEditPost(postData)) {
      setFormErrors({
        permission: 'No tienes permisos para actualizar este post. Solo el creador o un administrador pueden editar este post.'
      });
      return null;
    }
    
    // Reset mensajes
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      // Preparamos los datos para la actualización
      const updateData = { ...formData };
      // Si no se seleccionó un nuevo archivo, eliminamos la propiedad file
      if (!updateData.file) {
        delete updateData.file;
      }
      
      const updatedPost = await contextUpdatePost(id, updateData);
      if (updatedPost) {
        setSuccessMessage('Post actualizado correctamente');
        return updatedPost;
      }
      return null;
    } catch (error) {
      console.error(`Error al actualizar post ${id}:`, error);
      setFormErrors({ general: error.message || `Error al actualizar el post ${id}` });
      return null;
    }
  };
  
  /**
   * Maneja la eliminación de un post
   * @param {number} id - ID del post a eliminar
   */
  const handleDeletePost = async (id) => {
    // Obtenemos los datos del post
    const postData = await fetchPostById(id);
    if (!postData) {
      setFormErrors({ general: 'No se pudo encontrar el post' });
      return false;
    }
    
    // Verificar permisos
    if (!canDeletePost(postData)) {
      setFormErrors({
        permission: 'No tienes permisos para eliminar este post. Solo el creador o un administrador pueden eliminar este post.'
      });
      return false;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este post?')) {
      try {
        const success = await contextDeletePost(id);
        if (success) {
          setSuccessMessage('Post eliminado correctamente');
          return true;
        }
        return false;
      } catch (error) {
        console.error(`Error al eliminar post ${id}:`, error);
        setFormErrors({ general: error.message || `Error al eliminar el post ${id}` });
        return false;
      }
    }
    return false;
  };
  
  /**
   * Obtiene posts por grupo
   * @param {number} groupId - ID del grupo
   * @returns {Array} Lista de posts filtrados
   */
  const getPostsByGroupId = (groupId) => {
    return posts.filter(p => p.groupId === groupId);
  };
  
  /**
   * Obtiene posts por hilo
   * @param {number} threadId - ID del hilo
   * @returns {Array} Lista de posts filtrados
   */
  const getPostsByThreadId = (threadId) => {
    return posts.filter(p => p.threadId === threadId);
  };
  
  /**
   * Obtiene posts por usuario
   * @param {number} userId - ID del usuario
   * @returns {Array} Lista de posts filtrados
   */
  const getPostsByUserId = (userId) => {
    return posts.filter(p => p.userId === userId);
  };
  
  /**
   * Obtiene posts del usuario actual
   * @returns {Array} Lista de posts del usuario actual
   */
  const getCurrentUserPosts = () => {
    if (!user) return [];
    return getPostsByUserId(user.id);
  };
  
  // Retornamos todos los estados y funciones que necesita el componente
  return {
    // Estados
    posts,
    post,
    loading: loadingPosts,
    error: postError,
    formData,
    formErrors,
    successMessage,
    
    // Funciones para obtener datos
    fetchAllPosts,
    fetchPostById,
    getPostsByGroupId,
    getPostsByThreadId,
    getPostsByUserId,
    getCurrentUserPosts,
    
    // Funciones de formulario
    handleChange,
    resetForm,
    
    // Funciones de CRUD
    handleCreatePost,
    loadPostForEdit,
    handleUpdatePost,
    handleDeletePost,
    
    // Helpers
    canEditPost,
    canDeletePost
  };
};