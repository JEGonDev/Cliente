import { useState, useEffect, useRef } from 'react';
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';
import { useGuides } from '../hooks/useGuides';

/**
 * Modal con formulario para crear o editar una guía
 * 
 * Utiliza el hook `useGuides` para manejar los datos y la lógica de envío.
 * Permite subir un archivo PDF al crear y solo muestra título y descripción al editar.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {string|number} props.moduleId - ID del módulo asociado
 * @param {string|number|null} [props.guideId=null] - ID de la guía para edición
 * @param {Function} props.onSuccess - Callback tras guardar exitosamente
 */
export const GuideFormModal = ({ 
  isOpen, 
  onClose, 
  moduleId, 
  guideId = null,
  onSuccess 
}) => {
  const { 
    formData, 
    formErrors, 
    loading, 
    loadGuideForEdit,
    handleChange, 
    setModuleId,
    handleCreateGuide, 
    handleUpdateGuide 
  } = useGuides();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const isEditing = !!guideId;

  // Establecer el moduleId al abrir el modal
  useEffect(() => {
    if (isOpen && moduleId) {
      setModuleId(moduleId);
    }
  }, [isOpen, moduleId, setModuleId]);
  
  // Cargar datos de la guía para edición
  useEffect(() => {
    let isMounted = true;
    
    if (isOpen && isEditing && guideId) {
      loadGuideForEdit(guideId)
        .then(data => {
          // Solo actualizar si el componente sigue montado
          if (!isMounted) return;
          // Cualquier otro código necesario post-carga
        })
        .catch(error => {
          if (isMounted) {
            console.error(`Error al cargar la guía para editar:`, error);
          }
        });
    }
    
    // Función de limpieza
    return () => {
      isMounted = false;
    };
  }, [isOpen, isEditing, guideId, loadGuideForEdit]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let result;
      if (isEditing) {
        result = await handleUpdateGuide(guideId, e);
      } else {
        result = await handleCreateGuide(e);
      }
      
      if (result) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al guardar guía:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Manejar el cambio de archivo
  const handleFileChange = (e) => {
    // Usar el handler de cambio del hook
    handleChange(e);
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Editar Guía" : "Subir Nueva Guía"}
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
            Título de la guía
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
        
        {/* Campo de descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          ></textarea>
        </div>
        
        {/* Campo de archivo PDF */}
        {!isEditing && (
          <div>
            <label htmlFor="pdfFile" className="block text-sm font-medium text-gray-700 mb-1">
              Archivo PDF
            </label>
            <input
              type="file"
              id="pdfFile"
              name="pdfFile"
              ref={fileInputRef}
              accept=".pdf"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              required={!isEditing}
            />
            <p className="mt-1 text-xs text-gray-500">
              Seleccione un archivo PDF (máx. 10MB)
            </p>
          </div>
        )}
        
        {/* Nota sobre edición */}
        {isEditing && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            <p>Para reemplazar el archivo PDF existente, cree una nueva guía y luego elimine esta.</p>
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
