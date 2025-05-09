import { useState, useContext } from 'react';
import { EducationLayout } from '../features/education/layouts/EducationLayout';
import { ModulesList } from '../features/education/ui/ModulesList';
import { ModuleFilters } from '../features/education/ui/ModuleFilters';
import { AuthContext } from '../features/authentication/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AdminControlPanel } from '../features/education/ui/AdminControlPanel'; 
import { DeleteModeNotice } from '../features/education/ui/DeleteModeNotice';

export const EducationPage = () => {
  // Obtener información de autenticación y roles
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Estados para la interfaz
  const [activeIcon, setActiveIcon] = useState('none');
  const [searchValue, setSearchValue] = useState('');
  const [tags] = useState(['Principiante', 'Tomate', 'Arracacha', 'Infraestructura', 'Avanzado']);
  const [activeTags, setActiveTags] = useState([]);
  const [modules] = useState([]);
  
  // Estado para modo de eliminación
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  
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
    
    // Lógica de eliminación
    console.log('Eliminando módulos:', selectedModules);
    alert(`Se eliminarían los módulos: ${selectedModules.join(', ')}`);
    
    // Salir del modo de eliminación
    setIsDeleteMode(false);
    setSelectedModules([]);
  };

  return (
    <EducationLayout
      activeIcon={activeIcon}
      onIconClick={handleIconClick}
      tags={tags}
      activeTags={activeTags}
      onTagClick={handleTagClick}
      isAdmin={isAdmin}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
    >
      {/* Modo de eliminación */}
      {isDeleteMode ? (
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
            tags={tags}
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