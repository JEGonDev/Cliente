import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';

/**
 * Modal de confirmación de eliminación
 * 
 * Muestra un diálogo que requiere confirmación antes de eliminar un elemento.
 * Incluye título, mensaje y botones para cancelar o confirmar.
 * 
 * @param {Object} props
 * @param {boolean} props.isOpen - Controla si el modal está visible
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onConfirm - Callback para confirmar la eliminación
 * @param {string} [props.title="Confirmar eliminación"] - Título del modal
 * @param {string} [props.message="¿Estás seguro de que deseas eliminar este elemento?"] - Mensaje descriptivo
 * @param {boolean} [props.isDeleting=false] - Indicador de estado de eliminación en curso
 */
export const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que deseas eliminar este elemento?",
  isDeleting = false
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="py-2">
        <p className="text-gray-700 mb-4">{message}</p>
        <p className="text-sm text-gray-500 mb-6">
          Esta acción no se puede deshacer.
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
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};