import PropTypes from 'prop-types';

/**
 * Componente que muestra contadores de contenido educativo (videos, artículos, guías).
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.videos - Número de videos
 * @param {number} props.articles - Número de artículos
 * @param {number} props.guides - Número de guías
 */
export const ContentCounter = ({ 
  videos = 0, 
  articles = 0, 
  guides = 0 
}) => {
  return (
    <div className="text-sm text-gray-600 flex gap-3">
      <span>{videos} Videos</span>
      <span>-</span>
      <span>{articles} Artículos</span>
      <span>-</span>
      <span>{guides} Guías</span>
    </div>
  );
};

// Validación de propiedades
ContentCounter.propTypes = {
  videos: PropTypes.number,
  articles: PropTypes.number,
  guides: PropTypes.number
};