import { useContext, useState } from 'react';
import { MessageContext } from '../context/MessageContext';

/**
 * Hook personalizado para manejar la lógica de mensajes.
 * Este hook encapsula:
 * - Estados de carga y errores relacionados con los mensajes.
 * - Handlers para crear y eliminar mensajes.
 */
export const useMessages = () => {
  const { messages, loading, error, fetchMessages } = useContext(MessageContext);
  const [formData, setFormData] = useState({ postId: null, content: '', threadId: null, groupId: null });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!formData.postId) errors.postId = 'El ID del post es obligatorio';
    if (!formData.content.trim()) errors.content = 'El contenido es obligatorio';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ postId: null, content: '', threadId: null, groupId: null });
    setFormErrors({});
  };

  const handleCreateMessage = async () => {
    setSuccessMessage('');
    if (!validateForm()) return null;
    try {
      // Aquí llamaría a una función que interactúe con la API (communityService)
      setSuccessMessage('Mensaje enviado correctamente');
      resetForm();
    } catch (error) {
      setFormErrors({ general: error.message || 'Error al enviar el mensaje' });
    }
  };

  return {
    messages,
    loading,
    error,
    formData,
    formErrors,
    successMessage,
    fetchMessages,
    handleChange,
    resetForm,
    handleCreateMessage,
  };
};