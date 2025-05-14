import PropTypes from 'prop-types';
import { Book, Video, FileText } from 'lucide-react';

/**
 * Componente que muestra las estadísticas de contenido de un módulo
 * Incluye título, etiquetas, descripción y contadores de recursos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del módulo
 * @param {string} props.description - Descripción del módulo
 * @param {Array} props.tags - Etiquetas del módulo (pueden ser strings u objetos con {id, name})
 * @param {number} props.videoCount - Número de videos
 * @param {number} props.articleCount - Número de artículos
 * @param {number} props.guideCount - Número de guías
 */
export const ModuleContentStats = ({
  title = '',
  description = '',
  tags = [],
  videoCount = 0,
  articleCount = 0,
  guideCount = 0
}) => {
  /**
   * Obtiene el nombre de la etiqueta dependiendo de si es un objeto o string
   * @param {string|Object} tag - Etiqueta (string u objeto con propiedad name)
   * @returns {string} Nombre de la etiqueta
   */
  const getTagName = (tag) => {
    if (typeof tag === 'string') return tag;
    if (tag && typeof tag === 'object' && tag.name) return tag.name;
    return '';
  };

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => {
            const tagName = getTagName(tag);
            if (!tagName) return null;
            
            return (
              <span 
                key={`tag-${idx}-${tagName}`}
                className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full"
              >
                #{tagName}
              </span>
            );
          })}
        </div>
      )}

      {description && <p className="text-gray-700 mb-6">{description}</p>}

      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
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
    </div>
  );
};

ModuleContentStats.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
  videoCount: PropTypes.number,
  articleCount: PropTypes.number,
  guideCount: PropTypes.number
};