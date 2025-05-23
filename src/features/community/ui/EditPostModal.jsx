import { useState, useEffect } from 'react';
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';
import { communityService } from '../services/communityService';
import { Film, Image, Upload, X } from 'lucide-react';

export const EditPostModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  post
}) => {
  const [formData, setFormData] = useState({
    postType: 'general',
    content: ''
  });
  
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [keepExistingMedia, setKeepExistingMedia] = useState(true);
  const [isVideo, setIsVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Determinar si el contenido multimedia original es un video
  const isOriginalVideo = post && post.multimediaContent && (
    post.multimediaContent.endsWith('.mkv') || 
    post.multimediaContent.endsWith('.mp4') || 
    post.multimediaContent.endsWith('.webm') || 
    post.multimediaContent.includes('video') ||
    post.multimediaContent.includes('.mkv?') ||
    post.multimediaContent.includes('.mp4?') ||
    post.multimediaContent.includes('.webm?')
  );

  // Cargar los datos de la publicación al abrir el modal
  useEffect(() => {
    if (post && isOpen) {
      setFormData({
        postType: post.postType || post.post_type || 'general',
        content: post.content || ''
      });
      
      setKeepExistingMedia(!!post.multimediaContent);
      setIsVideo(isOriginalVideo);
    }
    
    // Limpiar al cerrar el modal
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [post, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    // Limpiar preview anterior
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    
    // Verificar si el archivo es un video
    const isVideoFile = 
      selectedFile.type.startsWith('video/') ||
      selectedFile.name.endsWith('.mkv') ||
      selectedFile.name.endsWith('.mp4') ||
      selectedFile.name.endsWith('.webm');
    
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile));
    setIsVideo(isVideoFile);
    setKeepExistingMedia(false);
  };
  
  const handleRemoveFile = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview);
    }
    setFile(null);
    setFilePreview(null);
    setKeepExistingMedia(false);
  };
  
  const toggleKeepExistingMedia = () => {
    setKeepExistingMedia(!keepExistingMedia);
    
    // Si quitamos el contenido existente, limpiar también cualquier nuevo archivo
    if (keepExistingMedia) {
      handleRemoveFile();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      let payload;
      
      // Si hay un nuevo archivo o si queremos quitar el contenido multimedia
      if (file || !keepExistingMedia) {
        // Usar FormData para poder enviar archivos
        payload = new FormData();
        
        // Añadir los datos básicos
        payload.append('postType', formData.postType);
        payload.append('content', formData.content);
        
        // Añadir el archivo si existe uno nuevo
        if (file) {
          payload.append('file', file);
        }
        
        // Si queremos eliminar el contenido, enviar un campo especial
        // (Esto depende de cómo esté implementado el backend)
        if (!keepExistingMedia && !file) {
          payload.append('removeMultimedia', 'true');
        }
      } else {
        // Si solo cambiamos texto y mantenemos el contenido multimedia, enviamos un objeto normal
        payload = {
          postType: formData.postType,
          content: formData.content
        };
      }
      
      // Actualizar la publicación a través del servicio
      const updatedPost = await communityService.updatePost(post.id || post.post_id, payload);
      
      if (updatedPost) {
        onSuccess(updatedPost);
        onClose();
      }
    } catch (err) {
      console.error('Error al actualizar publicación:', err);
      setError(err.response?.data?.message || 'No se pudo actualizar la publicación');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Publicación" size="md">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 mb-4 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de publicación
          </label>
          <select
            name="postType"
            value={formData.postType}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            disabled={isSubmitting}
          >
            <option value="general">General</option>
            <option value="question">Pregunta</option>
            <option value="resource">Recurso</option>
            <option value="tutorial">Tutorial</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Contenido
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded focus:ring-primary focus:border-primary"
            rows="4"
            disabled={isSubmitting}
            required
          ></textarea>
        </div>
        
        {/* Sección de contenido multimedia */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contenido multimedia
          </label>
          
          {/* Mostrar el contenido multimedia existente */}
          {post?.multimediaContent && (
            <div className="mb-4">
              <label className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={keepExistingMedia}
                  onChange={toggleKeepExistingMedia}
                  className="mr-2"
                  disabled={isSubmitting}
                />
                <span className="text-sm text-gray-700">
                  Mantener contenido multimedia existente
                </span>
              </label>
              
              {keepExistingMedia && (
                <div className="border border-gray-200 rounded-md p-2 bg-gray-50">
                  <div className="flex items-center">
                    {isOriginalVideo ? (
                      <Film className="text-gray-500 mr-2" size={18} />
                    ) : (
                      <Image className="text-gray-500 mr-2" size={18} />
                    )}
                    <span className="text-sm text-gray-600 truncate flex-1">
                      {isOriginalVideo ? 'Video actual' : 'Imagen actual'}
                    </span>
                    <a 
                      href={post.multimediaContent} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary text-sm hover:underline ml-2"
                    >
                      Ver
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Input para nuevo archivo si no mantenemos el existente o si no hay uno */}
          {(!keepExistingMedia || !post?.multimediaContent) && (
            <div className="space-y-3">
              {!file ? (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
                  <label className="cursor-pointer flex flex-col items-center">
                    <Upload className="mb-2 text-gray-400" size={24} />
                    <span className="text-sm text-gray-600 mb-1">
                      Haz clic para subir una imagen o video
                    </span>
                    <span className="text-xs text-gray-500">
                      Formatos: JPG, PNG, GIF, MP4, MKV, WEBM
                    </span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept="image/*,video/*,.mkv,.webm"
                      disabled={isSubmitting}
                    />
                  </label>
                </div>
              ) : (
                <div className="relative border border-gray-200 rounded-md p-3 bg-gray-50">
                  <div className="flex items-center">
                    {isVideo ? (
                      <Film className="text-gray-500 mr-2" size={18} />
                    ) : (
                      <Image className="text-gray-500 mr-2" size={18} />
                    )}
                    <span className="text-sm text-gray-600 truncate flex-1">
                      {file.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="text-gray-500 hover:text-red-500"
                      disabled={isSubmitting}
                    >
                      <X size={18} />
                    </button>
                  </div>
                  
                  {/* Vista previa del archivo */}
                  {filePreview && (
                    <div className="mt-2 border rounded overflow-hidden max-h-40">
                      {isVideo ? (
                        <video 
                          src={filePreview} 
                          controls 
                          className="w-full h-40 object-cover"
                        />
                      ) : (
                        <img 
                          src={filePreview} 
                          alt="Vista previa" 
                          className="w-full h-40 object-cover"
                        />
                      )}
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-xs text-gray-500 italic">
                {!file && !post?.multimediaContent ? 
                  "No se enviará ningún contenido multimedia con esta publicación." :
                  file ? 
                    "Se reemplazará el contenido multimedia existente con este nuevo archivo." :
                    "Se eliminará el contenido multimedia existente."
                }
              </p>
            </div>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            variant="white" 
            onClick={onClose} 
            disabled={isSubmitting}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};