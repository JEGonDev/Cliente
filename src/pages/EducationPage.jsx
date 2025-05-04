import { useState } from 'react';
import { EducationLayout } from '../../src/features/education/layouts/EducationLayout';
import { ModulesList } from '../../src/features/education/ui/ModulesList';
import { ModuleFilters } from '../../src/features/education/ui/ModuleFilters';

/**
 * Página principal que muestra el contenido educativo.
 * Integra todos los componentes del módulo educativo.
 */
export const EducationPage = () => {
  // Estados para la maquetación (sin lógica real)
  const [activeIcon, setActiveIcon] = useState('none');
  const [searchValue, setSearchValue] = useState('');
  const [tags] = useState(['Principiante', 'Tomate', 'Arracacha', 'Infraestructura', 'Avanzado']);
  const [activeTags, setActiveTags] = useState([]);
  const [modules] = useState([]);
  const [isAdmin] = useState(false); // Cambiar a true para ver controles de admin

  // Manejadores de eventos (sin lógica real)
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
      {/* Filtros responsivos (solo visibles en pantallas pequeñas) */}
      <ModuleFilters 
        tags={tags}
        activeTags={activeTags}
        onTagClick={handleTagClick}
      />
      
      {/* Lista de módulos */}
      <ModulesList modules={modules} />
    </EducationLayout>
  );
};