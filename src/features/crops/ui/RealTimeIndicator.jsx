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
<<<<<<< HEAD
    conductivity: <Activity size={24} className="text-green-500" />
=======
    conductivity: <Activity size={24} className="text-green-500" />,
    tds: <Activity size={24} className="text-purple-500" />,
    ph: <Activity size={24} className="text-yellow-500" />
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
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
<<<<<<< HEAD
  
=======

  // Función para formatear el valor
  const formatValue = (val) => {
    if (typeof val !== 'number') return '0';

    // Formatear según el tipo de sensor
    if (icon === 'temperature') {
      return val.toFixed(1);
    } else if (icon === 'humidity') {
      return Math.round(val).toString();
    } else if (icon === 'conductivity' || icon === 'tds') {
      return val.toFixed(2);
    } else if (icon === 'ph') {
      return val.toFixed(1);
    }

    return val.toString();
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border text-center">
        <div className="flex items-center mb-3">
          <div className="animate-pulse bg-gray-300 w-6 h-6 rounded"></div>
          <div className="ml-2 animate-pulse bg-gray-300 h-4 w-20 rounded"></div>
        </div>

        <div className="animate-pulse bg-gray-300 h-8 w-16 mx-auto rounded mb-2"></div>
        <div className="animate-pulse bg-gray-300 h-3 w-24 mx-auto rounded"></div>
      </div>
    );
  }

  // Estado de error
  if (hasError) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border text-center border-red-200">
        <div className="flex items-center mb-3 justify-center">
          {selectedIcon}
          <h3 className="ml-2 text-gray-600">{label}</h3>
        </div>

        <div className="text-red-500 mb-2">
          <span className="text-2xl">⚠️</span>
        </div>

        <div className="text-sm text-red-600">
          {errorMessage || 'Error al cargar datos'}
        </div>
      </div>
    );
  }

  // Estado sin datos
  if (value === null || value === undefined) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md border text-center border-gray-200">
        <div className="flex items-center mb-3 justify-center">
          {selectedIcon}
          <h3 className="ml-2 text-gray-600">{label}</h3>
        </div>

        <div className="text-gray-400 mb-2">
          <span className="text-2xl">--</span>
        </div>

        <div className="text-sm text-gray-500">
          Sin datos disponibles
        </div>
      </div>
    );
  }

>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border text-center">
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
<<<<<<< HEAD
  icon: PropTypes.oneOf(['temperature', 'humidity', 'conductivity'])
=======
  icon: PropTypes.oneOf(['temperature', 'humidity', 'conductivity', 'tds', 'ph']),
  isLoading: PropTypes.bool,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
};