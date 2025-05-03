import { Play } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Componente para mostrar un video en la vista de detalle de módulo
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.video - Datos del video
 * @param {boolean} props.isAdmin - Indica si se muestra en modo administrador
 */
export const VideoItem = ({ video, isAdmin = false }) => {
  return (
    <div className="relative mb-4">
      <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
        <img 
          src={video.thumbnail || "/api/placeholder/300/200"} 
          alt={video.title}
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white bg-opacity-70 rounded-full p-3">
            <Play className="w-8 h-8 text-green-700" />
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-sm">{video.title || "Video instructivo"}</p>
      
      {isAdmin && (
        <div className="mt-1 flex gap-2">
          <button className="text-xs text-blue-600 hover:underline">Editar</button>
          <button className="text-xs text-red-600 hover:underline">Eliminar</button>
        </div>
      )}
    </div>
  );
};
//validacion de Props
VideoItem.propTypes = {
  video: PropTypes.shape({
    title: PropTypes.string,
    thumbnail: PropTypes.string,
    // ... añade aquí otras propiedades que tenga tu objeto 'video'
  }).isRequired,
  isAdmin: PropTypes.bool,
};