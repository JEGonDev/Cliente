import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Componente AddSensorModal - Modal para agregar nuevos sensores al sistema
 * 
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Estado de visibilidad del modal
 * @param {Function} props.onClose - Callback para cerrar el modal
 * @param {Function} props.onAddSensor - Callback para agregar sensor
 */
export const AddSensorModal = ({ isOpen, onClose, onAddSensor }) => {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);

  const [formData, setFormData] = useState({
    type: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Usar el contexto de monitoreo
  const { createSensor, loading } = useMonitoring();

  // Tipos de sensores disponibles
  const sensorTypes = [
    { value: 'temperature', label: 'Temperatura', icon: '🌡️', unit: '°C' },
    { value: 'ec', label: 'Conductividad Eléctrica', icon: '⚡', unit: 'mS/cm' },
    { value: 'humidity', label: 'Humedad', icon: '💧', unit: '%' }
  ];

  // Efecto para manejar el foco al abrir el modal
  useEffect(() => {
    if (isOpen && firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, [isOpen]);

  // Efecto para manejar el click fuera del modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};

    if (!formData.type) {
      newErrors.type = 'Debe seleccionar un tipo de sensor';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      // Obtener la unidad de medida según el tipo de sensor
      const selectedSensorType = sensorTypes.find(type => type.value === formData.type);

      // Preparar datos para el backend
      const sensorData = {
        sensorType: formData.type,
        unitOfMeasurement: selectedSensorType.unit
      };

      console.log('Creando sensor:', sensorData);

      // Crear sensor usando el contexto
      const newSensor = await createSensor(sensorData);

      if (newSensor) {
        console.log('Sensor creado exitosamente:', newSensor);

        // Llamar callback si se proporciona
        if (onAddSensor) {
          onAddSensor(newSensor);
        }

        // Resetear formulario y cerrar modal
        handleReset();
        onClose();
      }

    } catch (error) {
      console.error('Error al crear sensor:', error);
      setErrors({
        submit: error.message || 'Error al agregar el sensor. Intente nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleReset = () => {
    setFormData({
      type: ''
    });
    setErrors({});
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 transform transition-all"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Agregar Nuevo Sensor
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo de sensor */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo de sensor *
            </label>
            <select
              ref={firstInputRef}
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.type ? 'border-red-300' : ''
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

          {/* Error general */}
          {errors.submit && (
            <div className="text-sm text-red-600 mt-2">
              {errors.submit}
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || loading}
              className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {(isSubmitting || loading) && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {(isSubmitting || loading) ? 'Agregando...' : 'Agregar Sensor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddSensorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAddSensor: PropTypes.func
};