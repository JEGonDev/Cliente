import { useState, useEffect } from 'react';
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';
import { useTags } from '../hooks/useTags';

// Modal para crear etiqueta
export const CreateTagModal = ({ isOpen, onClose, onSuccess }) => {
  const { 
    formData, 
    formErrors, 
    handleChange, 
    resetForm, 
    handleCreateTag 
  } = useTags();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Resetear el formulario al abrir/cerrar modal
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen, resetForm]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Llamamos a la función del hook con el evento
      const result = await handleCreateTag(e);
      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al crear etiqueta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Crear Nueva Etiqueta"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la etiqueta
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary`}
            disabled={isSubmitting}
          />
          {formErrors.name && (
            <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="white" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Crear Etiqueta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Modal para editar etiqueta
export const EditTagModal = ({ isOpen, onClose, tag, onSuccess }) => {
  const { 
    formData, 
    formErrors, 
    handleChange, 
    loadTagForEdit, 
    handleUpdateTag 
  } = useTags();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cargar datos de la etiqueta seleccionada
  useEffect(() => {
    if (isOpen && tag && tag.id) {
      loadTagForEdit(tag.id);
    }
  }, [isOpen, tag, loadTagForEdit]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Llamamos a la función del hook con el evento
      const result = await handleUpdateTag(e);
      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar etiqueta:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      title="Editar Etiqueta"
    >
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la etiqueta
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary`}
            disabled={isSubmitting}
          />
          {formErrors.name && (
            <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="white" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Actualizar Etiqueta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Modal para eliminar etiqueta(s)
export const DeleteTagModal = ({ isOpen, onClose, tags, onSuccess }) => {
  const { handleDeleteTag } = useTags();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    // Verificar que hay etiquetas para eliminar
    if (!tags) return;
    
    setIsDeleting(true);
    try {
      let success = false;
      
      if (Array.isArray(tags) && tags.length > 0) {
        // Eliminar múltiples etiquetas
        const deletePromises = tags.map(tag => 
          handleDeleteTag(tag.id)
        );
        
        const results = await Promise.all(deletePromises);
        success = results.every(result => !!result);
      } else if (tags.id) {
        // Eliminar una sola etiqueta
        success = await handleDeleteTag(tags.id);
      }
      
      if (success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al eliminar etiqueta(s):', error);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Determinar el mensaje según si es una o múltiples etiquetas
  const getDeleteMessage = () => {
    if (Array.isArray(tags)) {
      if (tags.length === 0) return "No hay etiquetas seleccionadas";
      if (tags.length === 1) {
        return `¿Estás seguro de que deseas eliminar la etiqueta "${tags[0].name}"?`;
      }
      return `¿Estás seguro de que deseas eliminar las ${tags.length} etiquetas seleccionadas?`;
    }
    return tags?.name ? `¿Estás seguro de que deseas eliminar la etiqueta "${tags.name}"?` : "No hay etiqueta seleccionada";
  };
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Etiqueta(s)"
      size="sm"
    >
      <p className="text-gray-700 mb-4">
        {getDeleteMessage()}
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Esta acción no se puede deshacer y puede afectar a los módulos que utilizan estas etiquetas.
      </p>
      
      <div className="flex justify-end gap-2">
        <Button 
          variant="white" 
          onClick={onClose}
          disabled={isDeleting}
        >
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={handleDelete}
          disabled={isDeleting || (Array.isArray(tags) && tags.length === 0) || (!Array.isArray(tags) && !tags?.id)}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </Modal>
  );
};