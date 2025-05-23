import React, { useEffect } from 'react';
import { FaExclamationTriangle, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

/**
 * Componente de diálogo de confirmación reutilizable
 * Sigue las mejores prácticas de accesibilidad y UX
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título del diálogo
 * @param {string} props.message - Mensaje de confirmación
 * @param {string} props.confirmText - Texto del botón de confirmación
 * @param {string} props.cancelText - Texto del botón de cancelar
 * @param {string} props.variant - Variante visual ('danger', 'warning', 'info', 'success')
 * @param {boolean} props.loading - Estado de carga
 * @param {Function} props.onConfirm - Handler para confirmar
 * @param {Function} props.onCancel - Handler para cancelar
 * @param {string} props.type - Tipo de acción ('delete', 'save', 'update', 'general')
 */
export const ConfirmationDialog = ({
  title = "Confirmar acción",
  message = "¿Estás seguro de que deseas continuar?",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "warning",
  loading = false,
  onConfirm,
  onCancel,
  type = "general"
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
      if (e.key === 'Escape' && !loading) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onCancel, loading]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onCancel();
    }
  };

  // Configuración visual según la variante
  const variantConfig = {
    danger: {
      color: 'red',
      icon: FaTrash,
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    },
    warning: {
      color: 'yellow',
      icon: FaExclamationTriangle,
      bgColor: 'bg-yellow-50',
      iconColor: 'text-yellow-600',
      buttonColor: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
    },
    info: {
      color: 'blue',
      icon: FaCheck,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    },
    success: {
      color: 'green',
      icon: FaCheck,
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    }
  };

  const config = variantConfig[variant] || variantConfig.warning;
  const IconComponent = config.icon;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all">
        <div className="p-6">
          {/* Icono y título */}
          <div className="flex items-center mb-4">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${config.bgColor} flex items-center justify-center`}>
              <IconComponent className={`w-5 h-5 ${config.iconColor}`} />
            </div>
            <div className="ml-4">
              <h3 id="dialog-title" className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            </div>
          </div>

          {/* Mensaje */}
          <div className="mb-6">
            <p id="dialog-description" className="text-gray-700 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Advertencia adicional para acciones destructivas */}
          {variant === 'danger' && type === 'delete' && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm font-medium">
                ⚠️ Esta acción es permanente y no se puede deshacer.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes className="w-4 h-4 inline mr-2" />
              {cancelText}
            </button>
            
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor} ${
                loading ? 'cursor-wait' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <IconComponent className="w-4 h-4 inline mr-2" />
                  {confirmText}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// import React from "react";
// import { X } from "lucide-react";

// export const ConfirmationDialog = ({
//   title,
//   message,
//   confirmText = "Confirmar",
//   cancelText = "Cancelar",
//   onConfirm,
//   onCancel
// }) => {
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//       <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
//         <div className="flex justify-between items-center p-4 border-b">
//           <h3 className="text-lg font-medium">{title}</h3>
//           <button
//             onClick={onCancel}
//             className="text-gray-400 hover:text-gray-500"
//           >
//             <X className="h-5 w-5" />
//           </button>
//         </div>
        
//         <div className="p-6">
//           <p className="text-gray-700">{message}</p>
          
//           <div className="mt-6 flex justify-end gap-3">
//             <button
//               type="button"
//               onClick={onCancel}
//               className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
//             >
//               {cancelText}
//             </button>
            
//             <button
//               type="button"
//               onClick={onConfirm}
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
//             >
//               {confirmText}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };