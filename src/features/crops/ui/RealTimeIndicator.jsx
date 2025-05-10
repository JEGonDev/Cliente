import PropTypes from 'prop-types';
import { Thermometer, Droplets, Activity, TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Componente para mostrar un indicador en tiempo real
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta del indicador
 * @param {number} props.value - Valor actual
 * @param {string} props.unit - Unidad de medida
 * @param {string} props.trend - Tendencia del valor (valor numérico o texto)
 * @param {string} props.trendDirection - Dirección de la tendencia (up, down, stable)
 * @param {string} props.trendTime - Período de tiempo para la tendencia
 * @param {string} props.icon - Tipo de icono (temperature, humidity, conductivity)
 */
export const RealTimeIndicator = ({
  label = '',
  value = 0,
  unit = '',
  trend = '',
  trendDirection = 'stable',
  trendTime = '',
  icon = 'temperature'
}) => {
  // Mapeo de iconos
  const icons = {
    temperature: <Thermometer size={24} className="text-red-500" />,
    humidity: <Droplets size={24} className="text-blue-500" />,
    conductivity: <Activity size={24} className="text-green-500" />
  };
  
  // Icono seleccionado o icono por defecto
  const selectedIcon = icons[icon] || icons.temperature;
  
  // Clases y componentes de tendencia
  const trendComponents = {
    up: {
      icon: <TrendingUp size={18} className="text-green-500" />,
      textColor: 'text-green-500'
    },
    down: {
      icon: <TrendingDown size={18} className="text-red-500" />,
      textColor: 'text-red-500'
    },
    stable: {
      icon: null,
      textColor: 'text-gray-500'
    }
  };
  
  const trendConfig = trendComponents[trendDirection] || trendComponents.stable;
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center mb-3">
        {selectedIcon}
        <h3 className="ml-2 text-gray-600">{label}</h3>
      </div>
      
      <div className="flex justify-between items-end">
        <div>
          <div className="text-3xl font-bold">{value}{unit}</div>
          
          {trend && (
            <div className={`flex items-center text-sm mt-1 ${trendConfig.textColor}`}>
              {trendConfig.icon && <span className="mr-1">{trendConfig.icon}</span>}
              <span>{trend} desde {trendTime}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

RealTimeIndicator.propTypes = {
  label: PropTypes.string,
  value: PropTypes.number,
  unit: PropTypes.string,
  trend: PropTypes.string,
  trendDirection: PropTypes.oneOf(['up', 'down', 'stable']),
  trendTime: PropTypes.string,
  icon: PropTypes.oneOf(['temperature', 'humidity', 'conductivity'])
};