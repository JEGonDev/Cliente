import { useState } from 'react';
import { EducationLayout } from '../layouts/EducationLayout';
import { AdminModules } from '../ui/AdminModules';
import { ModuleFilters } from '../ui/ModuleFilters';

/**
 * Página de administración de módulos educativos
 * Permite crear, modificar y eliminar módulos
 */
export const AdminModulesPage = () => {
  const [searchValue, setSearchValue] = useState('');
  const [tags] = useState(['Principiante', 'Tomate', 'Arracacha', 'Infraestructura', 'Avanzado']);
  const [activeTags, setActiveTags] = useState([]);
  const [modules] = useState([]); // Simulación de módulos

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleTagClick = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <EducationLayout>
      {/* Filtros */}
      <ModuleFilters 
        searchValue={searchValue} 
        onSearchChange={handleSearchChange} 
        tags={tags} 
        activeTags={activeTags} 
        onTagClick={handleTagClick} 
      />

      {/* Lista de módulos */}
      <AdminModules modules={modules} />
    </EducationLayout>
  );
};
