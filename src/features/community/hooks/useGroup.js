import { useContext, useState } from 'react';
import { GroupContext } from '../context/GroupContext';
import { communityService } from '../services/communityService';

/**
 * Hook personalizado para manejar la lógica de grupos.
 * Este hook encapsula:
 * - Estados de carga y errores relacionados con los grupos.
 * - Handlers para crear, actualizar y eliminar grupos.
 */
export const useGroup = () => {
  const { groups, loading, error, fetchGroups } = useContext(GroupContext);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'El nombre del grupo es obligatorio';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };

  const handleCreateGroup = async () => {
    setSuccessMessage('');
    if (!validateForm()) return null;
    try {
      // Aquí llamaría a una función que interactúe con la API (communityService)
      setSuccessMessage('Grupo creado correctamente');
      resetForm();
    } catch (error) {
      setFormErrors({ general: error.message || 'Error al crear el grupo' });
    }
  };

   /**
   * Handler para unirse a un grupo.
   * @param {number|string} groupId - ID del grupo al que se une el usuario.
   * @returns {Promise<void>}
   */
  const handleJoinGroup = async (groupId) => {
    setSuccessMessage('');
    setFormErrors({});
    try {
      await communityService.joinGroup(groupId);
      setSuccessMessage('¡Te has unido al grupo correctamente!');
      // Opcional: Actualiza la lista de grupos si tiene sentido en tu UX
      if (fetchGroups) {
        await fetchGroups();
      }
    } catch (error) {
      setFormErrors({ general: error.message || 'No se pudo unir al grupo' });
    }
  };

  return {
    groups,
    loading,
    error,
    formData,
    formErrors,
    successMessage,
    fetchGroups,
    handleChange,
    resetForm,
    handleCreateGroup,
    handleJoinGroup
  };
};