import PropTypes from 'prop-types';
import { FilterTag } from './FilterTag';
import { SearchBar } from './SearchBar';

/**
 * Componente para mostrar y gestionar filtros de módulos educativos.
 */
export const ModuleFilters = ({
  availableTags,
  activeTags,
  onTagToggle,
  onSearch,
  isAdmin,
}) => {
  return (
    <div className="mt-2 sm:mt-4">
      <div className="mb-3 sm:mb-4">
        <SearchBar
          value=""
          onChange={() => {}}
          placeholder="Buscar módulos educativos"
        />
      </div>

      <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4 mb-3 sm:mb-4">
        <span className="self-center mr-1 sm:mr-2 text-xs sm:text-sm font-medium">Filtrar:</span>
        {(availableTags || []).map((tag) => (
          <FilterTag
            key={tag}
            text={tag}
            active={(activeTags || []).includes(tag)}
            onClick={() => {}}
          />
        ))}
      </div>

      {isAdmin && (
        <div className="flex flex-wrap gap-2 mt-4 sm:mt-6">
          <button className="bg-green-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-green-800 transition-colors text-xs sm:text-sm">
            Crear etiqueta
          </button>
          <button className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-blue-700 transition-colors text-xs sm:text-sm">
            Modificar etiqueta
          </button>
          <button className="bg-red-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-md hover:bg-red-700 transition-colors text-xs sm:text-sm">
            Eliminar etiqueta
          </button>
        </div>
      )}
    </div>
  );
};

// Validación de props
ModuleFilters.propTypes = {
  availableTags: PropTypes.arrayOf(PropTypes.string),
  activeTags: PropTypes.arrayOf(PropTypes.string),
  onTagToggle: PropTypes.func,
  onSearch: PropTypes.func,
  isAdmin: PropTypes.bool,
};

// Valores por defecto
ModuleFilters.defaultProps = {
  availableTags: [],
  activeTags: [],
  onTagToggle: () => {},
  onSearch: () => {},
  isAdmin: false,
};
