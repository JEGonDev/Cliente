import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';
import { X, Plus, Trash2, Settings } from 'lucide-react';

/**
 * Modal completo para gestión de sensores de un cultivo
 * Integra las funcionalidades faltantes de cropService
 */

// Componente de Modal de Confirmación
const ConfirmationModal = ({ isOpen, onClose, onConfirm, sensorType }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirmar Eliminación
        </h3>
        <p className="text-gray-600 mb-6">
          ¿Estás seguro de que deseas eliminar el sensor "{sensorType}"?
          Esta acción desasociará el sensor del cultivo y lo eliminará permanentemente.
          Esta acción no se puede deshacer.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  sensorType: PropTypes.string
};

export const SensorManagementModal = ({ isOpen, onClose, onSensorChange, crop }) => {
  const {
    sensors,
    fetchSensorsByCropId,
    removeSensorAndDelete,
    createSensorAndAssociateToCrop,
    loading
  } = useMonitoring();

  const [cropSensors, setCropSensors] = useState([]);
  const [activeTab, setActiveTab] = useState('associated'); // 'associated' | 'create'
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [selectedSensorForThresholds, setSelectedSensorForThresholds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    sensorId: null,
    sensorType: ''
  });

  // Estados para creación de sensor
  const [newSensorData, setNewSensorData] = useState({
    sensorType: '',
    unitOfMeasurement: '',
    thresholds: {
      minThreshold: '',
      maxThreshold: ''
    }
  });

  // Efecto para cargar datos cuando se abre el modal
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      if (!isOpen || !crop || isLoading) return;

      setIsLoading(true);
      setError(null);
      try {
        const cropSensorsResult = await fetchSensorsByCropId(crop.id);
        if (!isMounted) return;

        // Asegurarnos de que cropSensorsResult es un array
        const sensors = Array.isArray(cropSensorsResult) ? cropSensorsResult : [];
        setCropSensors(sensors);
      } catch (error) {
        console.error('Error cargando datos de sensores:', error);
        setError('Error al cargar los sensores. Por favor, intente de nuevo.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [isOpen, crop?.id, fetchSensorsByCropId]);

  const handleRemoveSensor = async (sensorId) => {
    try {
      setIsLoading(true);
      setError(null);

      await removeSensorAndDelete(crop.id, sensorId);

      // Recargar datos después de eliminar
      const cropSensorsResult = await fetchSensorsByCropId(crop.id);
      setCropSensors(Array.isArray(cropSensorsResult) ? cropSensorsResult : []);

      // Cerrar el modal de confirmación
      setConfirmationModal({ isOpen: false, sensorId: null, sensorType: '' });

      // Notificar al padre del cambio
      onSensorChange?.();

      setError({ type: 'success', message: 'Sensor eliminado correctamente' });
    } catch (error) {
      console.error('Error completo al eliminar sensor:', error);
      setError({
        type: 'error',
        message: error.response?.data?.message || 'Error al eliminar el sensor'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAndAssociate = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setError(null);

      const sensorData = {
        sensorType: newSensorData.sensorType,
        unitOfMeasurement: newSensorData.unitOfMeasurement,
        minThreshold: parseFloat(newSensorData.thresholds.minThreshold),
        maxThreshold: parseFloat(newSensorData.thresholds.maxThreshold)
      };

      await createSensorAndAssociateToCrop(crop.id, sensorData);

      // Resetear formulario
      setNewSensorData({
        sensorType: '',
        unitOfMeasurement: '',
        thresholds: { minThreshold: '', maxThreshold: '' }
      });

      // Recargar datos
      const cropSensorsResult = await fetchSensorsByCropId(crop.id);
      setCropSensors(Array.isArray(cropSensorsResult) ? cropSensorsResult : []);

      // Notificar al padre del cambio
      onSensorChange?.();

      setActiveTab('associated');
      setError({ type: 'success', message: 'Sensor creado y asociado correctamente' });
    } catch (error) {
      console.error('Error creando y asociando sensor:', error);
      setError({
        type: 'error',
        message: error.response?.data?.message || 'Error al crear y asociar el sensor'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Gestión de Sensores</h2>
            <p className="text-gray-600">Cultivo: {crop?.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className={`mx-6 mt-4 p-4 ${error.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            } border rounded-lg`}>
            <p>{error.message}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('associated')}
            className={`px-6 py-3 font-medium ${activeTab === 'associated'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Sensores Asociados ({cropSensors.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium ${activeTab === 'create'
              ? 'border-b-2 border-primary text-primary'
              : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Crear y Asociar Sensor
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {(loading || isLoading) && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
            </div>
          )}

          {/* Sensores Asociados */}
          {activeTab === 'associated' && !loading && !isLoading && (
            <div className="space-y-4">
              {cropSensors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay sensores asociados a este cultivo</p>
                </div>
              ) : (
                cropSensors.map(sensor => (
                  <div key={sensor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{sensor.sensorType}</h4>
                      <p className="text-sm text-gray-600">
                        Unidad: {sensor.unitOfMeasurement}
                      </p>
                    </div>
                    <button
                      onClick={() => setConfirmationModal({
                        isOpen: true,
                        sensorId: sensor.id,
                        sensorType: sensor.sensorType
                      })}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                      title="Desasociar sensor"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Crear Nuevo Sensor */}
          {activeTab === 'create' && !loading && !isLoading && (
            <form onSubmit={handleCreateAndAssociate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Sensor
                </label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={newSensorData.sensorType}
                    onChange={(e) => setNewSensorData(prev => ({
                      ...prev,
                      sensorType: e.target.value
                    }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="Especifique el tipo de sensor (ej: Sensor A, Invernadero 1)"
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Ingrese un nombre descriptivo para identificar el sensor
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad de Medida
                </label>
                <select
                  value={newSensorData.unitOfMeasurement}
                  onChange={(e) => {
                    const unit = e.target.value;
                    let defaultThresholds = { minThreshold: '', maxThreshold: '' };

                    // Establecer umbrales sugeridos según la unidad
                    switch (unit) {
                      case '°C':
                        defaultThresholds = { minThreshold: '18', maxThreshold: '26' };
                        break;
                      case '%':
                        defaultThresholds = { minThreshold: '60', maxThreshold: '80' };
                        break;
                      case 'mS/cm':
                        defaultThresholds = { minThreshold: '1', maxThreshold: '1.6' };
                        break;
                    }

                    setNewSensorData(prev => ({
                      ...prev,
                      unitOfMeasurement: unit,
                      thresholds: defaultThresholds
                    }));
                  }}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Seleccionar unidad</option>
                  <option value="°C">Grados centígrados (°C)</option>
                  <option value="%">Porcentaje (%)</option>
                  <option value="mS/cm">Conductividad eléctrica (mS/cm)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Umbrales
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Mínimo
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={newSensorData.unitOfMeasurement === 'mS/cm' ? '0.1' : '1'}
                        value={newSensorData.thresholds.minThreshold}
                        onChange={(e) => setNewSensorData(prev => ({
                          ...prev,
                          thresholds: {
                            ...prev.thresholds,
                            minThreshold: e.target.value
                          }
                        }))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {newSensorData.unitOfMeasurement}
                      </span>
                    </div>
                    {newSensorData.unitOfMeasurement && (
                      <p className="text-xs text-gray-500 mt-1">
                        {newSensorData.unitOfMeasurement === '°C' && 'Rango válido: -10°C - 50°C | Recomendado: 18°C - 26°C'}
                        {newSensorData.unitOfMeasurement === '%' && 'Rango válido: 0% - 100% | Recomendado: 60% - 80%'}
                        {newSensorData.unitOfMeasurement === 'mS/cm' && 'Rango válido: 0mS/cm - 5mS/cm | Recomendado: 1mS/cm - 1.6mS/cm'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Máximo
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step={newSensorData.unitOfMeasurement === 'mS/cm' ? '0.1' : '1'}
                        value={newSensorData.thresholds.maxThreshold}
                        onChange={(e) => setNewSensorData(prev => ({
                          ...prev,
                          thresholds: {
                            ...prev.thresholds,
                            maxThreshold: e.target.value
                          }
                        }))}
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                        {newSensorData.unitOfMeasurement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
                >
                  Crear y Asociar Sensor
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border rounded hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={() => setConfirmationModal({ isOpen: false, sensorId: null, sensorType: '' })}
        onConfirm={() => handleRemoveSensor(confirmationModal.sensorId)}
        sensorType={confirmationModal.sensorType}
      />
    </div>
  );
};

SensorManagementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSensorChange: PropTypes.func,
  crop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};