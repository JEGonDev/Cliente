import React from "react";
import { Modal } from "../../../ui/components/Modal";
import { Button } from "../../../ui/components/Button";
import { Save, X } from "lucide-react";

export const ThreadEditModal = ({
  isOpen,
  isUpdating,
  formData,
  formErrors,
  handleChange,
  handleSubmit,
  handleCancel
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} title="Editar Hilo">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Título del hilo"
            required
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary ${formErrors.title ? "border-red-300" : "border-gray-300"
              }`}
          />
          {formErrors.title && (
            <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Contenido *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content || ''}
            onChange={handleChange}
            placeholder="Contenido del hilo..."
            required
            rows={6}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary resize-vertical ${formErrors.content ? "border-red-300" : "border-gray-300"
              }`}
          />
          {formErrors.content && (
            <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
          )}
        </div>

        {formErrors.general && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-800 text-sm">{formErrors.general}</p>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Guardando...
              </div>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};