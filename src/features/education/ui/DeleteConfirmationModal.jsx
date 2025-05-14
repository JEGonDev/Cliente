import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';

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