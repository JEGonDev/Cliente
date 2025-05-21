import { useState, useContext } from 'react';
import { AuthContext } from '../../authentication/context/AuthContext';
import { communityService } from '../services/communityService';

export const usePost = () => {
  // Estados para manejar los posts
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    postType: '',
    content: '',
    multimediaContent: null,
    groupId: null,
    threadId: null,
    file: null
  });
  
  // Estados para manejo de UI
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  // Contexto de autenticación
  const { user, isAdmin } = useContext(AuthContext);
  
  // Validación del formulario
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
  
  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file' && files && files.length > 0) {
      setFormData({
        ...formData,
        file: files[0]
      });
    } else if (name === 'groupId' || name === 'threadId') {
      setFormData({
        ...formData,
        [name]: value ? parseInt(value, 10) : null
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Resetear el formulario
  const resetForm = () => {
    setFormData({
      postType: '',
      content: '',
      multimediaContent: null,
      groupId: null,
      threadId: null,
      file: null
    });
    setFormErrors({});
  };
  
  // Obtener todos los posts
  const fetchAllPosts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await communityService.getAllPosts();
      
      if (response && response.data) {
        setPosts(response.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.error('Error al obtener posts:', err);
      setError(err.message || 'Error al cargar las publicaciones');
    } finally {
      setLoading(false);
    }
  };
  
  // Crear un nuevo post
  const handleCreatePost = async (e) => {
    if (e) e.preventDefault();
    
    setSuccessMessage('');
    
    if (!validateForm()) return null;
    
    setLoading(true);
    
    try {
      // Preparar los datos para enviar (con o sin archivo)
      let postData;
      
      if (formData.file) {
        postData = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'file') {
            postData.append('file', formData.file);
          } else if (formData[key] !== null && formData[key] !== undefined) {
            postData.append(key, formData[key]);
          }
        });
      } else {
        postData = { ...formData };
        delete postData.file;
      }
      
      const response = await communityService.createPost(postData);
      
      if (response && response.data) {
        setSuccessMessage('Publicación creada correctamente');
        resetForm();
        await fetchAllPosts(); // Refrescar la lista
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error('Error al crear post:', err);
      setFormErrors({
        ...formErrors,
        general: err.message || 'Error al crear la publicación'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Actualizar un post existente
  const handleUpdatePost = async (id, e) => {
    if (e) e.preventDefault();
    
    setSuccessMessage('');
    
    if (!validateForm()) return null;
    
    setLoading(true);
    
    try {
      const updateData = {
        postType: formData.postType,
        content: formData.content,
        multimediaContent: formData.multimediaContent
      };
      
      const response = await communityService.updatePost(id, updateData);
      
      if (response && response.data) {
        setSuccessMessage('Publicación actualizada correctamente');
        resetForm();
        await fetchAllPosts(); // Refrescar la lista
        return response.data;
      }
      
      return null;
    } catch (err) {
      console.error(`Error al actualizar post ${id}:`, err);
      setFormErrors({
        ...formErrors,
        general: err.message || 'Error al actualizar la publicación'
      });
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Eliminar un post
  const handleDeletePost = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      await communityService.deletePost(id);
      setSuccessMessage('Publicación eliminada correctamente');
      await fetchAllPosts(); // Refrescar la lista
      return true;
    } catch (err) {
      console.error(`Error al eliminar post ${id}:`, err);
      setError(err.message || 'Error al eliminar la publicación');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    posts,
    selectedPost,
    loading,
    error,
    formData,
    formErrors,
    successMessage,
    fetchAllPosts,
    handleChange,
    resetForm,
    handleCreatePost,
    handleUpdatePost,
    handleDeletePost,
    validateForm
  };
};