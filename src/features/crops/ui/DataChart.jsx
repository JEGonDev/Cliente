import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Componente para mostrar gráficos de datos históricos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.data - Datos para mostrar en el gráfico
 * @param {string} props.type - Tipo de gráfico (línea, barras, etc.)
 * @param {string} props.sensorType - Tipo de sensor (temperature, humidity, ec)
 * @param {boolean} props.showGrid - Mostrar cuadrícula
 * @param {number} props.height - Altura del gráfico
 */
export const DataChart = ({
  data = [],
  type = 'line',
  sensorType = 'temperature',
  showGrid = true,
  height = 400
}) => {
  const { loading } = useMonitoring();

  // Procesar y validar datos
  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map(item => {
      // Normalizar estructura de datos
      const normalizedItem = {
        date: item.date || item.readingDate || new Date().toISOString(),
        value: item.temp || item.temperature || item.readingValue || 0,
        // Agregar otros tipos de sensores si están disponibles
        temp: item.temp || item.temperature || (item.readingValue && sensorType === 'temperature' ? item.readingValue : 0),
        humidity: item.humidity || (item.readingValue && sensorType === 'humidity' ? item.readingValue : 0),
        ec: item.ec || item.conductivity || (item.readingValue && sensorType === 'ec' ? item.readingValue : 0)
      };

      return normalizedItem;
    }).filter(item => item.date && !isNaN(item.value));
  }, [data, sensorType]);

  // Función para obtener configuración según el tipo de sensor
  const getSensorConfig = (type) => {
    const configs = {
      temperature: {
        color: '#ef4444',
        unit: '°C',
        label: 'Temperatura',
        yAxisDomain: 'auto'
      },
      humidity: {
        color: '#3b82f6',
        unit: '%',
        label: 'Humedad',
        yAxisDomain: [0, 100]
      },
      ec: {
        color: '#10b981',
        unit: 'mS/cm',
        label: 'Conductividad',
        yAxisDomain: 'auto'
      }
    };

    return configs[type] || configs.temperature;
  };

  const config = getSensorConfig(sensorType);

  // Función para convertir fecha a formato legible
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        hour: data.length > 7 ? undefined : '2-digit',
        minute: data.length > 7 ? undefined : '2-digit'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Calcular estadísticas básicas
  const statistics = useMemo(() => {
    if (processedData.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const values = processedData.map(item => item.value).filter(val => !isNaN(val));

    if (values.length === 0) {
      return { min: 0, max: 0, avg: 0, count: 0 };
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;

    return {
      min: min.toFixed(1),
      max: max.toFixed(1),
      avg: avg.toFixed(1),
      count: values.length
    };
  }, [processedData]);

  // Estado de carga
  if (loading) {
    return (
      <div className="w-full">
        <div className="w-full bg-gray-50 rounded-lg relative overflow-hidden" style={{ height }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <span className="ml-2 text-gray-600">Cargando gráfico...</span>
          </div>
        </div>
      </div>
    );
  }

  // Estado sin datos
  if (processedData.length === 0) {
    return (
      <div className="w-full">
        <div className="w-full bg-gray-50 rounded-lg relative overflow-hidden p-8 text-center" style={{ height }}>
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay datos para mostrar
            </h3>
            <p className="text-gray-600">
              Selecciona un cultivo y sensor para ver el historial de datos
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Calcular dimensiones y márgenes
  const margin = { top: 20, right: 30, bottom: 60, left: 60 };
  const width = 800 - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  return (
    <div className="w-full">
      {/* Información del gráfico */}
      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-gray-900">{config.label}</h3>
            <p className="text-sm text-gray-600">{statistics.count} lecturas disponibles</p>
          </div>
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-gray-500">Mín</p>
              <p className="font-medium">{statistics.min}{config.unit}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Prom</p>
              <p className="font-medium">{statistics.avg}{config.unit}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Máx</p>
              <p className="font-medium">{statistics.max}{config.unit}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico SVG */}
      <div className="w-full bg-white rounded-lg border relative overflow-hidden" style={{ height }}>
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`0 0 ${width + margin.left + margin.right} ${height}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Líneas de cuadrícula */}
            {showGrid && (
              <g className="opacity-30">
                {Array(6).fill().map((_, i) => (
                  <line
                    key={`grid-line-${i}`}
                    x1={0}
                    y1={(i / 5) * chartHeight}
                    x2={width}
                    y2={(i / 5) * chartHeight}
                    stroke="#e0e0e0"
                    strokeWidth="1"
                  />
                ))}
                {Array(processedData.length).fill().map((_, i) => (
                  <line
                    key={`grid-col-${i}`}
                    x1={(i / (processedData.length - 1 || 1)) * width}
                    y1={0}
                    x2={(i / (processedData.length - 1 || 1)) * width}
                    y2={chartHeight}
                    stroke="#f0f0f0"
                    strokeWidth="1"
                  />
                ))}
              </g>
            )}

            {/* Línea del gráfico */}
            <path
              d={`M${processedData.map((item, index) => {
                const x = (index / (processedData.length - 1 || 1)) * width;
                const normalizedValue = (item.value - statistics.min) / (statistics.max - statistics.min || 1);
                const y = chartHeight - (normalizedValue * chartHeight);
                return `${index === 0 ? 'M' : 'L'}${x},${y}`;
              }).join(' ')}`}
              fill="none"
              stroke={config.color}
              strokeWidth="3"
            />

            {/* Puntos de datos */}
            {processedData.map((item, i) => {
              const x = (i / (processedData.length - 1 || 1)) * width;
              const normalizedValue = (item.value - statistics.min) / (statistics.max - statistics.min || 1);
              const y = chartHeight - (normalizedValue * chartHeight);

              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r="4"
                    fill="white"
                    stroke={config.color}
                    strokeWidth="2"
                  />
                  {/* Tooltip hover area */}
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="transparent"
                    className="hover:fill-gray-200 hover:fill-opacity-50 cursor-pointer"
                  >
                    <title>{`${formatDate(item.date)}: ${item.value}${config.unit}`}</title>
                  </circle>
                </g>
              );
            })}
          </g>
        </svg>

        {/* Etiquetas del eje X */}
        <div className="absolute bottom-4 left-0 right-0 px-16 flex justify-between text-xs text-gray-500">
          {processedData.length > 0 && (
            <>
              <div>{formatDate(processedData[0].date)}</div>
              {processedData.length > 2 && (
                <div>{formatDate(processedData[Math.floor(processedData.length / 2)].date)}</div>
              )}
              <div>{formatDate(processedData[processedData.length - 1].date)}</div>
            </>
          )}
        </div>

        {/* Etiquetas del eje Y */}
        <div className="absolute left-2 top-4 bottom-12 flex flex-col justify-between text-xs text-gray-500">
          <div>{statistics.max}{config.unit}</div>
          <div>{statistics.avg}{config.unit}</div>
          <div>{statistics.min}{config.unit}</div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="mt-4 flex justify-center items-center text-sm text-gray-600">
        <div className="flex items-center">
          <span
            className="inline-block w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: config.color }}
          ></span>
          <span>{config.label}</span>
        </div>
      </div>
    </div>
  );
};

DataChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    date: PropTypes.string,
    readingDate: PropTypes.string,
    temp: PropTypes.number,
    temperature: PropTypes.number,
    readingValue: PropTypes.number,
    humidity: PropTypes.number,
    ec: PropTypes.number,
    conductivity: PropTypes.number
  })),
  type: PropTypes.string,
  sensorType: PropTypes.oneOf(['temperature', 'humidity', 'ec']),
  showGrid: PropTypes.bool,
  height: PropTypes.number
};
