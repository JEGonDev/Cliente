import React from "react";
import { ConfirmationDialog } from "./ConfirmationDialog";

export const ThreadDeleteDialog = ({
  isOpen,
  loading,
  threadTitle,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <ConfirmationDialog
      title="Confirmar Eliminación"
      message={
        <>
          ¿Eliminar este hilo?
          <br />
          <span className="font-semibold text-gray-900">
            Esta acción no se puede deshacer. El hilo "{threadTitle}" será eliminado permanentemente.
          </span>
        </>
      }
      confirmText="Eliminar"
      cancelText="Cancelar"
      variant="danger"
      loading={loading}
      onConfirm={onConfirm}
      onCancel={onCancel}
      type="delete"
    />
  );
};