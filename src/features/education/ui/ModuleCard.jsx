import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * Componente que representa una tarjeta de módulo educativo.
 * Muestra información como título, etiquetas y contadores de contenido.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - Identificador único del módulo
 * @param {string} propas.title - Título del módulo
 * @param {Array} props.tags - Etiquetas del módulo
 * @param {number} props.videosCount - Número de videos
 * @param {number} props.articlesCount - Número de artículos
 * @param {number} props.guidesCount - Número de guías
 */
export const ModuleCard = ({ 
  id,
  title, 
  tags,
  videosCount,
  articlesCount,
  guidesCount
}) => {
  return (
    <Link to={`/education/module/${id}`} className="block">
      <div className="bg-white p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow">
        {/* Título del módulo */}
        <h3 className="font-medium mb-2 text-base">{title}</h3>
        
        {/* Etiquetas */}
        <div className="flex flex-wrap gap-1 mb-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Contadores */}
        <div className="text-xs text-gray-600 flex gap-1">
          <span>{videosCount} Videos</span>
          <span>-</span>
          <span>{articlesCount} Artículos</span>
          <span>-</span>
          <span>{guidesCount} Guías</span>
        </div>
      </div>
    </Link>
  );
};

// Validación de propiedades
ModuleCard.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string),
  videosCount: PropTypes.number,
  articlesCount: PropTypes.number,
  guidesCount: PropTypes.number
};