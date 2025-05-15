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
import { Button } from '../ui/components/Button';

export const EducationPage = () => {
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

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

  useEffect(() => {
    // Carga inicial de módulos y tags
    fetchAllModules().then(all => {
      setFilteredModules(all);
      setAllModules(all); // Guardamos todos los módulos para filtrar localmente
    });
    fetchAllTags();
  }, []);

  // Este useEffect filtra por etiquetas y búsqueda
  useEffect(() => {
    const filterModules = async () => {
      let result = [];
      
      // Si hay etiquetas activas, filtramos por ellas
      if (activeTagIds.length > 0) {
        try {
          result = await filterModulesByTags(activeTagIds);
        } catch (error) {
          console.error('Error al filtrar módulos por etiquetas:', error);
          result = allModules; // En caso de error, usamos todos los módulos
        }
      } else {
        // Sin etiquetas activas, usamos todos los módulos
        result = allModules;
      }
      
      // Filtrar por título si hay un valor de búsqueda
      if (searchValue.trim() !== '') {
        const searchLower = searchValue.toLowerCase();
        result = result.filter(module => 
          module.title && module.title.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredModules(result);
    };
    
    // Solo ejecutamos el filtrado si tenemos módulos cargados
    if (allModules.length > 0) {
      filterModules();
    }
  }, [activeTagIds, searchValue, allModules]);

  const handleIconClick = (iconId) => setActiveIcon(iconId);
  
  // Actualizar función para manejar cambios en la búsqueda
  const handleSearchChange = e => {
    setSearchValue(e.target.value);
  };

  const handleTagClick = (tagId) => {
    // Buscamos el objeto completo para sacar el nombre
    const tagObj = tags.find(t => t.id === tagId);

    if (!tagObj) {
      console.warn("DEBUG - Etiqueta no encontrada para ID:", tagId);
      return;
    }

    const tagName = tagObj.name;
    console.log("DEBUG - Clic en etiqueta:", tagName, "con ID:", tagId);

    // Actualiza nombres (por si los usas para resaltados con texto)
    setActiveTags(prev =>
      prev.includes(tagName)
        ? prev.filter(name => name !== tagName)
        : [...prev, tagName]
    );

    // Actualiza IDs
    setActiveTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleCreateModule = () => navigate('/education/module-form');

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
  const handleConfirmDelete = async () => {
    if (!selectedModules.length) return;
    try {
      await Promise.all(selectedModules.map(id => handleDeleteModule(id)));
      fetchAllModules().then(all => {
        setFilteredModules(all);
        setAllModules(all);
      });
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
      tags={tags || []}
      activeTagIds={activeTagIds}
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
      ) : isEditMode ? (
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              Seleccione el módulo que desea modificar y oprima el botón "Editar seleccionado".
            </p>
          </div>

          <ModulesList
            modules={filteredModules}
            isAdmin={isAdmin}
            isSelectable
            selectedModules={selectedModuleToEdit ? [selectedModuleToEdit] : []}
            onSelectModule={handleSelectModuleForEdit}
          />

          <div className="flex flex-wrap gap-4 mt-8 justify-center">
            <Button variant="white" onClick={handleCancelEdit}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmEdit}
              disabled={!selectedModuleToEdit}
            >
              Editar seleccionado
            </Button>
          </div>
        </>
      ) : isDeleteMode ? (
        <>
          <DeleteModeNotice
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            hasSelected={selectedModules.length > 0}
          />

          <ModulesList
            modules={filteredModules}
            isAdmin={isAdmin}
            isSelectable
            selectedModules={selectedModules}
            onSelectModule={handleSelectModule}
          />
        </>
      ) : (
        <>
          <ModuleFilters
            tags={tags || []}
            activeTagIds={activeTagIds}
            onTagClick={handleTagClick}
          />

          {/* Mostrar mensaje si no hay resultados */}
          {filteredModules.length === 0 && searchValue && (
            <div className="bg-gray-50 text-gray-600 p-4 rounded-md text-center my-4">
              No se encontraron módulos que coincidan con "{searchValue}"
            </div>
          )}

          <ModulesList
            modules={filteredModules}
            isAdmin={isAdmin}
            isSelectable={false}
          />

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