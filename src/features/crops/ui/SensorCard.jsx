// src/features/monitoring/ui/SensorCard.jsx
import PropTypes from 'prop-types';
/**
 * Componente reutilizable para mostrar tarjetas de sensores
 */
export const SensorCard = ({ 
  sensor, 
  isSelected, 
  onToggle, 
  showCheckbox = true 
}) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium text-gray-900">{sensor.name}</h4>
          <p className="text-sm text-gray-600">{sensor.type}</p>
          <p className="text-xs text-gray-500 mt-1">
            Última lectura: {sensor.lastReading}
          </p>
        </div>
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggle(sensor.id)}
            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mt-1"
          />
        )}
      </div>
    </div>
  );
};

SensorCard.propTypes = {
  sensor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    lastReading: PropTypes.string.isRequired
  }).isRequired,
  isSelected: PropTypes.bool,
  onToggle: PropTypes.func,
  showCheckbox: PropTypes.bool
};