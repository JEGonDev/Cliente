import { useState, useEffect } from 'react';
import { SensorCard } from './SensorCard';
import { AlertConfiguration } from './AlertConfiguration';
import { useSensorData } from '../hooks/useSensorData';

/**
 * Componente para asociar sensores a un cultivo
 * Permite seleccionar sensores existentes y configurar alertas
 */
export const SensorAssociation = ({ 
  selectedSensors = [], 
  onSensorsChange, 
  alertConfig = { method: 'email', frequency: 'immediate' },
  onAlertConfigChange 
}) => {
  const { sensors, loading, error } = useSensorData();
  const [localSelectedSensors, setLocalSelectedSensors] = useState(selectedSensors);

  useEffect(() => {
    setLocalSelectedSensors(selectedSensors);
  }, [selectedSensors]);

  /**
   * Maneja la selección/deselección de sensores
   * @param {string} sensorId - ID del sensor
   * @param {boolean} isSelected - Estado de selección
   */
  const handleSensorToggle = (sensorId, isSelected) => {
    const updatedSensors = isSelected
      ? [...localSelectedSensors, sensorId]
      : localSelectedSensors.filter(id => id !== sensorId);
    
    setLocalSelectedSensors(updatedSensors);
    onSensorsChange?.(updatedSensors);
  };

  /**
   * Maneja cambios en la configuración de alertas
   * @param {Object} config - Nueva configuración de alertas
   */
  const handleAlertConfigChange = (config) => {
    onAlertConfigChange?.(config);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        <span className="ml-2 text-gray-600">Cargando sensores...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error al cargar sensores
            </h3>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado de la sección */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Asociar sensores
        </h2>
        <p className="text-gray-600">
          Seleccione los sensores que utilizará para monitorear este cultivo
        </p>
      </div>

      {/* Grid de sensores disponibles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <SensorCard
            key={sensor.id}
            sensor={sensor}
            isSelected={localSelectedSensors.includes(sensor.id)}
            onToggle={handleSensorToggle}
          />
        ))}
      </div>

      {/* Mostrar mensaje si no hay sensores disponibles */}
      {sensors.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No hay sensores disponibles. 
            <a href="/monitoring/sensors/new" className="text-green-600 hover:text-green-700 ml-1">
              Crear nuevo sensor
            </a>
          </p>
        </div>
      )}

      {/* Configuración de alertas */}
      <AlertConfiguration
        config={alertConfig}
        onChange={handleAlertConfigChange}
        disabled={localSelectedSensors.length === 0}
      />

      {/* Resumen de sensores seleccionados */}
      {localSelectedSensors.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                {localSelectedSensors.length} sensor(es) seleccionado(s)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};