import PropTypes from 'prop-types';
import { Header } from '../../../ui/layouts/Header';
import { SidebarLayout } from './SidebarLayout ';
import { SearchFilterBar } from '../ui/SearchFilterBar';

/**
 * Layout principal para las páginas del módulo educativo
 * 
 * Este componente proporciona una estructura consistente para todas las vistas
 * del módulo educativo, incluyendo la barra lateral, encabezados y búsqueda.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido principal a mostrar
 * @param {string} props.activeIcon - Icono activo en la barra lateral
 * @param {Function} props.onIconClick - Función para manejar clics en iconos
 * @param {Array} props.tags - Lista de etiquetas disponibles
 * @param {Array} props.activeTags - Lista de etiquetas activas
 * @param {Function} props.onTagClick - Función para manejar clics en etiquetas
 * @param {boolean} props.isAdmin - Si el usuario es administrador
 * @param {string} props.searchValue - Valor actual de búsqueda
 * @param {Function} props.onSearchChange - Función para manejar cambios en búsqueda
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