import PropTypes from 'prop-types';
import { Book, Video, FileText } from 'lucide-react';

/**
 * Componente que muestra las estadísticas de contenido de un módulo
 */
export const ModuleContentStats = ({
  title = '',
  description = '',
  tags = [],
  videoCount = 0,
  articleCount = 0,
  guideCount = 0
}) => {
  const getTagName = (tag) => {
    if (typeof tag === 'string') return tag;
    if (tag && typeof tag === 'object' && tag.name) return tag.name;
    return '';
  };

  return (
    <div className="mb-8 animate-fade-in-up transition-all duration-500 ease-out">
      <h1 className="text-2xl font-bold font-Poppins mb-4 text-gray-800 tracking-tight transition-all duration-300">{title}</h1>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tags.map((tag, idx) => {
            const tagName = getTagName(tag);
            if (!tagName) return null;

            return (
              <span
                key={`tag-${idx}-${tagName}`}
                className="text-sm bg-gray-100 text-gray-800 px-2 py-1 rounded-full transition-all duration-300 hover:scale-105 hover:bg-gray-200"
              >
                #{tagName}
              </span>
            );
          })}
        </div>
      )}

      {description && (
        <p className="text-gray-700 mb-6 text-sm leading-relaxed transition-opacity duration-300 opacity-90">
          {description}
        </p>
      )}

      <div className="flex flex-wrap gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <Video className="h-4 w-4 text-green-700" />
          <span className="font-medium font-inter">{videoCount} Videos</span>
        </div>

        <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <FileText className="h-4 w-4 text-blue-600" />
          <span className="font-medium font-inter">{articleCount} Artículos</span>
        </div>

        <div className="flex items-center gap-2 transition-transform duration-300 hover:scale-105">
          <Book className="h-4 w-4 text-orange-500" />
          <span className="font-medium font-inter">{guideCount} Guías</span>
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
