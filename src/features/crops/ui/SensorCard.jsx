import { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Componente SensorCard - Representa una tarjeta individual de sensor
 * con información detallada y capacidad de selección
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.sensor - Datos del sensor
 * @param {boolean} props.isSelected - Estado de selección
 * @param {Function} props.onToggleSelection - Callback para manejar selección
 * @param {string} props.className - Clases CSS adicionales
 */
export const SensorCard = ({
  sensor,
  isSelected = false,
  onToggleSelection,
  className = ""
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatTimeAgo = (minutes) => {
    if (!minutes || minutes === 0) return 'Sin datos';

    if (minutes < 60) {
      return `${minutes} min atrás`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours < 24) {
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min atrás` : `${hours}h atrás`;
    }

    const days = Math.floor(hours / 24);
    return `${days} día${days > 1 ? 's' : ''} atrás`;
  };

  const getSensorIcon = (type) => {
    const normalizedType = type.toLowerCase();
    const icons = {
      temperature: '🌡️',
      humidity: '💧',
      ec: '⚡',
      ph: '🧪'
    };

    // Buscar coincidencias parciales
    for (const [key, icon] of Object.entries(icons)) {
      if (normalizedType.includes(key)) {
        return icon;
      }
    }

    return '📊'; // Icono por defecto
  };

  const getUnit = (type) => {
    const normalizedType = type.toLowerCase();
    const units = {
      temperature: '°C',
      humidity: '%',
      ec: 'mS/cm',
      ph: 'pH'
    };

    // Buscar coincidencias parciales
    for (const [key, unit] of Object.entries(units)) {
      if (normalizedType.includes(key)) {
        return unit;
      }
    }

    return ''; // Sin unidad por defecto
  };

  const getSensorStatus = (minutesAgo, sensorStatus) => {
    // Priorizar el estado del sensor si está disponible
    if (sensorStatus !== undefined && sensorStatus !== null) {
      // Si es booleano
      if (typeof sensorStatus === 'boolean') {
        return sensorStatus
          ? { color: 'text-green-600', label: 'Activo' }
          : { color: 'text-red-600', label: 'Inactivo' };
      }
      // Si es string
      const status = String(sensorStatus).toLowerCase();
      if (status === 'inactive' || status === 'disabled') {
        return { color: 'text-red-600', label: 'Inactivo' };
      }
    }

    // Evaluar por tiempo de última lectura
    if (!minutesAgo || minutesAgo === 0) {
      return { color: 'text-gray-600', label: 'Sin datos' };
    }

    if (minutesAgo <= 15) return { color: 'text-green-600', label: 'Conectado' };
    if (minutesAgo <= 60) return { color: 'text-yellow-600', label: 'Inestable' };
    return { color: 'text-red-600', label: 'Desconectado' };
  };

  // Normalizar datos del sensor para compatibilidad
  const normalizedSensor = {
    id: sensor.id,
    name: sensor.name || `Sensor ${sensor.id}`,
    type: sensor.type || 'unknown',
    lastReading: sensor.lastReading ?? 0,
    minutesAgo: sensor.minutesAgo ?? 0,
    status: sensor.status || sensor.isActive,
    location: sensor.location
  };

  const status = getSensorStatus(normalizedSensor.minutesAgo, normalizedSensor.status);

  return (
    <div
      className={`
        relative p-4 border rounded-lg transition-all duration-300 cursor-pointer
        ${isSelected
          ? 'border-green-500 bg-green-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
        }
        ${isHovered ? 'transform scale-[1.02]' : ''}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onToggleSelection}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggleSelection();
        }
      }}
      aria-label={`Seleccionar sensor ${normalizedSensor.name}`}
    >
      {/* Checkbox en la esquina superior derecha */}
      <div className="absolute top-3 right-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Checkbox para ${normalizedSensor.name}`}
        />
      </div>

      {/* Encabezado del sensor */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl flex-shrink-0">
          {getSensorIcon(normalizedSensor.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {normalizedSensor.name}
          </h3>
          <p className="text-xs text-gray-600 capitalize">
            {normalizedSensor.type}
          </p>
          {normalizedSensor.location && (
            <p className="text-xs text-gray-500">
              📍 {normalizedSensor.location}
            </p>
          )}
        </div>
        <div className={`text-xs font-medium ${status.color}`}>
          {status.label}
        </div>
      </div>

      {/* Información de la última lectura */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Última lectura:</span>
          <span className="text-sm font-medium text-gray-900">
            {normalizedSensor.lastReading !== null && normalizedSensor.lastReading !== undefined
              ? `${normalizedSensor.lastReading}${getUnit(normalizedSensor.type)}`
              : 'Sin datos'
            }
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Actualizada:</span>
          <span className="text-xs text-gray-600">
            {formatTimeAgo(normalizedSensor.minutesAgo)}
          </span>
        </div>
      </div>

      {/* Indicador visual de selección */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-green-500 rounded-lg pointer-events-none">
          <div className="absolute top-0 right-0 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-green-500"></div>
        </div>
      )}
    </div>
  );
};

SensorCard.propTypes = {
  sensor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    type: PropTypes.string,
    lastReading: PropTypes.number,
    minutesAgo: PropTypes.number,
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    isActive: PropTypes.bool,
    location: PropTypes.string
  }).isRequired,
  isSelected: PropTypes.bool,
  onToggleSelection: PropTypes.func.isRequired,
  className: PropTypes.string
};
