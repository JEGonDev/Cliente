import { useState, useContext } from 'react';
import { EducationContext } from '../context/EducationContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de etiquetas educativas
 * 
 * @returns {Object} Propiedades y métodos para trabajar con etiquetas
 */
export const useTags = () => {
  // Contexto de educación
  const {
    tags,
    tag,
    loadingTags,
    tagError,
    fetchAllTags,
    fetchTagById,
    fetchTagByName,
    createTag: contextCreateTag,
    updateTag: contextUpdateTag,
    deleteTag: contextDeleteTag,
    getOrCreateTag
  } = useContext(EducationContext);

  // Contexto de autenticación para validar permisos
  const { isAdmin, isAuthenticated } = useContext(AuthContext);

  // Estado para formularios y UI
  const [formData, setFormData] = useState({
    id: null,
    name: '',
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Valida el formulario de etiqueta
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'El nombre de la etiqueta es obligatorio';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento de cambio
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /**
   * Resetea el formulario
   */
  const resetForm = () => {
    setFormData({
      id: null,
      name: ''
    });
    setFormErrors({});
    setSuccessMessage('');
  };

  /**
   * Carga datos de una etiqueta existente en el formulario
   * @param {number} id - ID de la etiqueta
   */
  const loadTagForEdit = async (id) => {
    try {
      const tagData = await fetchTagById(id);

      if (tagData) {
        setFormData({
          id: tagData.id,
          name: tagData.name || ''
        });
        return tagData;
      }
      return null;
    } catch (error) {
      console.error(`Error cargando etiqueta ${id} para editar:`, error);
      return null;
    }
  };

  /**
   * Crea una nueva etiqueta
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreateTag = async (e) => {
    e.preventDefault();

    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }

    // Sólo los administradores pueden crear etiquetas
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para crear etiquetas' });
      return null;
    }

    // Limpiar mensajes previos
    setSuccessMessage('');

    // Validar formulario
    if (!validateForm()) return null;

    try {
      const newTag = await contextCreateTag(formData.name);

      if (newTag) {
        setSuccessMessage('Etiqueta creada correctamente');
        resetForm();
        return newTag;
      }
      return null;
    } catch (error) {
      console.error('Error creando etiqueta:', error);
      return null;
    }
  };

  /**
   * Actualiza una etiqueta existente
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdateTag = async (tagData) => {
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }
    
    // Sólo los administradores pueden actualizar etiquetas
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para actualizar etiquetas' });
      return null;
    }
    
    // Verificar que tenemos los datos necesarios
    if (!tagData || !tagData.id || !tagData.name) {
      setFormErrors({ data: 'Datos de etiqueta incompletos' });
      return null;
    }
    
    // Limpiar mensajes previos
    setSuccessMessage('');
    
    try {
      // Asegurarse de que estamos enviando los datos correctos
      const updateData = {
        id: tagData.id,
        name: tagData.name.trim()
      };
      
      console.log('Datos enviados para actualización:', updateData);
      
      const updatedTag = await contextUpdateTag(updateData);
      
      if (updatedTag) {
        setSuccessMessage('Etiqueta actualizada correctamente');
        
        // Actualizar el contexto llamando a fetchAllTags para refrescar la lista completa
        await fetchAllTags();
        
        return updatedTag;
      }
      return null;
    } catch (error) {
      console.error(`Error actualizando etiqueta ${tagData.id}:`, error);
      setFormErrors({ 
        api: error.response?.data?.message || 'Error al actualizar la etiqueta' 
      });
      return null;
    }
  };

  /**
   * Elimina una etiqueta
   * @param {number} id - ID de la etiqueta
   */
  const handleDeleteTag = async (id) => {
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return false;
    }

    // Sólo los administradores pueden eliminar etiquetas
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para eliminar etiquetas' });
      return false;
    }

    try {
      // Eliminamos el confirm ya que usamos el modal para confirmar
      const success = await contextDeleteTag(id);

      if (success) {
        setSuccessMessage('Etiqueta eliminada correctamente');
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error eliminando etiqueta ${id}:`, error);
      return false;
    }
  };

  /**
   * Maneja la obtención o creación de una etiqueta
   * @param {string} name - Nombre de la etiqueta
   */
  const handleGetOrCreateTag = async (name) => {
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }

    // Sólo los administradores pueden crear etiquetas (si no existe)
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para crear etiquetas' });
      return null;
    }

    try {
      return await getOrCreateTag(name);
    } catch (error) {
      console.error(`Error obteniendo o creando etiqueta "${name}":`, error);
      return null;
    }
  };

  // Retornamos los estados y funciones que necesita el componente
  return {
    // Estados
    tags,
    tag,
    loading: loadingTags,
    error: tagError,
    formData,
    formErrors,
    successMessage,

    // Funciones de obtención de datos
    fetchAllTags,
    fetchTagById,
    fetchTagByName,

    // Funciones de formulario
    handleChange,
    resetForm,
    loadTagForEdit,

    // Funciones CRUD
    handleCreateTag,
    handleUpdateTag,
    handleDeleteTag,
    handleGetOrCreateTag,

    // Helper para permisos
    canManageTags: isAdmin
  };
};