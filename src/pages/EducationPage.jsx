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
  // Inicializar filteredModules como un array vacío para evitar problemas cuando no hay datos
  const [filteredModules, setFilteredModules] = useState([]);

  useEffect(() => {
    // Cargar datos iniciales y asegurarse de manejar respuestas vacías correctamente
    const loadInitialData = async () => {
      try {
        const allModules = await fetchAllModules();
        // Asegurarse de que filteredModules sea siempre un array, incluso si fetchAllModules devuelve null o undefined
        setFilteredModules(Array.isArray(allModules) ? allModules : []);
      } catch (error) {
        console.error("Error cargando módulos:", error);
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

  useEffect(() => {
    if (activeTagIds.length > 0) {
      console.log('DEBUG - Aplicando filtro por etiquetas, IDs:', activeTagIds);
      filterModulesByTags(activeTagIds)
        .then(filtered => {
          console.log('DEBUG - Resultado del filtrado:', filtered);
          // Asegurarse de que filtered sea siempre un array
          setFilteredModules(Array.isArray(filtered) ? filtered : []);
        })
        .catch(error => {
          console.error('DEBUG - Error al filtrar módulos:', error);
          setFilteredModules([]);
        });
    } else {
      // Sin filtros, mostrar todos los módulos
      fetchAllModules()
        .then(all => {
          // Asegurarse de que all sea siempre un array
          setFilteredModules(Array.isArray(all) ? all : []);
        })
        .catch(error => {
          console.error("Error recargando módulos:", error);
          setFilteredModules([]);
        });
    }
  }, [activeTagIds]);

  const handleIconClick = (iconId) => setActiveIcon(iconId);
  const handleSearchChange = e => setSearchValue(e.target.value);

  const handleTagClick = (tagId) => {
    // Buscamos el objeto completo para sacar el nombre
    const tagObj = tags && Array.isArray(tags) ? tags.find(t => t.id === tagId) : null;

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
        setFilteredModules(Array.isArray(all) ? all : []);
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
      // Asegurarse de que tags sea siempre un array
      tags={Array.isArray(tags) ? tags : []}
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
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-6">
          <p className="text-center">No hay módulos disponibles para mostrar</p>

          {/* Añadir los botones de administración incluso cuando hay error */}
          {isAdmin && (
            <div className="mt-8">
              <AdminControlPanel
                onCreateClick={handleCreateModule}
                onEditClick={handleEditModule}
                onDeleteClick={handleEnterDeleteMode}
              />
            </div>
          )}
        </div>
      ) : isEditMode ? (
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              Seleccione el módulo que desea modificar y oprima el botón "Editar seleccionado".
            </p>
          </div>

          <ModulesList
            modules={modules || []}
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
            modules={modules || []}
            isAdmin={isAdmin}
            isSelectable
            selectedModules={selectedModules}
            onSelectModule={handleSelectModule}
          />
        </>
      ) : (
        <>
          {/* Filtros de módulos (mostrar solo si hay etiquetas) */}
          {Array.isArray(tags) && tags.length > 0 && (
            <ModuleFilters
              tags={tags || []}
              activeTagIds={activeTagIds}
              onTagClick={handleTagClick}
            />
          )}

          {/* Estado vacío para tags */}
          {Array.isArray(tags) && tags.length === 0 && isAdmin && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <p className="text-gray-600 mb-3">No hay etiquetas disponibles. Como administrador, puedes crear etiquetas para categorizar los módulos.</p>
            </div>
          )}

          {/* Lista de módulos (siempre se muestra, incluso vacía) */}
          <ModulesList
            modules={filteredModules || []}
            isAdmin={isAdmin}
            isSelectable={false}
          />

          {/* Panel de administración (siempre visible para administradores) */}
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