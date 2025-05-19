import { useState, useContext, useCallback } from 'react';
import { EducationContext } from '../context/EducationContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de guías educativas
 * 
 * @returns {Object} Propiedades y métodos para trabajar con guías
 */
export const useGuides = () => {
  // Contexto de educación
  const {
    guides,
    guide,
    loadingGuides,
    guideError,
    fetchAllGuides,
    fetchGuidesByModuleId,
    fetchGuideById,
    createGuide: contextCreateGuide,
    updateGuide: contextUpdateGuide,
    deleteGuide: contextDeleteGuide
  } = useContext(EducationContext);

  // Contexto de autenticación para validar permisos
  const { isAdmin, isAuthenticated } = useContext(AuthContext);

  // Estado para formularios y UI
  const [formData, setFormData] = useState({
    moduleId: null,
    title: '',
    description: '',
    pdfFile: null
  });

  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  /**
   * Valida el formulario de guía
   * @param {boolean} isEditing - Indica si se está editando (no requiere archivo)
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = (isEditing = false) => {
    const errors = {};

    if (!formData.moduleId) {
      errors.moduleId = 'El módulo es obligatorio';
    }

    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    }

    // Solo requerimos archivo PDF para creación, no para edición
    if (!isEditing && !formData.pdfFile) {
      errors.pdfFile = 'El archivo PDF es obligatorio';
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

    if (type === 'file') {
      setFormData({ ...formData, pdfFile: files[0] });
    } else if (name === 'moduleId') {
      // Convertir a número o null si está vacío
      const numValue = value ? parseInt(value, 10) : null;
      setFormData({ ...formData, [name]: numValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /**
   * Establecer directamente el moduleId
   * @param {number} moduleId - ID del módulo
   */
  const setModuleId = (moduleId) => {
    setFormData(prev => ({ ...prev, moduleId }));
  };

  /**
   * Resetea el formulario
   */
  const resetForm = () => {
    setFormData({
      moduleId: null,
      title: '',
      description: '',
      pdfFile: null
    });
    setFormErrors({});
    setSuccessMessage('');

    // Limpiar también el campo de archivo si existe
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  /**
   * Carga datos de una guía existente en el formulario
   * @param {number} id - ID de la guía
   */
  const loadGuideForEdit = useCallback(async (id) => {
    try {
      const guideData = await fetchGuideById(id);

      if (guideData) {
        setFormData({
          moduleId: guideData.moduleId || null,
          title: guideData.title || '',
          description: guideData.description || '',
          // No podemos cargar el archivo PDF existente
          pdfFile: null
        });
        return guideData;
      }
      return null;
    } catch (error) {
      console.error(`Error cargando guía ${id} para editar:`, error);
      return null;
    }
  }, [fetchGuideById]);

  /**
   * Crea una nueva guía
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreateGuide = async (e) => {
    e.preventDefault();

    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }

    // Sólo los administradores pueden crear guías
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para crear guías' });
      return null;
    }

    // Limpiar mensajes previos
    setSuccessMessage('');

    // Validar formulario (nueva guía)
    if (!validateForm(false)) return null;

    try {
      const newGuide = await contextCreateGuide(formData);

      if (newGuide) {
        setSuccessMessage('Guía creada correctamente');
        resetForm();
        return newGuide;
      }
      return null;
    } catch (error) {
      console.error('Error creando guía:', error);
      return null;
    }
  };

  /**
   * Actualiza una guía existente
   * @param {number} id - ID de la guía
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdateGuide = async (id, e) => {
    e.preventDefault();

    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }

    // Sólo los administradores pueden actualizar guías
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para actualizar guías' });
      return null;
    }

    // Limpiar mensajes previos
    setSuccessMessage('');

    // Validar formulario (edición)
    if (!validateForm(true)) return null;

    try {
      // Para actualización, no enviamos el archivo PDF
      const updateData = {
        moduleId: formData.moduleId,
        title: formData.title,
        description: formData.description
      };

      const updatedGuide = await contextUpdateGuide(id, updateData);

      if (updatedGuide) {
        setSuccessMessage('Guía actualizada correctamente');
        return updatedGuide;
      }
      return null;
    } catch (error) {
      console.error(`Error actualizando guía ${id}:`, error);
      return null;
    }
  };

  /**
   * Elimina una guía
   * @param {number} id - ID de la guía
   */
  const handleDeleteGuide = async (id) => {
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return false;
    }

    // Sólo los administradores pueden eliminar guías
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para eliminar guías' });
      return false;
    }

    try {
      const success = await contextDeleteGuide(id);

      if (success) {
        setSuccessMessage('Guía eliminada correctamente');
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error eliminando guía ${id}:`, error);
      return false;
    }
  };

  // Retornamos los estados y funciones que necesita el componente
  return {
    // Estados
    guides,
    guide,
    loading: loadingGuides,
    error: guideError,
    formData,
    formErrors,
    successMessage,

    // Funciones de obtención de datos
    fetchAllGuides,
    fetchGuidesByModuleId,
    fetchGuideById,

    // Funciones de formulario
    handleChange,
    setModuleId,
    resetForm,
    loadGuideForEdit,

    // Funciones CRUD
    handleCreateGuide,
    handleUpdateGuide,
    handleDeleteGuide,

    // Helper para permisos
    canManageGuides: isAdmin
  };
};