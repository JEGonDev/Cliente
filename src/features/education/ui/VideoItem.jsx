import PropTypes from 'prop-types';
import { Play } from 'lucide-react';

/**
 * Componente para mostrar un video en forma de miniatura con botón de reproducción
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.video - Datos del video
 */
export const VideoItem = ({ video }) => {
  if (!video) return null; // O puedes mostrar un mensaje de error o un loader

  const { id, title, thumbnailUrl, duration } = video;
  
  return (
    <div className="relative group">
      {/* Miniatura del video */}
      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
        <img 
          src={thumbnailUrl || "/api/placeholder/300/200"} 
          alt={title}
          className="w-full h-full object-cover" 
        />
        
        {/* Botón de reproducción */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white bg-opacity-70 rounded-full p-3 transform group-hover:scale-110 transition-transform">
            <Play className="w-8 h-8 text-green-700" />
          </div>
        </div>
        
        {/* Duración del video */}
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {duration}
          </div>
        )}
      </div>
      
      {/* Título del video */}
      <h3 className="mt-2 text-sm font-medium">{title || "Video instructivo"}</h3>
    </div>
  );
};

// Validación de propiedades
VideoItem.propTypes = {
  video: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    duration: PropTypes.string
  }).isRequired
};