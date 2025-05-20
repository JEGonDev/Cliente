import { useContext, useState } from 'react';
import { PostContext } from '../context/PostContext';
import { communityService } from '../services/communityService';

export const usePosts = () => {
  const { posts, loading, error, fetchPosts } = useContext(PostContext);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Opcional: puedes mover la validación aquí si lo necesitas

  const handleCreatePost = async (formData) => {
    setSuccessMessage('');
    setFormErrors({});
    try {
      const createdPost = await communityService.createPost(formData);
      setSuccessMessage('Post creado correctamente');
      fetchPosts(); // Refresca la lista tras crear
      return createdPost;
    } catch (error) {
      setFormErrors({ general: error.message || 'Error al crear el post' });
      throw error;
    }
  };

  return {
    posts,
    loading,
    error,
    formErrors,
    successMessage,
    fetchPosts,
    handleCreatePost,
  };
};


// import { useContext, useState } from 'react';
// import { PostContext } from '../context/PostContext';

// /**
//  * Hook personalizado para manejar la lógica de posts.
//  * Este hook encapsula:
//  * - Estados de carga y errores relacionados con posts.
//  * - Handlers para crear, actualizar y eliminar posts.
//  */
// export const usePosts = () => {
//   const { posts, loading, error, fetchPosts } = useContext(PostContext); // Consumimos el contexto de posts.
//   const [formData, setFormData] = useState({ postType: '', content: '', multimediaContent: '', groupId: null, threadId: null });
//   const [formErrors, setFormErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   const validateForm = () => {
//     const errors = {};
//     if (!formData.postType.trim()) errors.postType = 'El tipo de post es obligatorio';
//     if (!formData.content.trim()) errors.content = 'El contenido es obligatorio';
//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const resetForm = () => {
//     setFormData({ postType: '', content: '', multimediaContent: '', groupId: null, threadId: null });
//     setFormErrors({});
//   };

//   const handleCreatePost = async () => {
//     setSuccessMessage('');
//     if (!validateForm()) return null;
//     try {
//       // Aquí llamaría a una función que interactúe con la API (communityService)
//       setSuccessMessage('Post creado correctamente');
//       resetForm();
//     } catch (error) {
//       setFormErrors({ general: error.message || 'Error al crear el post' });
//     }
//   };

//   return {
//     posts,
//     loading,
//     error,
//     formData,
//     formErrors,
//     successMessage,
//     fetchPosts,
//     handleChange,
//     resetForm,
//     handleCreatePost,
//   };
// };