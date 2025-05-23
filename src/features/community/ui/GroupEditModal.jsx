import React, { useEffect } from 'react';
import { FaTimes, FaSave, FaSpinner } from 'react-icons/fa';
import { FormButton } from '../../../ui/components/FormButton';

/**
 * Modal especializado para editar grupos
 * Componente reutilizable que encapsula la UI de edición de grupos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.group - Datos del grupo a editar
 * @param {Object} props.formData - Datos del formulario
 * @param {Object} props.formErrors - Errores de validación
 * @param {string} props.successMessage - Mensaje de éxito
 * @param {boolean} props.updateLoading - Estado de carga de la actualización
 * @param {Function} props.onInputChange - Handler para cambios en inputs
 * @param {Function} props.onSubmit - Handler para envío del formulario
 * @param {Function} props.onClose - Handler para cerrar el modal
 */
export const GroupEditModal = ({
  group,
  formData,
  formErrors,
  successMessage,
  updateLoading,
  onInputChange,
  onSubmit,
  onClose
}) => {
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handler para cerrar con Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        {/* Header del modal */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            Editar Grupo
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            aria-label="Cerrar modal"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido del modal */}
        <div className="p-4">
          {/* Información del grupo actual */}
          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Grupo actual:</span> {group?.name}
            </p>
          </div>

          {/* Mensajes de estado */}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-green-600 text-sm font-medium">{successMessage}</p>
            </div>
          )}

          {formErrors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm font-medium">{formErrors.general}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo nombre */}
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del grupo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="groupName"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                  formErrors.name 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Ingresa el nombre del grupo"
                maxLength={100}
                disabled={updateLoading}
                autoFocus
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.name.length}/100 caracteres
              </p>
            </div>

            {/* Campo descripción */}
            <div>
              <label htmlFor="groupDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                id="groupDescription"
                name="description"
                value={formData.description}
                onChange={onInputChange}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${
                  formErrors.description 
                    ? 'border-red-300 focus:ring-red-500' 
                    : 'border-gray-300'
                }`}
                placeholder="Describe brevemente el propósito del grupo (opcional)"
                maxLength={500}
                disabled={updateLoading}
              />
              {formErrors.description && (
                <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {formData.description.length}/500 caracteres
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={updateLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              
              <FormButton
                text={updateLoading ? "Guardando..." : "Guardar Cambios"}
                icon={updateLoading ? <FaSpinner className="animate-spin" /> : <FaSave />}
                type="submit"
                disabled={updateLoading || !formData.name.trim()}
                className="min-w-[120px]"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};