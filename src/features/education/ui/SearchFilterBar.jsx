import PropTypes from 'prop-types';
import { SearchBar } from './SearchBar';
import { ModuleFilters } from './ModuleFilters';

export const SearchFilterBar = ({
  searchValue = '',
  onSearchChange = () => {},
  tags = [],
  activeTags = [],
  onTagClick = () => {}
}) => {
  return (
    <div className="mb-6">
      {/* Barra de búsqueda */}
      <div className="mb-4">
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          placeholder="Buscar módulos educativos"
        />
      </div>
      
      {/* Filtro móvil (visible solo en pantallas pequeñas) */}
      <div className="lg:hidden mb-4">
        <button className="w-full bg-green-900 text-white p-2 rounded-md flex items-center justify-center text-sm">
          <span>Filtrar módulos</span>
        </button>
      </div>
      
      {/* Filtros horizontales (solo en vistas móviles/medias) */}
      <div className="md:block lg:hidden">
        <ModuleFilters
          tags={tags}
          activeTags={activeTags}
          onTagClick={onTagClick}
        />
      </div>
    </div>
  );
};

SearchFilterBar.propTypes = {
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  tags: PropTypes.arrayOf(PropTypes.string),
  activeTags: PropTypes.arrayOf(PropTypes.string),
  onTagClick: PropTypes.func
};