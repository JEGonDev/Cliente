import { useState, useContext } from 'react';
import { EducationContext } from '../context/EducationContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de módulos educativos
 * 
 * @returns {Object} Propiedades y métodos para trabajar con módulos
 */
export const useModules = () => {
  // Contexto de educación
  const {
    modules,
    module,
    loadingModules,
    moduleError,
    fetchAllModules,
    fetchModuleById,
    createModule: contextCreateModule,
    updateModule: contextUpdateModule,
    deleteModule: contextDeleteModule,
    filterModulesByTags
  } = useContext(EducationContext);
  
  // Contexto de autenticación para validar permisos
  const { isAdmin, isAuthenticated } = useContext(AuthContext);
  
  // Estado para formularios y UI
  const [formData, setFormData] = useState({
    id: null, // Inicializamos id como null para claridad
    title: '',
    description: '',
    tagIds: []
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  /**
   * Valida el formulario de módulo
   * @returns {boolean} true si es válido, false si no
   */
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'El título es obligatorio';
    } else {
      // Comprobar si ya existe un módulo con el mismo título, excluyendo el módulo actual
      const duplicateModule = modules.find(
        module => 
          module.title && 
          module.title.toLowerCase() === formData.title.toLowerCase() && 
          (module.id || module.moduleId) !== (formData.id || null)
      );
      
      if (duplicateModule) {
        errors.title = 'Ya existe un módulo con este título. Por favor, use un título diferente.';
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
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  /**
   * Maneja cambios en las etiquetas seleccionadas
   * @param {Array} selectedTags - Etiquetas seleccionadas
   */
  const handleTagsChange = (selectedTags) => {
    setFormData({ ...formData, tagIds: selectedTags });
  };
  
  /**
   * Resetea el formulario
   */
  const resetForm = () => {
    setFormData({
      id: null,
      title: '',
      description: '',
      tagIds: []
    });
    setFormErrors({});
    setSuccessMessage('');
  };
  
  /**
   * Carga datos de un módulo existente en el formulario
   * @param {number} id - ID del módulo
   */
  const loadModuleForEdit = async (id) => {
    try {
      const moduleData = await fetchModuleById(id);
      
      if (moduleData) {
        setFormData({
          id: moduleData.id || moduleData.moduleId, // Incluimos el id del módulo
          title: moduleData.title || '',
          description: moduleData.description || '',
          tagIds: moduleData.tagIds || []
        });
        return moduleData;
      }
      return null;
    } catch (error) {
      console.error(`Error cargando módulo ${id} para editar:`, error);
      return null;
    }
  };
  
  /**
   * Crea un nuevo módulo
   * @param {Event} e - Evento de envío del formulario
   */
  const handleCreateModule = async (e) => {
    e.preventDefault();
    
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }
    
    // Solo los administradores pueden crear módulos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para crear módulos' });
      return null;
    }
    
    // Limpiar mensajes previos
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      const newModule = await contextCreateModule(formData);
      
      if (newModule) {
        setSuccessMessage('Módulo creado correctamente');
        resetForm();
        return newModule;
      }
      return null;
    } catch (error) {
      console.error('Error creando módulo:', error);
      return null;
    }
  };
  
  /**
   * Actualiza un módulo existente
   * @param {number} id - ID del módulo
   * @param {Event} e - Evento de envío del formulario
   */
  const handleUpdateModule = async (id, e) => {
    e.preventDefault();
    
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return null;
    }
    
    // Solo los administradores pueden actualizar módulos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para actualizar módulos' });
      return null;
    }
    
    // Limpiar mensajes previos
    setSuccessMessage('');
    
    // Validar formulario
    if (!validateForm()) return null;
    
    try {
      const updatedModule = await contextUpdateModule(id, formData);
      
      if (updatedModule) {
        setSuccessMessage('Módulo actualizado correctamente');
        return updatedModule;
      }
      return null;
    } catch (error) {
      console.error(`Error actualizando módulo ${id}:`, error);
      return null;
    }
  };
  
  /**
   * Elimina un módulo
   * @param {number} id - ID del módulo
   */
  const handleDeleteModule = async (id) => {
    // Verificar autenticación y permisos
    if (!isAuthenticated) {
      setFormErrors({ auth: 'Debes iniciar sesión para realizar esta acción' });
      return false;
    }
    
    // Solo los administradores pueden eliminar módulos
    if (!isAdmin) {
      setFormErrors({ permission: 'No tienes permisos para eliminar módulos' });
      return false;
    }
    
    try {
      // Confirmar eliminación
      if (window.confirm('¿Estás seguro de que deseas eliminar este módulo?')) {
        const success = await contextDeleteModule(id);
        
        if (success) {
          setSuccessMessage('Módulo eliminado correctamente');
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error(`Error eliminando módulo ${id}:`, error);
      return false;
    }
  };
  
  // Retornamos los estados y funciones que necesita el componente
  return {
    // Estados
    modules,
    module,
    loading: loadingModules,
    error: moduleError,
    formData,
    formErrors,
    successMessage,
    
    // Funciones de obtención de datos
    fetchAllModules,
    fetchModuleById,
    filterModulesByTags,
    
    // Funciones de formulario
    handleChange,
    handleTagsChange,
    resetForm,
    loadModuleForEdit,
    
    // Funciones CRUD
    handleCreateModule,
    handleUpdateModule,
    handleDeleteModule,
    
    // Helper para permisos
    canManageModules: isAdmin
  };
};