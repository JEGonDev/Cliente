import PropTypes from 'prop-types';
import { PencilIcon, TrashIcon, PlayIcon } from '@heroicons/react/24/outline';

/**
 * Componente para mostrar una lista de videos educativos en formato de cuadrícula
 * Incluye opciones de administración si el usuario es administrador
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.videos - Lista de videos a mostrar
 * @param {boolean} props.isAdmin - Si es administrador se muestran acciones adicionales
 * @param {Function} props.onEdit - Función para editar un video
 * @param {Function} props.onDelete - Función para eliminar un video
 */
export const VideosList = ({
  videos = [],
  isAdmin = false,
  onEdit = () => {},
  onDelete = () => {}
}) => {
  if (!videos || videos.length === 0) {
    return null;
  }

  /**
   * Obtiene URL de miniatura a partir de la URL del video o genera una predeterminada
   * @param {Object} video - Objeto con datos del video
   * @returns {string} URL de la miniatura
   */
  const getThumbnailUrl = (video) => {
    // Si ya hay una URL de miniatura personalizada, usarla
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }

    // Verificar si la URL es de YouTube (youtube.com o youtu.be)
    if (video.videoUrl && (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be'))) {
      // Expresión regular para extraer el ID del video de diferentes formatos de URL
      const match = video.videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      
      if (match && match[1]) {
        // Devolver la URL de la miniatura de YouTube usando el ID extraído
        return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`;
      }
    }

    // Placeholder alternativo en caso de que no se pueda obtener la miniatura
    return 'https://placehold.co/320x180?text=Video';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <div 
          key={video.videoId || video.id}
          className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* Miniatura con overlay de reproducción */}
          <div className="relative aspect-video bg-gray-100">
            <img 
              src={getThumbnailUrl(video)}
              alt={video.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/320x180?text=Video';
              }}
            />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <a 
                href={video.videoUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white bg-opacity-80 p-3 rounded-full"
              >
                <PlayIcon className="w-6 h-6 text-primary" />
              </a>
            </div>
            
            {/* Duración del video (si está disponible) */}
            {video.duration && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            )}
          </div>
          
          {/* Información del video */}
          <div className="p-4">
            <div className="flex justify-between items-start">
              <h3 className="font-medium text-gray-800 mb-2">{video.title}</h3>
              
              {isAdmin && (
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onEdit(video.videoId || video.id)}
                    className="text-gray-500 hover:text-primary transition-colors"
                    title="Editar video"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(video.videoId || video.id)}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    title="Eliminar video"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

VideosList.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      videoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      title: PropTypes.string.isRequired,
      videoUrl: PropTypes.string,
      thumbnailUrl: PropTypes.string,
      duration: PropTypes.string
    })
  ),
  isAdmin: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};