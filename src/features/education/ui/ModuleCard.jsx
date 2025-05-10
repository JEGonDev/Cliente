import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const ModuleCard = ({ 
  id,
  title, 
  tags = [],
  videosCount = 0,
  articlesCount = 0,
  guidesCount = 0,
  isAdmin = false
}) => {
  return (
    <Link to={`/education/module/${id}`} className="block">
      <div className={`p-4 rounded-sm shadow-md hover:shadow-lg transition-shadow 
        ${isAdmin ? 'bg-green-50 border border-green-100' : 'bg-white'}`}>
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
        
        {/* Contadores de contenido reales */}
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