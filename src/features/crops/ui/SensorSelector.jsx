import { useState, useEffect, useMemo, useCallback } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import { SensorCard } from './SensorCard';
import { AddSensorModal } from './AddSensorModal';

export const SensorSelector = ({
  selectedSensorIds = [],
  onSensorSelectionChange,
  className = ""
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Usar el contexto de monitoreo para obtener sensores reales
  const {
    sensors: availableSensors,
    loading: isLoading,
    error,
    fetchAllSensors,
    createSensor
  } = useMonitoring();

  // Cargar sensores al montar el componente
  useEffect(() => {
    fetchAllSensors();
  }, [fetchAllSensors]);

  // Filtrar solo sensores activos
  const filteredSensors = useMemo(() => {
    return availableSensors.filter(sensor => sensor.status === 'ACTIVE' || sensor.isActive !== false);
  }, [availableSensors]);

  const handleSensorToggle = useCallback((sensorId) => {
    const updatedSelection = selectedSensorIds.includes(sensorId)
      ? selectedSensorIds.filter(id => id !== sensorId)
      : [...selectedSensorIds, sensorId];
    onSensorSelectionChange?.(updatedSelection);
  }, [selectedSensorIds, onSensorSelectionChange]);

  const handleAddSensor = async (sensorData) => {
    try {
      const newSensor = await createSensor(sensorData);
      if (newSensor) {
        console.log('Sensor creado exitosamente:', newSensor);
        // El sensor se agregará automáticamente a la lista a través del contexto
      }
    } catch (error) {
      console.error('Error al crear sensor:', error);
    }
  };

  const selectedCount = selectedSensorIds.length;

  // Estado de carga
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error al cargar sensores: {error}</p>
          <button
            onClick={fetchAllSensors}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Asociar sensores
        </h3>
        <p className="text-sm text-gray-600">
          Seleccione los sensores que utilizará para monitorear este cultivo
        </p>
      </div>

      {/* Botón agregar sensor */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span>+</span>
          Agregar Sensor
        </button>
      </div>

      {/* Contador de selección */}
      {selectedCount > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-3">
          <p className="text-sm text-green-800">
            {selectedCount} sensor{selectedCount !== 1 ? 'es' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Grid de sensores */}
      {filteredSensors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSensors.map(sensor => (
            <SensorCard
              key={sensor.id}
              sensor={{
                id: sensor.id,
                sensorType: sensor.sensorType || sensor.type,
                name: `Sensor ${sensor.id}`,
                unitOfMeasurement: sensor.unitOfMeasurement || sensor.unit,
                lastReading: sensor.lastReading || 0,
                minutesAgo: sensor.minutesAgo || 0,
                status: sensor.status || 'ACTIVE'
              }}
              isSelected={selectedSensorIds.includes(sensor.id)}
              onToggleSelection={() => handleSensorToggle(sensor.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron sensores
          </h4>
          <p className="text-gray-600 mb-4">
            No hay sensores disponibles. Crea tu primer sensor para comenzar.
          </p>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Agregar primer sensor
          </button>
        </div>
      )}

      {/* Modal para agregar sensor */}
      <AddSensorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSensor={handleAddSensor}
      />
    </div>
  );
};
