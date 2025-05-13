import PropTypes from 'prop-types';
import { ModuleContentStats } from './ModuleContentStats';

/**
 * Componente que encapsula el encabezado de un módulo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del módulo
 * @param {string} props.description - Descripción del módulo
 * @param {Array} props.tags - Etiquetas del módulo (pueden ser strings u objetos)
 * @param {number} props.videoCount - Número de videos
 * @param {number} props.articleCount - Número de artículos
 * @param {number} props.guideCount - Número de guías
 */
export const ModuleHeader = ({ 
  title,
  description,
  tags = [],
  videoCount = 0, 
  articleCount = 0, 
  guideCount = 0 
}) => {
  // Procesamos las etiquetas para que siempre sean un formato uniforme
  const processedTags = tags ? (
    Array.isArray(tags) ? tags : []
  ) : [];

  return (
    <div className="mb-8">
      <ModuleContentStats
        title={title}
        description={description}
        tags={processedTags}
        videoCount={videoCount}
        articleCount={articleCount}
        guideCount={guideCount}
      />
    </div>
  );
};

ModuleHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  tags: PropTypes.array,
  videoCount: PropTypes.number,
  articleCount: PropTypes.number,
  guideCount: PropTypes.number
};