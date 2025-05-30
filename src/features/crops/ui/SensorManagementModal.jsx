import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';
import { X, Plus, Trash2, Settings } from 'lucide-react';

/**
 * Modal completo para gestión de sensores de un cultivo
 * Integra las funcionalidades faltantes de cropService
 */
export const SensorManagementModal = ({ isOpen, onClose, crop }) => {
  const {
    sensors,
    fetchSensorsByCropId,
    fetchUserSensors,
    addSensorToCropWithThresholds,
    removeSensorFromCrop,
    createSensorAndAssociateToCrop,
    loading
  } = useMonitoring();

  const [availableSensors, setAvailableSensors] = useState([]);
  const [cropSensors, setCropSensors] = useState([]);
  const [activeTab, setActiveTab] = useState('associated'); // 'associated' | 'available' | 'create'
  const [showThresholdConfig, setShowThresholdConfig] = useState(false);
  const [selectedSensorForThresholds, setSelectedSensorForThresholds] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      try {
        // Cargar datos en paralelo
        const [cropSensorsResult] = await Promise.all([
          fetchSensorsByCropId(crop.id),
          fetchUserSensors()
        ]);

        if (!isMounted) return;

        // Filtrar sensores disponibles (no asociados al cultivo actual)
        const associatedSensorIds = sensors
          .filter(s => s.cropId === crop.id)
          .map(s => s.id);

        const available = sensors.filter(s => !associatedSensorIds.includes(s.id));

        setAvailableSensors(available);
        setCropSensors(cropSensorsResult || []);
      } catch (error) {
        console.error('Error cargando datos de sensores:', error);
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
  }, [isOpen, crop?.id]);

  const handleAssociateSensor = async (sensorId) => {
    try {
      setIsLoading(true);
      await addSensorToCropWithThresholds(crop.id, sensorId, {
        minThreshold: 0,
        maxThreshold: 100
      });

      // Recargar datos después de asociar
      const [cropSensorsResult] = await Promise.all([
        fetchSensorsByCropId(crop.id),
        fetchUserSensors()
      ]);

      const associatedSensorIds = cropSensorsResult.map(s => s.id);
      const available = sensors.filter(s => !associatedSensorIds.includes(s.id));

      setAvailableSensors(available);
      setCropSensors(cropSensorsResult);
    } catch (error) {
      console.error('Error asociando sensor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSensor = async (sensorId) => {
    if (window.confirm('¿Estás seguro de desasociar este sensor del cultivo?')) {
      try {
        setIsLoading(true);
        await removeSensorFromCrop(crop.id, sensorId);

        // Recargar datos después de desasociar
        const [cropSensorsResult] = await Promise.all([
          fetchSensorsByCropId(crop.id),
          fetchUserSensors()
        ]);

        const associatedSensorIds = cropSensorsResult.map(s => s.id);
        const available = sensors.filter(s => !associatedSensorIds.includes(s.id));

        setAvailableSensors(available);
        setCropSensors(cropSensorsResult);
      } catch (error) {
        console.error('Error desasociando sensor:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCreateAndAssociate = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
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

      // Recargar datos después de crear y asociar
      const [cropSensorsResult] = await Promise.all([
        fetchSensorsByCropId(crop.id),
        fetchUserSensors()
      ]);

      const associatedSensorIds = cropSensorsResult.map(s => s.id);
      const available = sensors.filter(s => !associatedSensorIds.includes(s.id));

      setAvailableSensors(available);
      setCropSensors(cropSensorsResult);
      setActiveTab('associated');
    } catch (error) {
      console.error('Error creando y asociando sensor:', error);
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
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 font-medium ${activeTab === 'available'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Sensores Disponibles ({availableSensors.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-6 py-3 font-medium ${activeTab === 'create'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-800'
              }`}
          >
            Crear Nuevo
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedSensorForThresholds(sensor);
                          setShowThresholdConfig(true);
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="Configurar umbrales"
                      >
                        <Settings size={16} />
                      </button>
                      <button
                        onClick={() => handleRemoveSensor(sensor.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        title="Desasociar sensor"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sensores Disponibles */}
          {activeTab === 'available' && !loading && !isLoading && (
            <div className="space-y-4">
              {availableSensors.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No hay sensores disponibles para asociar</p>
                </div>
              ) : (
                availableSensors.map(sensor => (
                  <div key={sensor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{sensor.sensorType}</h4>
                      <p className="text-sm text-gray-600">
                        Unidad: {sensor.unitOfMeasurement}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAssociateSensor(sensor.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
                    >
                      <Plus size={16} />
                      Asociar
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
                <select
                  value={newSensorData.sensorType}
                  onChange={(e) => setNewSensorData(prev => ({
                    ...prev,
                    sensorType: e.target.value,
                    unitOfMeasurement: e.target.value === 'temperature' ? '°C' :
                      e.target.value === 'humidity' ? '%' :
                        e.target.value === 'ec' ? 'mS/cm' : ''
                  }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="temperature">Temperatura</option>
                  <option value="humidity">Humedad</option>
                  <option value="ec">Conductividad (EC)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad de Medida
                </label>
                <input
                  type="text"
                  value={newSensorData.unitOfMeasurement}
                  onChange={(e) => setNewSensorData(prev => ({
                    ...prev,
                    unitOfMeasurement: e.target.value
                  }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                  readOnly
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Umbral Mínimo
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSensorData.thresholds.minThreshold}
                    onChange={(e) => setNewSensorData(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, minThreshold: e.target.value }
                    }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Umbral Máximo
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={newSensorData.thresholds.maxThreshold}
                    onChange={(e) => setNewSensorData(prev => ({
                      ...prev,
                      thresholds: { ...prev.thresholds, maxThreshold: e.target.value }
                    }))}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
              >
                Crear y Asociar Sensor
              </button>
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
    </div>
  );
};

SensorManagementModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  crop: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};