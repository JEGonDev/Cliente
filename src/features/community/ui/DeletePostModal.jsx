import { useState } from 'react';
import { Modal } from '../../../ui/components/Modal';
import { Button } from '../../../ui/components/Button';

export const DeletePostModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  post,
  isDeleting = false 
}) => {
  const getDeleteMessage = () => {
    return `¿Estás seguro de que deseas eliminar esta publicación?`;
  };

  const handleDelete = async () => {
    await onConfirm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Publicación" size="sm">
      <p className="text-gray-700 mb-4">{getDeleteMessage()}</p>
      <p className="text-sm text-gray-500 mb-6">
        Esta acción no se puede deshacer. Todo el contenido asociado, incluyendo comentarios y reacciones, se eliminará permanentemente.
      </p>

      <div className="flex justify-end gap-2">
        <Button variant="white" onClick={onClose} disabled={isDeleting}>
          Cancelar
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Eliminando...' : 'Eliminar'}
        </Button>
      </div>
    </Modal>
  );
};