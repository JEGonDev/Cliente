import PropTypes from 'prop-types';
import { RealTimeIndicator } from '../ui/RealTimeIndicator';
import { RealTimeChart } from '../ui/RealTimeChart';
import { TimeSelector } from '../ui/TimeSelector';

/**
 * Layout para la sección de monitoreo en tiempo real
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos para mostrar en tiempo real
 */
export const RealTimeLayout = ({ data = {} }) => {
  // Datos de ejemplo para la maquetación
  const demoData = {
    temperature: {
      current: 22.4,
      unit: '°C',
      trend: '+0.3',
      trendDirection: 'up',
      trendTime: 'última hora'
    },
    humidity: {
      current: 68,
      unit: '%',
      trend: '-2',
      trendDirection: 'down',
      trendTime: 'última hora'
    },
    ec: {
      current: 1.3,
      unit: 'mS/cm',
      trend: 'Estable',
      trendTime: 'hace 2h'
    }
  };

  // Usar datos proporcionados o datos de ejemplo
  const displayData = Object.keys(data).length > 0 ? data : demoData;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Monitoreo en tiempo real</h1>
      
      {/* Indicadores en tiempo real */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <RealTimeIndicator 
          label="Temperatura"
          value={displayData.temperature.current}
          unit={displayData.temperature.unit}
          trend={displayData.temperature.trend}
          trendDirection={displayData.temperature.trendDirection}
          trendTime={displayData.temperature.trendTime}
          icon="temperature"
        />
        
        <RealTimeIndicator 
          label="Humedad"
          value={displayData.humidity.current}
          unit={displayData.humidity.unit}
          trend={displayData.humidity.trend}
          trendDirection={displayData.humidity.trendDirection}
          trendTime={displayData.humidity.trendTime}
          icon="humidity"
        />
        
        <RealTimeIndicator 
          label="EC"
          value={displayData.ec.current}
          unit={displayData.ec.unit}
          trend={displayData.ec.trend}
          trendTime={displayData.ec.trendTime}
          icon="conductivity"
        />
      </div>
      
      {/* Gráfico de monitoreo en tiempo real */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Monitoreo en tiempo real</h2>
          
          {/* Selector de tiempo */}
          <TimeSelector />
        </div>
        
        {/* Gráfico */}
        <RealTimeChart />
      </div>
      
      {/* Gráfico secundario de conductividad */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-lg font-medium">Conductividad (EC)</h2>
            <div className="text-green-700 font-medium text-xl">{displayData.ec.current} {displayData.ec.unit}</div>
            <div className="text-gray-500 text-sm">12 minutos atrás</div>
          </div>
        </div>
        
        {/* Gráfico de conductividad */}
        <div className="h-40 bg-green-50 rounded-lg"></div>
      </div>
    </div>
  );
};

RealTimeLayout.propTypes = {
  data: PropTypes.object
};