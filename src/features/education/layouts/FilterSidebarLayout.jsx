import PropTypes from 'prop-types';
import { FilterTag } from '../ui/FilterTag';

/**
 * Layout que representa la barra lateral derecha con filtros.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.tags - Lista de etiquetas disponibles (strings u objetos)
 * @param {Array} props.activeTags - Lista de etiquetas activas
 * @param {Function} props.onTagClick - Función que se ejecuta al hacer clic en una etiqueta
 * @param {boolean} props.isAdmin - Indica si el usuario es administrador
 */
export const FilterSidebarLayout = ({
  tags = [],
  activeTags = [],
  onTagClick = () => {},
  isAdmin = false
}) => {
  // Función para obtener el nombre de una etiqueta
  const getTagName = (tag) => {
    if (typeof tag === 'string') return tag;
    if (tag && typeof tag === 'object' && tag.name) return tag.name;
    return '';
  };

  return (
    <aside className="w-64 p-4 hidden lg:block">
      <div className="space-y-2">
        {tags.length > 0 ? (
          tags.map((tag, index) => (
            <FilterTag
              key={`sidebar-tag-${index}-${getTagName(tag)}`}
              tag={tag}
              active={activeTags.includes(getTagName(tag))}
              onClick={onTagClick}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 italic">No hay etiquetas disponibles</p>
        )}
      </div>
      
      {isAdmin && (
        <div className="mt-8 space-y-2">
          <button className="bg-green-900 text-white w-full py-2 px-4 rounded-md text-sm">
            Crear etiqueta
          </button>
          
          <button className="bg-green-900 text-white w-full py-2 px-4 rounded-md text-sm">
            Modificar etiqueta
          </button>
          
          <button className="bg-green-900 text-white w-full py-2 px-4 rounded-md text-sm">
            Eliminar etiqueta
          </button>
        </div>
      )}
    </aside>
  );
};