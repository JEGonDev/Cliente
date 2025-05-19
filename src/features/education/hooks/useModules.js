import { useState, useContext } from 'react';
import { EducationContext } from '../context/EducationContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para centralizar la gestión completa de módulos educativos
 * 
 * Este hook implementa el patrón Custom Hook para separar la lógica de negocio de la presentación,
 * proporcionando una API clara para trabajar con módulos (CRUD completo).
 * 
 * @returns {Object} Estado y funciones para manipular módulos educativos
 * 
 * @property {Array} modules - Lista de módulos cargados
 * @property {Object} module - Módulo individual seleccionado actualmente
 * @property {boolean} loading - Estado de carga de operaciones
 * @property {Object} error - Error actual si existe
 * @property {Object} formData - Estado actual del formulario
 * @property {Object} formErrors - Errores de validación del formulario
 * @property {string} successMessage - Mensaje de éxito tras operaciones
 * 
 * @property {Function} fetchAllModules - Carga todos los módulos disponibles
 * @property {Function} fetchModuleById - Carga un módulo específico por ID
 * @property {Function} filterModulesByTags - Filtra módulos por etiquetas
 * 
 * @property {Function} handleChange - Gestiona cambios en inputs del formulario
 * @property {Function} handleTagsChange - Gestiona cambios en selección de etiquetas
 * @property {Function} resetForm - Reinicia el formulario a valores predeterminados
 * @property {Function} loadModuleForEdit - Carga datos para edición
 * 
 * @property {Function} handleCreateModule - Crea un nuevo módulo
 * @property {Function} handleUpdateModule - Actualiza un módulo existente
 * @property {Function} handleDeleteModule - Elimina un módulo
 * 
 * @property {boolean} canManageModules - Indica si el usuario tiene permisos
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
  // IMPORTANTE: Separamos el estado del formulario del estado principal de la aplicación
  // para evitar actualizaciones innecesarias del contexto global mientras el usuario edita
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
        // Procesar tags para extraer los IDs correctamente
        let tagIds = [];
        
        // Si el módulo tiene tags como array
        if (moduleData.tags && Array.isArray(moduleData.tags)) {
          // Extraer IDs si los tags son objetos con id
          tagIds = moduleData.tags.map(tag => {
            // Si el tag es un objeto con id
            if (typeof tag === 'object' && tag !== null && tag.id) {
              return tag.id;
            }
            // Si el tag es directamente un id (string o número)
            if (typeof tag === 'string' || typeof tag === 'number') {
              return tag;
            }
            return null;
          }).filter(id => id !== null); // Eliminar valores nulos
        } 
        // Si el módulo ya tiene tagIds
        else if (moduleData.tagIds && Array.isArray(moduleData.tagIds)) {
          tagIds = moduleData.tagIds;
        }
        
        setFormData({
          id: moduleData.id || moduleData.moduleId,
          title: moduleData.title || '',
          description: moduleData.description || '',
          tagIds: tagIds
        });
        
        console.log('Tags cargados para edición:', tagIds);
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
      const success = await contextDeleteModule(id);
      
      if (success) {
        setSuccessMessage('Módulo eliminado correctamente');
        return true;
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