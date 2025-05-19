import { useState, useEffect } from 'react';
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';
import { useTags } from '../hooks/useTags';

/**
 * Modal para crear una nueva etiqueta
 * 
 * Valida duplicados localmente y utiliza `useTags` para creación.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar
 * @param {Function} props.onSuccess - Callback tras crear exitosamente
 */
export const CreateTagModal = ({ isOpen, onClose, onSuccess }) => {
  const {
    formData,
    formErrors,
    handleChange,
    resetForm,
    handleCreateTag,
    tags // obtenemos etiquetas existentes
  } = useTags();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Resetear formulario al abrir/cerrar modal
  useEffect(() => {
    if (isOpen) {
      resetForm();
      setLocalError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    // Validación local de duplicados
    const nameTrimmed = (formData.name || '').trim().toLowerCase();
    if (tags.some(tag => tag.name.trim().toLowerCase() === nameTrimmed)) {
      setLocalError('Ya existe una etiqueta con ese nombre, por favor prueba con otro.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await handleCreateTag(e);
      if (result) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al crear etiqueta:', error);
      setLocalError('Ocurrió un error al crear la etiqueta. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocalChange = (e) => {
    e.persist();
    setLocalError('');
    handleChange(e);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nueva Etiqueta">
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
            onChange={handleLocalChange}
            className={`w-full px-3 py-2 border ${(formErrors.name || localError) ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary`}
            disabled={isSubmitting}
          />
          {(formErrors.name || localError) && (
            <p className="mt-1 text-xs text-red-500">{formErrors.name || localError}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="white" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Crear Etiqueta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/**
 * Modal para editar una etiqueta existente
 * 
 * Carga datos iniciales y permite actualizar nombre, validando duplicados.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar
 * @param {{id: string|number, name: string}} props.tag - Etiqueta a editar
 * @param {Function} props.onSuccess - Callback tras actualizar exitosamente
 */
export const EditTagModal = ({ isOpen, onClose, tag, onSuccess }) => {
  const {
    formData,
    formErrors,
    handleChange,
    loadTagForEdit,
    handleUpdateTag,
    tags // obtenemos etiquetas para validar duplicados
  } = useTags();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localFormData, setLocalFormData] = useState({ id: null, name: '' });
  const [localError, setLocalError] = useState('');

  // Cargar datos de la etiqueta seleccionada
  useEffect(() => {
    if (isOpen && tag && tag.id) {
      setLocalFormData({ id: tag.id, name: tag.name || '' });
      setLocalError('');
    }
  }, [isOpen, tag]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    // Validación local de duplicados (excluyendo la propia etiqueta)
    const nameTrimmed = (localFormData.name || '').trim().toLowerCase();
    if (tags.some(t => t.name.trim().toLowerCase() === nameTrimmed && t.id !== localFormData.id)) {
      setLocalError('Ya existe una etiqueta con ese nombre, por favor ingresa otro nombre.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await handleUpdateTag({ ...localFormData });
      if (result) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al actualizar etiqueta:', error);
      setLocalError('Ocurrió un error al actualizar la etiqueta. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData(prev => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Etiqueta">
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre de la etiqueta
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={localFormData.name}
            onChange={handleLocalChange}
            className={`w-full px-3 py-2 border ${(formErrors.name || localError) ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-primary`}
            disabled={isSubmitting}
          />
          {(formErrors.name || localError) && (
            <p className="mt-1 text-xs text-red-500">{formErrors.name || localError}</p>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="white" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Actualizar Etiqueta'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

/**
 * Modal para eliminar una o varias etiquetas
 * 
 * Muestra mensaje dinámico según cantidad y confirma borrado.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar
 * @param {Array|Object} props.tags - Etiquetas a eliminar (array o único objeto)
 * @param {Function} props.onSuccess - Callback tras eliminar exitosamente
 */
export const DeleteTagModal = ({ isOpen, onClose, tags, onSuccess }) => {
  const { handleDeleteTag } = useTags();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!tags) return;

    setIsDeleting(true);
    try {
      let success = false;
      if (Array.isArray(tags) && tags.length > 0) {
        const results = await Promise.all(tags.map(tag => handleDeleteTag(tag.id)));
        success = results.some(res => !!res);
      } else if (tags.id) {
        success = await handleDeleteTag(tags.id);
      }

      if (success) {
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error al eliminar etiqueta(s):', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getDeleteMessage = () => {
    if (Array.isArray(tags)) {
      if (tags.length === 0) return "No hay etiquetas seleccionadas";
      if (tags.length === 1) return `¿Estás seguro de que deseas eliminar la etiqueta "${tags[0].name}"?`;
      return `¿Estás seguro de que deseas eliminar las ${tags.length} etiquetas seleccionadas?`;
    }
    return tags?.name ? `¿Estás seguro de que deseas eliminar la etiqueta "${tags.name}"?` : "No hay etiqueta seleccionada";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Etiqueta(s)" size="sm">
      <p className="text-gray-700 mb-4">{getDeleteMessage()}</p>
      <p className="text-sm text-gray-500 mb-6">
        Esta acción no se puede deshacer y puede afectar a los módulos que utilizan estas etiquetas.
      </p>

      <div className="flex justify-end gap-2">
        <Button variant="white" onClick={onClose} disabled={isDeleting}>
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