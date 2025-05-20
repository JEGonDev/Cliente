import { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../authentication/context/AuthContext';
import { useModules } from './useModules';
import { useTags } from './useTags';

/**
 * Hook personalizado para manejar toda la lógica de la página principal educativa.
 * Centraliza estados, efectos secundarios y operaciones del módulo educativo.
 * 
 * @returns {Object} Estado y funciones para manipular la página educativa
 */
export const useEducationPage = () => {
  // Contexto y navegación
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Hooks personalizados para datos
  const {
    modules,
    loading: loadingModules,
    error: modulesError,
    fetchAllModules,
    handleDeleteModule,
    filterModulesByTags
  } = useModules();
  
  const {
    tags,
    loading: loadingTags,
    error: tagsError,
    fetchAllTags
  } = useTags();
  
  // Estados de UI
  const [activeIcon, setActiveIcon] = useState('none');
  const [searchValue, setSearchValue] = useState('');
  const [activeTags, setActiveTags] = useState([]);
  const [activeTagIds, setActiveTagIds] = useState([]);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedModuleToEdit, setSelectedModuleToEdit] = useState(null);
  const [filteredModules, setFilteredModules] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  
  /**
   * Carga los datos iniciales al montar el componente
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const all = await fetchAllModules();
        const modulesArray = Array.isArray(all) ? all : [];
        setAllModules(modulesArray);
        setFilteredModules(modulesArray);
      } catch (error) {
        console.error("Error cargando módulos:", error);
        setAllModules([]);
        setFilteredModules([]);
      }

      try {
        await fetchAllTags();
      } catch (error) {
        console.error("Error cargando etiquetas:", error);
      }
    };

    loadInitialData();
  }, []);
  
  /**
   * Efecto para filtrar módulos cuando cambian los filtros o la búsqueda
   */
  useEffect(() => {
    const filterModules = async () => {
      let result = [];

      if (activeTagIds.length > 0) {
        try {
          result = await filterModulesByTags(activeTagIds);
        } catch (error) {
          console.error('Error al filtrar módulos por etiquetas:', error);
          result = allModules;
        }
      } else {
        result = allModules;
      }

      if (searchValue.trim() !== '') {
        const searchLower = searchValue.toLowerCase();
        result = result.filter(module =>
          module.title && module.title.toLowerCase().includes(searchLower)
        );
      }

      setFilteredModules(Array.isArray(result) ? result : []);
    };

    if (allModules.length > 0) {
      filterModules();
    }
  }, [activeTagIds, searchValue, allModules]);
  
  // Handlers para la interfaz de usuario
  
  /**
   * Maneja el clic en un ícono de navegación
   * @param {string} iconId - ID del ícono seleccionado
   */
  const handleIconClick = (iconId) => setActiveIcon(iconId);
  
  /**
   * Maneja cambios en el campo de búsqueda
   * @param {Object} e - Evento de cambio
   */
  const handleSearchChange = (e) => setSearchValue(e.target.value);
  
  /**
   * Maneja el clic en una etiqueta para activarla o desactivarla
   * @param {number} tagId - ID de la etiqueta
   */
  const handleTagClick = useCallback((tagId) => {
    const tagObj = tags && Array.isArray(tags) ? tags.find(t => t.id === tagId) : null;
    if (!tagObj) {
      console.warn("DEBUG - Etiqueta no encontrada para ID:", tagId);
      return;
    }

    const tagName = tagObj.name;
    
    setActiveTags(prev =>
      prev.includes(tagName)
        ? prev.filter(name => name !== tagName)
        : [...prev, tagName]
    );

    setActiveTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  }, [tags]);
  
  /**
   * Gestión de modales y navegación
   */
  
  // Creación de módulos
  const handleCreateModule = () => navigate('/education/module-form');
  
  // Edición de módulos
  const handleEnterEditMode = () => {
    setIsEditMode(true);
    setSelectedModuleToEdit(null);
    setIsDeleteMode(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedModuleToEdit(null);
  };
  
  const handleSelectModuleForEdit = (moduleId) => {
    setSelectedModuleToEdit(prev => prev === moduleId ? null : moduleId);
  };
  
  const handleEditModule = () => handleEnterEditMode();
  
  const handleConfirmEdit = () => {
    if (!selectedModuleToEdit) return;
    navigate(`/education/module-form/${selectedModuleToEdit}`);
    setIsEditMode(false);
    setSelectedModuleToEdit(null);
  };
  
  // Eliminación de módulos
  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedModules([]);
    setIsEditMode(false);
  };
  
  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedModules([]);
  };
  
  const handleSelectModule = (moduleId) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };
  
  const handleConfirmDelete = () => {
    if (!selectedModules.length) return;
    setModuleToDelete(selectedModules[0]);
    setDeleteConfirmModalOpen(true);
  };
  
  const handleModalConfirmDelete = async () => {
    if (!moduleToDelete) return;

    try {
      await handleDeleteModule(moduleToDelete);
      const all = await fetchAllModules();
      setAllModules(Array.isArray(all) ? all : []);
      setFilteredModules(Array.isArray(all) ? all : []);
      setIsDeleteMode(false);
      setSelectedModules([]);
      setDeleteConfirmModalOpen(false);
      setModuleToDelete(null);
    } catch (error) {
      console.error('Error al eliminar módulo:', error);
    }
  };
  
  /**
   * Maneja la actualización de etiquetas
   */
  const handleTagsUpdated = async () => {
    try {
      await fetchAllTags();
      const all = await fetchAllModules();
      setAllModules(Array.isArray(all) ? all : []);
      setFilteredModules(Array.isArray(all) ? all : []);
    } catch (error) {
      console.error("Error actualizando datos después de cambios en etiquetas:", error);
    }
  };
  
  // Estados derivados y calculados
  const isLoading = loadingModules || loadingTags;
  const hasError = modulesError || tagsError;
  const isEmpty = !isLoading && !hasError && filteredModules.length === 0;
  
  // Valores y funciones expuestas por el hook
  return {
    // Estados
    activeIcon,
    searchValue,
    activeTags,
    activeTagIds,
    isDeleteMode,
    selectedModules,
    isEditMode,
    selectedModuleToEdit,
    filteredModules,
    deleteConfirmModalOpen,
    moduleToDelete,
    
    // Datos
    modules,
    tags,
    
    // Estados derivados
    isLoading,
    hasError,
    isEmpty,
    isAdmin,
    
    // Handlers de navegación
    handleIconClick,
    handleSearchChange,
    handleTagClick,
    
    // Handlers de operaciones CRUD
    handleCreateModule,
    handleEditModule,
    handleEnterEditMode,
    handleCancelEdit,
    handleSelectModuleForEdit,
    handleConfirmEdit,
    handleEnterDeleteMode,
    handleCancelDelete,
    handleSelectModule,
    handleConfirmDelete,
    
    // Handlers para modales
    handleModalConfirmDelete,
    setDeleteConfirmModalOpen,
    
    // Funciones de actualización
    handleTagsUpdated
  };
};