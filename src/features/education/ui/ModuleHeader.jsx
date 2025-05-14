import PropTypes from 'prop-types';
import { ModuleContentStats } from '../layouts/ModuleContentStats';

/**
 * Componente que encapsula el encabezado de un módulo educativo
 * Muestra título, descripción, etiquetas y estadísticas del módulo
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
  /**
   * Procesa las etiquetas para asegurar un formato consistente
   * @returns {Array} Lista de etiquetas procesadas
   */
  const processedTags = () => {
    if (!tags) return [];
    
    // Si ya es un array, lo devolvemos
    if (Array.isArray(tags)) {
      // Si es un array de strings, lo devolvemos directamente
      if (tags.length === 0 || typeof tags[0] === 'string') {
        return tags;
      }
      
      // Si es un array de objetos, verificamos su formato
      if (typeof tags[0] === 'object') {
        return tags;
      }
    }
    
    // Si no es un array o no tiene el formato esperado, devolvemos array vacío
    return [];
  };

  return (
    <div className="mb-8">
      <ModuleContentStats
        title={title}
        description={description}
        tags={processedTags()}
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