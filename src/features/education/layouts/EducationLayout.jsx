import PropTypes from 'prop-types';
import { Header } from '../../../ui/layouts/Header';
import { SidebarLayout } from './SidebarLayout';
import { FilterSidebarLayout } from './FilterSidebarLayout';
import { SearchBar } from '../ui/SearchBar';

/**
 * Layout principal para el módulo educativo.
 * Integra header, sidebar, contenido y filtros.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido principal
 * @param {string} props.activeIcon - Icono activo en la barra lateral
 * @param {Function} props.onIconClick - Función para manejar clic en iconos
 * @param {Array} props.tags - Lista de etiquetas disponibles
 * @param {Array} props.activeTags - Lista de etiquetas activas
 * @param {Function} props.onTagClick - Función para manejar clic en etiquetas
 * @param {boolean} props.isAdmin - Indica si el usuario es administrador
 * @param {string} props.searchValue - Valor actual de la búsqueda
 * @param {Function} props.onSearchChange - Función para manejar cambios en la búsqueda
 */
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
          
          {/* Contenido */}
          {children}
          
          {/* Botones de administración (solo para admin) */}
          {isAdmin && (
            <div className="flex flex-wrap gap-4 mt-8 justify-center">
              <button 
                className="bg-green-900 text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Crear módulo
              </button>
              
              <button 
                className="bg-green-900 text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Modificar módulo
              </button>
              
              <button 
                className="bg-green-900 text-white px-8 py-3 rounded-md text-lg font-medium"
              >
                Eliminar módulo
              </button>
            </div>
          )}
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