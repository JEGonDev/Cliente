import PropTypes from 'prop-types';
import { Book, Video, FileText } from 'lucide-react';

/**
 * Componente que muestra estadísticas del contenido del módulo (videos, artículos, guías)
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.videoCount - Número de videos
 * @param {number} props.articleCount - Número de artículos
 * @param {number} props.guideCount - Número de guías
 */
export const ModuleContentStats = ({ 
  videoCount = 0, 
  articleCount = 0, 
  guideCount = 0 
}) => {
  return (
    <div className="flex flex-wrap gap-6 my-6 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <Video className="h-4 w-4 text-green-700" />
        <span>{videoCount} Videos</span>
      </div>
      
      <div className="flex items-center gap-1">
        <FileText className="h-4 w-4 text-blue-600" />
        <span>{articleCount} Artículos</span>
      </div>
      
      <div className="flex items-center gap-1">
        <Book className="h-4 w-4 text-orange-500" />
        <span>{guideCount} Guías</span>
      </div>
    </div>
  );
};

// Validación de propiedades
ModuleContentStats.propTypes = {
  videoCount: PropTypes.number,
  articleCount: PropTypes.number,
  guideCount: PropTypes.number
};