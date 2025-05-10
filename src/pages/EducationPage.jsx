import { useState, useContext, useEffect } from 'react';
import { EducationLayout } from '../features/education/layouts/EducationLayout';
import { ModulesList } from '../features/education/ui/ModulesList';
import { ModuleFilters } from '../features/education/ui/ModuleFilters';
import { AuthContext } from '../features/authentication/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AdminControlPanel } from '../features/education/ui/AdminControlPanel'; 
import { DeleteModeNotice } from '../features/education/ui/DeleteModeNotice';
import { useModules } from '../features/education/hooks/useModules';
import { useTags } from '../features/education/hooks/useTags';

export const EducationPage = () => {
  // Obtener información de autenticación y roles
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Usar hooks personalizados para módulos y etiquetas
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
  
  // Estados para la interfaz
  const [activeIcon, setActiveIcon] = useState('none');
  const [searchValue, setSearchValue] = useState('');
  
  // Estado para etiquetas activas (nombres para UI)
  const [activeTags, setActiveTags] = useState([]);
  // Estado para IDs de etiquetas activas (para backend)
  const [activeTagIds, setActiveTagIds] = useState([]);
  
  // Estado para modo de eliminación
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  
  // Cargar módulos y etiquetas al montar el componente
  useEffect(() => {
    fetchAllModules();
    fetchAllTags();
  }, []);
  
  // Filtrar módulos cuando cambian los IDs de etiquetas activas
  useEffect(() => {
    if (activeTagIds.length > 0) {
      filterModulesByTags(activeTagIds);
    } else {
      fetchAllModules();
    }
  }, [activeTagIds]);
  
  // Manejadores de eventos
  const handleIconClick = (iconId) => {
    setActiveIcon(iconId);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  // Modificado para manejar tanto nombres como IDs
const handleTagClick = (tagName, tagId) => {
  // Si no se proporciona tagId, intenta encontrarlo
  if (tagId === null && tags) {
    const tagObj = tags.find(t => t.name === tagName);
    if (tagObj) {
      tagId = tagObj.id;
    } else {
      console.warn(`No se encontró el ID para la etiqueta: ${tagName}`);
      return; // No continuar si no hay ID
    }
  }
  
  // Actualizar nombres para la UI
  setActiveTags(prev => 
    prev.includes(tagName) 
      ? prev.filter(name => name !== tagName) 
      : [...prev, tagName]
  );
  
  // Solo actualizar IDs si tenemos un ID válido
  if (tagId !== null) {
    setActiveTagIds(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  }
};
  
  // Manejadores de acciones de administrador
  const handleCreateModule = () => {
    navigate('/education/module-form');
  };
  
  const handleEditModule = () => {
    navigate('/education/module-form');
  };
  
  // Manejadores para modo de eliminación
  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedModules([]);
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
  
  const handleConfirmDelete = async () => {
    if (selectedModules.length === 0) return;
    
    try {
      // Usar la función de eliminación del hook para cada módulo seleccionado
      const deletePromises = selectedModules.map(id => handleDeleteModule(id));
      await Promise.all(deletePromises);
      
      // Actualizar la lista de módulos
      fetchAllModules();
      
      // Salir del modo de eliminación
      setIsDeleteMode(false);
      setSelectedModules([]);
    } catch (error) {
      console.error('Error al eliminar módulos:', error);
    }
  };

  return (
    <EducationLayout
      activeIcon={activeIcon}
      onIconClick={handleIconClick}
      // Modificar esto:
      tags={tags ? tags.map(tag => tag.name) : []} 
      activeTags={activeTags}
      onTagClick={handleTagClick}
      isAdmin={isAdmin}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
    >
      {loadingModules || loadingTags ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Cargando...</p>
        </div>
      ) : modulesError || tagsError ? (
        <div className="bg-red-100 text-red-800 p-4 rounded">
          <p>{modulesError || tagsError}</p>
        </div>
      ) : isDeleteMode ? (
        <>
          <DeleteModeNotice 
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            hasSelected={selectedModules.length > 0}
          />
          
          <ModulesList 
            modules={modules} 
            isAdmin={isAdmin}
            isSelectable={true}
            selectedModules={selectedModules}
            onSelectModule={handleSelectModule}
          />
        </>
      ) : (
        <>
          {/* Filtros (solo visibles fuera del modo de eliminación) */}
          <ModuleFilters 
            tags={tags ? tags.map(tag => tag.name) : []} // Solo pasar nombres de etiquetas para UI
            activeTags={activeTags} 
            onTagClick={(tagName) => {
              // Encuentra el ID correspondiente al nombre
              const tagObj = tags.find(t => t.name === tagName);
              const tagId = tagObj ? tagObj.id : null;
              handleTagClick(tagName, tagId);
            }}
          />
          
          {/* Lista de módulos */}
          <ModulesList 
            modules={modules} 
            isAdmin={isAdmin}
            isSelectable={false}
          />
          
          {/* Botones de administración (modo normal) */}
          {isAdmin && (
            <AdminControlPanel 
              onCreateClick={handleCreateModule}
              onEditClick={handleEditModule}
              onDeleteClick={handleEnterDeleteMode}
            />
          )}
        </>
      )}
    </EducationLayout>
  );
};