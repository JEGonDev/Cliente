import { useState, useContext } from 'react';
import { EducationLayout } from '../features/education/layouts/EducationLayout';
import { ModulesList } from '../features/education/ui/ModulesList';
import { ModuleFilters } from '../features/education/ui/ModuleFilters';
import { AuthContext } from '../features/authentication/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/components/Button'; // Importar nuestro nuevo componente

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
      {/* Mensaje de instrucción para modo de eliminación */}
      {isDeleteMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            Seleccione los módulos que desea eliminar y oprima el botón "Eliminar seleccionados".
          </p>
        </div>
      )}
      
      {/* Filtros (solo visibles fuera del modo de eliminación) */}
      {!isDeleteMode && (
        <ModuleFilters 
          tags={tags}
          activeTags={activeTags}
          onTagClick={handleTagClick}
        />
      )}
      
      {/* Lista de módulos */}
      <ModulesList 
        modules={modules} 
        isAdmin={isAdmin}
        isSelectable={isDeleteMode}
        selectedModules={selectedModules}
        onSelectModule={handleSelectModule}
      />
      
      {/* Botones de administración (modo normal) */}
      {isAdmin && !isDeleteMode && (
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Button 
            variant="primary"
            size="lg"
            onClick={handleCreateModule}
          >
            Crear módulo
          </Button>
          
          <Button 
            variant="primary"
            size="lg"
            onClick={handleEditModule}
          >
            Modificar módulo
          </Button>
          
          <Button 
            variant="primary"
            size="lg"
            onClick={handleEnterDeleteMode}
          >
            Eliminar módulo
          </Button>
        </div>
      )}
      
      {/* Botones para confirmar/cancelar eliminación (modo eliminación) */}
      {isAdmin && isDeleteMode && (
        <div className="flex flex-wrap gap-4 mt-8 justify-center">
          <Button 
            variant="white"
            onClick={handleCancelDelete}
          >
            Cancelar
          </Button>
          
          <Button 
            variant="danger"
            onClick={handleConfirmDelete}
            disabled={selectedModules.length === 0}
          >
            Eliminar seleccionados
          </Button>
        </div>
      )}
    </EducationLayout>
  );
};