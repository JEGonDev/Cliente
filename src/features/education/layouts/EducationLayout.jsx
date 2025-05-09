import PropTypes from 'prop-types';
import { Header } from '../../../ui/layouts/Header';
import { SidebarLayout } from './SidebarLayout ';
import { FilterSidebarLayout } from './FilterSidebarLayout';
import { SearchFilterBar } from '../ui/SearchFilterBar';

export const EducationLayout = ({
  children,
  activeIcon = 'none',
  onIconClick = () => {},
  tags = [],
  activeTags = [],
  onTagClick = () => {},
  isAdmin = false,
  searchValue = '',
  onSearchChange = () => {}
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <div className="flex flex-1">
        {/* Barra lateral izquierda */}
        <SidebarLayout 
          activeIcon={activeIcon}
          onIconClick={onIconClick}
        />
        
        {/* Contenido principal */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Contenido educativo</h1>
          
          {/* Componente de búsqueda y filtros */}
          <SearchFilterBar 
            searchValue={searchValue}
            onSearchChange={onSearchChange}
            tags={tags}
            activeTags={activeTags}
            onTagClick={onTagClick}
          />
          
          {/* Contenido */}
          {children}
        </main>
        
        {/* Barra lateral derecha de filtros */}
        <FilterSidebarLayout 
          tags={tags}
          activeTags={activeTags}
          onTagClick={onTagClick}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
};

// Validación de propiedades
EducationLayout.propTypes = {
  children: PropTypes.node.isRequired,
  activeIcon: PropTypes.string,
  onIconClick: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.string),
  activeTags: PropTypes.arrayOf(PropTypes.string),
  onTagClick: PropTypes.func,
  isAdmin: PropTypes.bool,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func
};