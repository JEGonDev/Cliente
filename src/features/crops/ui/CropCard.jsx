import { ChevronRight, Droplets, Thermometer } from 'lucide-react';
import PropTypes from 'prop-types';
import { CropStatusBadge } from './CropStatusBadge';

export const CropCard = ({ crop, onClick }) => {
  // Función para obtener datos de sensores de manera flexible
  const getSensorData = () => {
    // Si sensors es un objeto (formato mock)
    if (crop.sensors && typeof crop.sensors === 'object' && !Array.isArray(crop.sensors)) {
      return {
        humidity: crop.sensors.humidity || 0,
        temperature: crop.sensors.temperature || 0,
        conductivity: crop.sensors.conductivity || crop.sensors.ec || 0
      };
    }

    // Si sensors es un array (formato backend)
    if (Array.isArray(crop.sensors)) {
      const sensorData = { humidity: 0, temperature: 0, conductivity: 0 };

      crop.sensors.forEach(sensor => {
        if (sensor.lastReading) {
          const type = sensor.type.toLowerCase();
          if (type.includes('humidity')) {
            sensorData.humidity = sensor.lastReading;
          } else if (type.includes('temperature')) {
            sensorData.temperature = sensor.lastReading;
          } else if (type.includes('ec') || type.includes('conductivity')) {
            sensorData.conductivity = sensor.lastReading;
          }
        }
      });

      return sensorData;
    }

    // Valores por defecto
    return { humidity: 0, temperature: 0, conductivity: 0 };
  };

  // Función para obtener el número de alertas
  const getAlertsCount = () => {
    if (typeof crop.alerts === 'number') {
      return crop.alerts;
    }
    if (Array.isArray(crop.alerts)) {
      return crop.alerts.length;
    }
    return 0;
  };

  // Función para normalizar el status
  const getNormalizedStatus = () => {
    // Si no hay status, retornar active por defecto
    if (!crop.status) return 'active';

    const status = crop.status.toString().toLowerCase();
    switch (status) {
      case 'active':
      case 'activo':
        return 'active';
      case 'inactive':
      case 'inactivo':
        return 'paused';
      case 'paused':
      case 'pausado':
        return 'paused';
      case 'completed':
      case 'completado':
        return 'completed';
      default:
        return 'active';
    }
  };

  const sensorData = getSensorData();
  const alertsCount = getAlertsCount();
  const normalizedStatus = getNormalizedStatus();

  return (
    <div
      className="w-full bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02]"
      onClick={() => onClick(crop)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{crop.cropName || crop.name || 'Sin nombre'}</h3>
        <CropStatusBadge status={normalizedStatus} />
      </div>

      <p className="text-sm text-gray-600 mb-3">
        {crop.location || crop.description || (crop.cropType && crop.cropType.name) || crop.cropType || 'Sin ubicación especificada'}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex space-x-3">
          <div className="flex items-center text-sm">
            <Droplets className="h-4 w-4 text-blue-500 mr-1" />
            <span>{sensorData.humidity}%</span>
          </div>
          <div className="flex items-center text-sm">
            <Thermometer className="h-4 w-4 text-red-500 mr-1" />
            <span>{sensorData.temperature}°C</span>
          </div>
          {sensorData.conductivity > 0 && (
            <div className="flex items-center text-sm">
              <span className="text-purple-500 mr-1">⚡</span>
              <span>{sensorData.conductivity} mS/cm</span>
            </div>
          )}
        </div>

        <div className="flex items-center text-gray-600">
          <span className="text-xs">
            {alertsCount > 0 ? `${alertsCount} alertas` : 'Sin alertas'}
          </span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>

      {/* Información adicional si viene del backend */}
      {crop.startDate && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Iniciado: {new Date(crop.startDate).toLocaleDateString('es-ES')}
          </p>
        </div>
      )}
    </div>
  );
};

CropCard.propTypes = {
  crop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    cropName: PropTypes.string, // Soporte para el formato anterior
    location: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.oneOf(['ACTIVE', 'INACTIVE', 'PAUSED', 'COMPLETED', 'active', 'paused', 'alert', 'completed']),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    cropType: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    ]),
    // Para sensores, manejamos tanto el formato del backend como el mock
    sensors: PropTypes.oneOfType([
      PropTypes.shape({
        humidity: PropTypes.number,
        temperature: PropTypes.number,
        conductivity: PropTypes.number
      }),
      PropTypes.arrayOf(PropTypes.object)
    ]),
    alerts: PropTypes.oneOfType([
      PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        })
      ),
      PropTypes.number // Si viene como count del backend
    ])
  }).isRequired,
  onClick: PropTypes.func.isRequired
};

