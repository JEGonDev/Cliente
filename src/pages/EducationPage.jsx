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
  
  // Manejadores de eventos y lógica de administración...
  // (código abreviado para mayor claridad)
  
  return (
    <EducationLayout
      activeIcon={activeIcon}
      onIconClick={handleIconClick}
      tags={tags.map(tag => tag.name)}
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
      ) : (
        // Render condicional basado en modo de eliminación
        // Componentes de UI conectados a datos reales
      )}
    </EducationLayout>
  );
};