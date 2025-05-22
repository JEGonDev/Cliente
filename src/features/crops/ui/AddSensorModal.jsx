import { useState, useEffect, useRef } from 'react';

/**
 * Componente AddSensorModal - Modal para agregar nuevos sensores al sistema
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onAddSensor - Callback para agregar sensor
 */
export const AddSensorModal = ({ isOpen, onClose, onAddSensor }) => {
  // Referencias y estados
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    description: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tipos de sensores disponibles
  const sensorTypes = [
    { value: 'temperature', label: 'Temperatura', icon: '🌡️', unit: '°C' },
    { value: 'humidity', label: 'Humedad', icon: '💧', unit: '%' },
    { value: 'ec', label: 'Conductividad Eléctrica', icon: '⚡', unit: 'mS/cm' },

  ];

  // Efecto para manejar el enfoque cuando se abre el modal
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Efecto para manejar escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error específico cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del sensor es obligatorio';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.type) {
      newErrors.type = 'Debe seleccionar un tipo de sensor';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }

    return newErrors;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Agregar sensor
      onAddSensor(formData);
      
      // Resetear formulario
      handleReset();
      
    } catch (error) {
      console.error('Error adding sensor:', error);
      setErrors({ submit: 'Error al agregar el sensor. Intente nuevamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resetear formulario
  const handleReset = () => {
    setFormData({
      name: '',
      type: '',
      location: '',
      description: ''
    });
    setErrors({});
  };

  // Manejar cierre del modal
  const handleClose = () => {
    if (!isSubmitting) {
      handleReset();
      onClose();
    }
  };

  // Manejar click en el overlay
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // Obtener información del tipo seleccionado
  const selectedType = sensorTypes.find(type => type.value === formData.type);

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
          className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 
              id="modal-title" 
              className="text-lg font-medium text-gray-900"
            >
              Agregar Nuevo Sensor
            </h3>
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-black hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              aria-label="Cerrar modal"
            >
              <span className="text-xl">×</span>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre del sensor */}
            <div>
              <label 
                htmlFor="sensor-name" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre del sensor <span className="text-red-500">*</span>
              </label>
              <input
                ref={firstInputRef}
                id="sensor-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej. Sensor Temp-05"
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Tipo de sensor */}
            <div>
              <label 
                htmlFor="sensor-type" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Tipo de sensor <span className="text-red-500">*</span>
              </label>
              <select
                id="sensor-type"
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className={`w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500 ${
                  errors.type ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccione un tipo</option>
                {sensorTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.icon} {type.label} ({type.unit})
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type}</p>
              )}
            </div>

            {/* Vista previa del tipo seleccionado */}
            {selectedType && (
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedType.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedType.label}
                    </p>
                    <p className="text-xs text-gray-600">
                      Unidad de medida: {selectedType.unit}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Descripción opcional */}
            <div>
              <label 
                htmlFor="sensor-description" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Descripción (opcional)
              </label>
              <textarea
                id="sensor-description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Información adicional sobre el sensor..."
                disabled={isSubmitting}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 resize-none"
              />
            </div>

            {/* Error de envío */}
            {errors.submit && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Botones */}
      {/* Botones */}
<div className="flex justify-end gap-3 pt-4">
  <button
    type="button"
    onClick={handleClose}
    disabled={isSubmitting}
    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
  >
    Cancelar
  </button>
  <button
    type="submit"
    disabled={isSubmitting}
    className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
  >
    {isSubmitting && (
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    )}
    {isSubmitting ? 'Agregando...' : 'Agregar Sensor'}
  </button>
</div>
          </form>
        </div>
      </div>
    </div>
  );
};