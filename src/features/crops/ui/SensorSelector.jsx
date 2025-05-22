import { useState, useEffect, useMemo, useCallback } from 'react';
import { SensorCard } from './SensorCard';
import { AddSensorModal } from './AddSensorModal';

export const SensorSelector = ({ 
  selectedSensorIds = [], 
  onSensorSelectionChange,
  className = "" 
}) => {
  const [availableSensors, setAvailableSensors] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const mockSensors = useMemo(() => [
    { id: 'temp-01', name: 'Sensor Temp-01', type: 'Temperatura', lastReading: 24, minutesAgo: 10, isActive: true },
    { id: 'hum-04', name: 'Sensor Hum-04', type: 'Humedad', lastReading: 68, minutesAgo: 5, isActive: true },
    { id: 'ec-02', name: 'Sensor EC-02', type: 'Conductividad', lastReading: 1.3, minutesAgo: 15, isActive: true },
   
  ], []);

  useEffect(() => {
    const loadSensors = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setAvailableSensors(mockSensors);
      } catch (error) {
        console.error('Error loading sensors:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSensors();
  }, [mockSensors]);

  // Solo sensores activos sin filtro ni búsqueda
  const filteredSensors = useMemo(() => {
    return availableSensors.filter(sensor => sensor.isActive);
  }, [availableSensors]);

  const handleSensorToggle = useCallback((sensorId) => {
    const updatedSelection = selectedSensorIds.includes(sensorId)
      ? selectedSensorIds.filter(id => id !== sensorId)
      : [...selectedSensorIds, sensorId];
    onSensorSelectionChange?.(updatedSelection);
  }, [selectedSensorIds, onSensorSelectionChange]);

  const selectedCount = selectedSensorIds.length;

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
              sensor={sensor}
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
            No hay sensores disponibles que coincidan con los filtros actuales.
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
        onAddSensor={(data) => {
          const newSensor = {
            id: `custom-${Date.now()}`,
            ...data,
            lastReading: 0,
            minutesAgo: 0,
            isActive: true
          };
          setAvailableSensors(prev => [...prev, newSensor]);
          setIsAddModalOpen(false);
        }}
      />
    </div>
  );
};
