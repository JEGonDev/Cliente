import PropTypes from 'prop-types';
import { VideoItem } from './../ui/VideoItem';
import { Button } from '../../../ui/components/Button';

export const VideosLayout = ({ 
  videos = [],
  isAdmin = false,
  onAddVideo = () => {},
  onEditVideo = () => {},
  onDeleteVideo = () => {}
}) => {
  // Si no hay videos y no es administrador, no mostrar nada
  if (videos.length === 0 && !isAdmin) {
    return null;
  }
  
  return (
    <section className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Videos</h2>
        
        {isAdmin && (
          <div className="flex gap-2">
            <Button 
              variant="primary" 
              size="sm" 
              onClick={onAddVideo}
            >
              Agregar
            </Button>
            
            {videos.length > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={onEditVideo}
                >
                  Editar
                </Button>
                
                <Button 
                  variant="danger" 
                  size="sm" 
                  onClick={onDeleteVideo}
                >
                  Eliminar
                </Button>
              </>
            )}
          </div>
        )}
      </div>
      
      {videos.length === 0 ? (
        <p className="text-gray-500 italic">No hay videos disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map(video => (
            <VideoItem key={video.id} video={video} />
          ))}
        </div>
      )}
    </section>
  );
};