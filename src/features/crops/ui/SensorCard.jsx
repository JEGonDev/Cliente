import { useState } from 'react';

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
    if (minutes < 60) {
      return `${minutes} min atrás`;
    }
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}min atrás`;
  };

  const getSensorIcon = (type) => {
    const icons = {
      temperature: '🌡️',
      humidity: '💧',
      ec: '⚡',
    };
    return icons[type] || '📊';
  };

  const getUnit = (type) => {
    const units = {
      temperature: '°C',
      humidity: '%',
      ec: '',
    };
    return units[type] || '';
  };

  const getSensorStatus = (minutesAgo) => {
    if (minutesAgo <= 15) return { color: 'text-green-600', label: 'Conectado' };
    if (minutesAgo <= 60) return { color: 'text-yellow-600', label: 'Inestable' };
    return { color: 'text-red-600', label: 'Desconectado' };
  };

  const status = getSensorStatus(sensor.minutesAgo);

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
      aria-label={`Seleccionar sensor ${sensor.name}`}
    >
      {/* Checkbox en la esquina superior derecha */}
      <div className="absolute top-3 right-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onToggleSelection}
          className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
          onClick={(e) => e.stopPropagation()}
          aria-label={`Checkbox para ${sensor.name}`}
        />
      </div>

      {/* Encabezado del sensor */}
      <div className="flex items-start gap-3 mb-3">
        <div className="text-2xl flex-shrink-0">
          {getSensorIcon(sensor.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm truncate">
            {sensor.name}
          </h3>
          <p className="text-xs text-gray-600 capitalize">
            {sensor.type}
          </p>
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
            {sensor.lastReading}{getUnit(sensor.type)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Actualizada:</span>
          <span className="text-xs text-gray-600">
            {formatTimeAgo(sensor.minutesAgo)}
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
