import { useState, useEffect } from 'react';
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';
import { useVideos } from '../hooks/useVideos';

/**
 * Modal con formulario para crear o editar un video
 * 
 * Genera vista previa embebida de YouTube o Vimeo.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {string|number} props.moduleId - ID del módulo asociado
 * @param {string|number|null} [props.videoId=null] - ID del video para edición
 * @param {Function} props.onSuccess - Callback tras guardar exitosamente
 */
export const VideoFormModal = ({ 
  isOpen, 
  onClose, 
  moduleId, 
  videoId = null,
  onSuccess 
}) => {
  const { 
    formData, 
    formErrors, 
    loading, 
    loadVideoForEdit,
    handleChange, 
    setModuleId,
    handleCreateVideo, 
    handleUpdateVideo 
  } = useVideos();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const isEditing = !!videoId;

  // Establecer el moduleId al abrir el modal
  useEffect(() => {
    if (isOpen && moduleId) {
      setModuleId(moduleId);
    }
  }, [isOpen, moduleId, setModuleId]);
  
  // Cargar datos del video para edición
  useEffect(() => {
    let isMounted = true;
    
    if (isOpen && isEditing && videoId) {
      loadVideoForEdit(videoId)
        .then(video => {
          // Solo actualizar si el componente sigue montado
          if (!isMounted) return;
          
          // Generar vista previa para la URL del video si existe
          if (video && video.videoUrl) {
            setPreviewUrl(getEmbedUrl(video.videoUrl));
          }
        })
        .catch(error => {
          if (isMounted) {
            console.error(`Error al cargar el video para editar:`, error);
          }
        });
    } else {
      setPreviewUrl('');
    }
    
    // Función de limpieza
    return () => {
      isMounted = false;
    };
  }, [isOpen, isEditing, videoId, loadVideoForEdit]);
  
  // Cuando cambia la URL del video, actualizar la vista previa
  useEffect(() => {
    if (formData.videoUrl) {
      setPreviewUrl(getEmbedUrl(formData.videoUrl));
    }
  }, [formData.videoUrl]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      if (isEditing) {
        result = await handleUpdateVideo(videoId, e);
      } else {
        result = await handleCreateVideo(e);
      }
      
      if (result) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar video:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Función para convertir URL normal a URL de incorporación
  const getEmbedUrl = (url) => {
    if (!url) return '';
    
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }
    
    // Vimeo
    const vimeoRegex = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/;
    const vimeoMatch = url.match(vimeoRegex);
    
    if (vimeoMatch && vimeoMatch[2]) {
      return `https://player.vimeo.com/video/${vimeoMatch[2]}`;
    }
    
    return '';
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Video" : "Agregar Nuevo Video"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Errores de formulario */}
        {Object.keys(formErrors).length > 0 && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            <ul className="list-disc list-inside">
              {Object.values(formErrors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* Campo de título */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título del video
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
        </div>
        
        {/* Campo de URL */}
        <div>
          <label htmlFor="videoUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL del video
          </label>
          <input
            type="url"
            id="videoUrl"
            name="videoUrl"
            value={formData.videoUrl || ''}
            onChange={handleChange}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Introduzca la URL de YouTube o Vimeo.
          </p>
        </div>
        
        {/* Vista previa del video */}
        {previewUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vista previa
            </label>
            <div className="aspect-video w-full">
              <iframe 
                src={previewUrl} 
                className="w-full h-full rounded-md"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Vista previa del video"
              ></iframe>
            </div>
          </div>
        )}
        
        {/* Botones de acción */}
        <div className="flex justify-end gap-2 pt-4">
          <Button 
            variant="white" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            type="submit"
            disabled={isSubmitting || loading}
          >
            {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};