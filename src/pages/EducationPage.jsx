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
import { TagManagementButtons } from '../features/education/layouts/TagManagementButtons';

/**
 * Componente principal para la página de educación.
 * Gestiona la visualización y manipulación de módulos educativos, incluyendo filtrado por etiquetas y búsqueda por título.
 */
export const EducationPage = () => {
  /**
   * Contexto de autenticación para determinar si el usuario es administrador.
   */
  const { isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  /**
   * Hook personalizado para manejar operaciones relacionadas con módulos.
   */
  const {
    modules,
    loading: loadingModules,
    error: modulesError,
    fetchAllModules,
    handleDeleteModule,
    filterModulesByTags
  } = useModules();

  /**
   * Hook personalizado para manejar operaciones relacionadas con etiquetas.
   */
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

  /**
   * Efecto para cargar los datos iniciales de módulos y etiquetas.
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
   * Efecto para filtrar módulos por etiquetas y búsqueda.
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

  /**
   * Maneja el clic en un ícono de la barra de navegación.
   * @param {string} iconId - ID del ícono seleccionado
   */
  const handleIconClick = (iconId) => setActiveIcon(iconId);

  /**
   * Maneja el cambio en el campo de búsqueda.
   * @param {Object} e - Evento del input
   */
  const handleSearchChange = e => setSearchValue(e.target.value);

  /**
   * Maneja el clic en una etiqueta para activarla o desactivarla.
   * @param {number} tagId - ID de la etiqueta
   */
  const handleTagClick = (tagId) => {
    const tagObj = tags && Array.isArray(tags) ? tags.find(t => t.id === tagId) : null;
    if (!tagObj) {
      console.warn("DEBUG - Etiqueta no encontrada para ID:", tagId);
      return;
    }

    const tagName = tagObj.name;
    console.log("DEBUG - Clic en etiqueta:", tagName, "con ID:", tagId);

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
  };

  /**
   * Redirige al formulario para crear un nuevo módulo.
   */
  const handleCreateModule = () => navigate('/education/module-form');

  /**
   * Activa el modo de edición.
   */
  const handleEnterEditMode = () => {
    setIsEditMode(true);
    setSelectedModuleToEdit(null);
    setIsDeleteMode(false);
  };

  /**
   * Cancela el modo de edición.
   */
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setSelectedModuleToEdit(null);
  };

  /**
   * Selecciona un módulo para editar.
   * @param {number} moduleId - ID del módulo
   */
  const handleSelectModuleForEdit = (moduleId) => {
    setSelectedModuleToEdit(prev => prev === moduleId ? null : moduleId);
  };

  /**
   * Activa el modo de edición desde el panel de control.
   */
  const handleEditModule = () => handleEnterEditMode();

  /**
   * Confirma la edición y redirige al formulario con el módulo seleccionado.
   */
  const handleConfirmEdit = () => {
    if (!selectedModuleToEdit) return;
    navigate(`/education/module-form/${selectedModuleToEdit}`);
    setIsEditMode(false);
    setSelectedModuleToEdit(null);
  };

  /**
   * Activa el modo de eliminación.
   */
  const handleEnterDeleteMode = () => {
    setIsDeleteMode(true);
    setSelectedModules([]);
    setIsEditMode(false);
  };

  /**
   * Cancela el modo de eliminación.
   */
  const handleCancelDelete = () => {
    setIsDeleteMode(false);
    setSelectedModules([]);
  };

  /**
   * Selecciona o deselecciona un módulo para eliminar.
   * @param {number} moduleId - ID del módulo
   */
  const handleSelectModule = (moduleId) => {
    setSelectedModules(prev =>
      prev.includes(moduleId)
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  /**
   * Confirma la eliminación de los módulos seleccionados.
   */
  const handleConfirmDelete = async () => {
    if (!selectedModules.length) return;
    try {
      await Promise.all(selectedModules.map(id => handleDeleteModule(id)));
      const all = await fetchAllModules();
      setAllModules(Array.isArray(all) ? all : []);
      setFilteredModules(Array.isArray(all) ? all : []);
      setIsDeleteMode(false);
      setSelectedModules([]);
    } catch (error) {
      console.error('Error al eliminar módulos:', error);
    }
  };

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

  /**
   * Renderiza la interfaz de la página de educación.
   */
  return (
    <EducationLayout
      activeIcon={activeIcon}
      onIconClick={handleIconClick}
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
          <ModulesList
            modules={filteredModules || []}
            isAdmin={isAdmin}
            isSelectable
            selectedModules={selectedModuleToEdit ? [selectedModuleToEdit] : []}
            onSelectModule={handleSelectModuleForEdit}
          />
          <div
            role="status"
            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4"
          >
            <p className="text-yellow-700 font-semibold mb-2">
              ⚙️ Editar módulo educativo
            </p>
            <p className="text-yellow-700 mb-2">
              Selecciona el módulo que quieres **modificar** y luego pulsa <strong>“Editar seleccionado”</strong>.
            </p>
            <ul className="list-decimal list-inside text-yellow-700">
              <li>Escoge el módulo en la lista.</li>
              <li>Haz clic en <strong>“Editar seleccionado”</strong>.</li>
            </ul>
          </div>
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
          <ModulesList
            modules={filteredModules || []}
            isAdmin={isAdmin}
            isSelectable
            selectedModules={selectedModules}
            onSelectModule={handleSelectModule}
          />
          <DeleteModeNotice
            onCancel={handleCancelDelete}
            onConfirm={handleConfirmDelete}
            hasSelected={selectedModules.length > 0}
          />
        </>
      ) : (
        <>
          {isAdmin && <TagManagementButtons onTagsUpdated={handleTagsUpdated}/>}
          {Array.isArray(tags) && tags.length > 0 && (
            <ModuleFilters
              tags={tags || []}
              activeTagIds={activeTagIds}
              onTagClick={handleTagClick}
            />
          )}
          {Array.isArray(tags) && tags.length === 0 && isAdmin && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
              <p className="text-gray-600 mb-3">No hay etiquetas disponibles. Como administrador, puedes crear etiquetas para categorizar los módulos.</p>
            </div>
          )}
          {filteredModules.length === 0 && searchValue && (
            <div className="bg-gray-50 text-gray-600 p-4 rounded-md text-center my-4">
              No se encontraron módulos que coincidan con "{searchValue}"
            </div>
          )}
          <ModulesList
            modules={filteredModules || []}
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