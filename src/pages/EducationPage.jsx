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
  const [activeTags, setActiveTags] = useState([]);
  
  // Estado para modo de eliminación
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  
  // Cargar módulos y etiquetas al montar el componente
  useEffect(() => {
    fetchAllModules();
    fetchAllTags();
  }, []);
  
  // Filtrar módulos cuando cambian las etiquetas activas
  useEffect(() => {
    if (activeTags.length > 0) {
      filterModulesByTags(activeTags);
    } else {
      fetchAllModules();
    }
  }, [activeTags]);
  
  // Manejadores de eventos
  const handleIconClick = (iconId) => {
    setActiveIcon(iconId);
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleTagClick = (tag) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
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
      tags={tags?.map(tag => tag.name) || []}
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
            tags={tags?.map(tag => tag.name) || []}
            activeTags={activeTags}
            onTagClick={handleTagClick}
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