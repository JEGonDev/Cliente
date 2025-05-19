import { useState, useEffect } from 'react';
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';
import { useArticles } from '../hooks/useArticles';

/**
 * Modal con formulario para crear o editar un artículo
 * 
 * Este componente permite crear un nuevo artículo o editar uno existente.
 * Se maneja el estado del formulario internamente a través del hook `useArticles`.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Define si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {string|number} props.moduleId - ID del módulo al que pertenece el artículo
 * @param {string|number|null} [props.articleId=null] - ID del artículo para edición (si aplica)
 * @param {Function} props.onSuccess - Callback que se ejecuta tras guardar exitosamente
 */
export const ArticleFormModal = ({ 
  isOpen, 
  onClose, 
  moduleId, 
  articleId = null, 
  onSuccess 
}) => {
  const { 
    formData, 
    formErrors, 
    loading, 
    loadArticleForEdit,
    handleChange, 
    setModuleId,
    handleCreateArticle, 
    handleUpdateArticle 
  } = useArticles();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!articleId;

  // Establecer el moduleId al abrir el modal
  useEffect(() => {
    if (isOpen && moduleId) {
      setModuleId(moduleId);
    }
  }, [isOpen, moduleId, setModuleId]);
  
  // Cargar datos del artículo para edición
  useEffect(() => {
    let isMounted = true;
    
    if (isOpen && isEditing && articleId) {
      // Bandera para prevenir actualización de estado si el componente se desmonta
      loadArticleForEdit(articleId)
        .then(data => {
          if (isMounted && data) {
            // Cualquier actualización adicional que sea necesaria
          }
        });
    }
    
    // Función de limpieza
    return () => {
      isMounted = false;
    };
  }, [isOpen, isEditing, articleId, loadArticleForEdit]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      if (isEditing) {
        result = await handleUpdateArticle(articleId, e);
      } else {
        result = await handleCreateArticle(e);
      }
      
      if (result) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar artículo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Artículo" : "Crear Nuevo Artículo"}
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
            Título del artículo
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
          <label htmlFor="articleUrl" className="block text-sm font-medium text-gray-700 mb-1">
            URL del artículo
          </label>
          <input
            type="url"
            id="articleUrl"
            name="articleUrl"
            value={formData.articleUrl || ''}
            onChange={handleChange}
            placeholder="https://ejemplo.com/articulo"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Introduzca la URL completa donde se encuentra el artículo.
          </p>
        </div>
        
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