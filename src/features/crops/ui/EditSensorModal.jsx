import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';

export const EditSensorModal = ({ isOpen, onClose, sensor }) => {
  const { updateSensor, deleteSensor } = useMonitoring();
  const [formData, setFormData] = useState({
    sensorType: '',
    unitOfMeasurement: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sensor) {
      setFormData({
        sensorType: sensor.sensorType || sensor.type || '',
        unitOfMeasurement: sensor.unitOfMeasurement || sensor.unit || ''
      });
    }
  }, [sensor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await updateSensor(sensor.id, formData);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al actualizar el sensor');
    }
  };

  const handleDelete = async () => {
    if (!isDeleting) {
      setIsDeleting(true);
      return;
    }

    try {
      await deleteSensor(sensor.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al eliminar el sensor');
    }
  };

  if (!isOpen || !sensor) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Editar Sensor {sensor.name || `Sensor ${sensor.id}`}</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Sensor
            </label>
            <select
              value={formData.sensorType}
              onChange={(e) => {
                const newType = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  sensorType: newType,
                  // Resetear la unidad cuando cambia el tipo
                  unitOfMeasurement: ''
                }));
              }}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Seleccionar tipo</option>
              <option value="temperature">Temperatura</option>
              <option value="humidity">Humedad</option>
              <option value="tds">Conductividad (EC)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidad de Medida
            </label>
            <select
              value={formData.unitOfMeasurement}
              onChange={(e) => setFormData(prev => ({ ...prev, unitOfMeasurement: e.target.value }))}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            >
              <option value="">Seleccionar unidad</option>
              {formData.sensorType === 'temperature' && <option value="°C">°C</option>}
              {formData.sensorType === 'humidity' && <option value="%">%</option>}
              {formData.sensorType === 'tds' && <option value="mS/cm">mS/cm</option>}
            </select>
          </div>

          <div className="flex justify-between pt-4 border-t mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className={`px-4 py-2 text-white rounded transition-colors ${isDeleting
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gray-500 hover:bg-gray-600'
                }`}
            >
              {isDeleting ? '¿Confirmar eliminación?' : 'Eliminar'}
            </button>

            <div className="space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsDeleting(false);
                  onClose();
                }}
                className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
              >
                Guardar
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

EditSensorModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  sensor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    sensorType: PropTypes.string,
    type: PropTypes.string,
    unitOfMeasurement: PropTypes.string,
    unit: PropTypes.string
  })
}; 