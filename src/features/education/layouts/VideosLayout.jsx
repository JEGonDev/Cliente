import PropTypes from 'prop-types';
import { VideoItem } from './../ui/VideoItem';

/**
 * Sección que muestra videos del módulo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.videos - Lista de videos a mostrar
 */
export const VideosLayout = ({ videos = [] }) => {
  // Si no hay videos, mostrar una sección vacía
  if (videos.length === 0) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4">Videos</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(video => (
          <VideoItem key={video.id} video={video} />
        ))}
      </div>
    </section>
  );
};

// Validación de propiedades
VideosLayout.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string,
      thumbnailUrl: PropTypes.string,
      duration: PropTypes.string
    })
  )
};