import PropTypes from 'prop-types';
import { SearchFilterBar } from '../ui/SearchFilterBar';
import { BarIcons } from '../../../ui/components/BarIcons';

/**
 * Layout principal para las páginas del módulo educativo
 */
export const EducationLayout = ({
  children,
  activeIcon = 'none',
  onIconClick = () => { },
  tags = [],
  activeTags = [],
  onTagClick = () => { },
  isAdmin = false,
  searchValue = '',
  onSearchChange = () => { }
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        {/* Barra lateral izquierda */}
        <BarIcons activeSection={activeIcon} onIconClick={onIconClick} />

        {/* Contenido principal */}
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto mb-6">
            {/* Título y subtítulo */}
            <div>
              <h1
                className="text-4xl font-extrabold tracking-tight font-poppins mb-4"
                style={{
                  background: 'linear-gradient(135deg, #23582a 0%, #059669 50%, #10b981 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                Contenido Educativo
              </h1>
              <p className="text-gray-600 text-lg font-inter mb-4">
                Descubre y gestiona tu biblioteca de aprendizaje
              </p>
            </div>

            {/* Componente de búsqueda y filtros */}
            <SearchFilterBar
              searchValue={searchValue}
              onSearchChange={onSearchChange}
              tags={tags}
              activeTags={activeTags}
              onTagClick={onTagClick}
            />
          </div>

          {/* Contenido */}
          {children}
        </main>
      </div>
    </div>
  );
};

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
