import { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { GlobalThresholdsEditor } from './GlobalThresholdsEditor';

/**
 * Modal para editar umbrales reutilizando el componente GlobalThresholdsEditor
 * Implementa las mejores prácticas de UX para modales y manejo de estados
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Object} props.initialThresholds - Umbrales iniciales para editar
 * @param {Function} props.onSave - Callback para guardar umbrales (debe retornar Promise)
 */
export const ThresholdEditModal = ({
  isOpen,
  onClose,
  initialThresholds,
  onSave
}) => {
  // Referencias y estados del modal
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);
  const lastFocusableElementRef = useRef(null);

  // Estados locales del componente
  const [thresholds, setThresholds] = useState(initialThresholds);
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  // Actualizar umbrales locales cuando cambian los iniciales
  useEffect(() => {
    setThresholds(initialThresholds);
    setHasChanges(false);
  }, [initialThresholds]);

  // Detectar cambios en los umbrales
  useEffect(() => {
    const hasChangedValues = JSON.stringify(thresholds) !== JSON.stringify(initialThresholds);
    setHasChanges(hasChangedValues);
  }, [thresholds, initialThresholds]);

  // Manejo de accesibilidad y teclado
  useEffect(() => {
    if (isOpen) {
      // Enfocar el primer elemento del modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements?.length > 0) {
        firstFocusableElementRef.current = focusableElements[0];
        lastFocusableElementRef.current = focusableElements[focusableElements.length - 1];
        firstFocusableElementRef.current?.focus();
      }

      // Prevenir scroll del body
      document.body.style.overflow = 'hidden';

      return () => {
        document.body.style.overflow = 'unset';
      };
    }
  }, [isOpen]);

  // Manejar navegación por teclado (Tab trapping)
  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      handleClose();
    } else if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift + Tab (navegación hacia atrás)
        if (document.activeElement === firstFocusableElementRef.current) {
          e.preventDefault();
          lastFocusableElementRef.current?.focus();
        }
      } else {
        // Tab (navegación hacia adelante)
        if (document.activeElement === lastFocusableElementRef.current) {
          e.preventDefault();
          firstFocusableElementRef.current?.focus();
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  /**
   * Valida que los umbrales sean válidos antes de guardar
   * @param {Object} thresholdsToValidate - Umbrales a validar
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  const validateThresholds = (thresholdsToValidate) => {
    const errors = [];

    Object.entries(thresholdsToValidate).forEach(([key, { min, max }]) => {
      if (min >= max) {
        const paramName = key === 'ec' ? 'EC' : key.charAt(0).toUpperCase() + key.slice(1);
        errors.push(`${paramName}: El valor mínimo debe ser menor que el máximo`);
      }

      if (min < 0) {
        const paramName = key === 'ec' ? 'EC' : key.charAt(0).toUpperCase() + key.slice(1);
        errors.push(`${paramName}: El valor mínimo no puede ser negativo`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  /**
   * Maneja el guardado de umbrales con validación y manejo de errores
   */
  const handleSave = async () => {
    // Validar umbrales antes de guardar
    const validation = validateThresholds(thresholds);

    if (!validation.isValid) {
      setStatus("error");
      setErrorMessage(validation.errors.join('. '));
      return;
    }

    setStatus("loading");
    setErrorMessage('');

    try {
      // Llamar al callback de guardado (puede ser async)
      await onSave(thresholds);

      setStatus("success");

      // Cerrar modal después de mostrar éxito
      setTimeout(() => {
        handleClose();
      }, 1500);

    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message || 'Error inesperado al guardar los umbrales');
      console.error('Error saving thresholds:', error);
    }
  };

  /**
   * Maneja el cierre del modal con confirmación si hay cambios
   */
  const handleClose = () => {
    if (status === "loading") return;

    // Resetear estados
    setStatus(null);
    setErrorMessage('');
    setThresholds(initialThresholds);
    setHasChanges(false);

    onClose();
  };

  /**
   * Maneja click en el overlay (cerrar modal)
   */
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  /**
   * Renderiza el icono y mensaje según el estado actual
   */
  const renderStatusContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <Loader size={16} className="animate-spin text-blue-600" />
            <p className="text-sm text-blue-700">Guardando umbrales...</p>
          </div>
        );

      case "success":
        return (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
            <CheckCircle size={16} className="text-green-600" />
            <p className="text-sm text-green-700">
              ¡Umbrales guardados correctamente! Cerrando modal...
            </p>
          </div>
        );

      case "error":
        return (
          <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle size={16} className="text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700">Error al guardar</p>
              <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />

        {/* Espaciador para centrar el modal */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal */}
        <div
          ref={modalRef}
          className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full sm:p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                id="modal-title"
                className="text-lg font-semibold text-gray-900"
              >
                Editar Umbrales de Alertas
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Ajuste los valores para optimizar el monitoreo de sus cultivos
              </p>
            </div>
            <button
              ref={firstFocusableElementRef}
              type="button"
              onClick={handleClose}
              disabled={status === "loading"}
              className="text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md p-2 transition ease-in-out duration-150 disabled:opacity-50"
              aria-label="Cerrar modal"
            >
              <X size={20} />
            </button>
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            {/* Descripción informativa */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-3">
              <p className="text-sm text-blue-700">
                <strong>Información:</strong> Los umbrales determinan cuándo se generan alertas automáticas.
                Configure valores apropiados para su tipo de cultivo para recibir notificaciones oportunas.
              </p>
            </div>

            {/* Editor de umbrales (componente reutilizado) */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <GlobalThresholdsEditor
                thresholds={thresholds}
                setThresholds={setThresholds}
              />
            </div>

            {/* Indicador de cambios pendientes */}
            {hasChanges && status !== "success" && (
              <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-2">
                <span>⚠️</span>
                <span>Tienes cambios sin guardar</span>
              </div>
            )}

            {/* Mensajes de estado */}
            {renderStatusContent()}

            {/* Botones de acción */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                disabled={status === "loading"}
                className="px-4 py-2 text-sm font-medium text-white bg-primary border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {hasChanges && status !== "success" ? 'Cancelar' : 'Cerrar'}
              </button>

              <button
                ref={lastFocusableElementRef}
                type="button"
                onClick={handleSave}
                disabled={status === "loading" || !hasChanges}
                className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {status === "loading" && (
                  <Loader size={16} className="animate-spin" />
                )}
                {status === "loading" ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ThresholdEditModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialThresholds: PropTypes.shape({
    temperature: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    humidity: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    ec: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onSave: PropTypes.func.isRequired,
};