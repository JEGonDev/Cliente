import { useMonitoring } from '../hooks/useMonitoring';
import { useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { Droplets as HumidityIcon, Thermometer as TemperatureIcon, Activity as ConductivityIcon } from 'lucide-react';

// Funciones de formato para los ejes
const formatTemperature = (value) => `${value}°C`;
const formatHumidity = (value) => `${value}%`;
const formatConductivity = (value) => `${value} mS/cm`;

// Componente personalizado para el tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-white p-2 border rounded shadow-lg">
      <p className="text-sm font-medium">{label}</p>
      {payload.map((item, index) => (
        <p key={index} className="text-sm" style={{ color: item.color }}>
          {item.name}: {item.value}
          {item.name === 'temperatura' && '°C'}
          {item.name === 'humedad' && '%'}
          {item.name === 'conductividad' && ' mS/cm'}
        </p>
      ))}
    </div>
  );
};

export const RealTimeChart = () => {
  const {
    realTimeData,
    sensors,
    selectedCrop,
    timeRange,
    loading
  } = useMonitoring();

  // Procesar datos del contexto para el gráfico
  const chartData = useMemo(() => {
    if (!realTimeData || Object.keys(realTimeData).length === 0) {
      return [];
    }

    // Obtener todas las lecturas y organizarlas por tiempo
    const timePoints = new Map();

    Object.entries(realTimeData).forEach(([sensorId, sensorData]) => {
      if (sensorData.history && sensorData.history.length > 0) {
        const sensor = sensors.find(s => s.id === parseInt(sensorId));
        if (sensor) {
          sensorData.history.forEach(reading => {
            const time = new Date(reading.readingDate).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            });

            if (!timePoints.has(time)) {
              timePoints.set(time, { time });
            }

            const point = timePoints.get(time);
            const sensorType = sensor.type.toLowerCase();

            if (sensorType === 'temperature') {
              point.temp = reading.readingValue;
            } else if (sensorType === 'humidity') {
              point.hum = reading.readingValue;
            } else if (sensorType === 'ec') {
              point.cond = reading.readingValue;
            }
          });
        }
      }
    });

    return Array.from(timePoints.values()).sort((a, b) => {
      return new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`);
    });
  }, [realTimeData, sensors]);

  // Datos de fallback si no hay datos reales
  const fallbackData = [
    { time: '00:00', temp: 22, hum: 80, cond: 1.2 },
    { time: '02:00', temp: 21, hum: 75, cond: 1.3 },
    { time: '04:00', temp: 20, hum: 70, cond: 1.4 },
    { time: '06:00', temp: 22, hum: 68, cond: 1.2 },
    { time: '08:00', temp: 25, hum: 65, cond: 1.1 },
    { time: '10:00', temp: 28, hum: 60, cond: 1.0 }
  ];

  const dataToShow = chartData.length > 0 ? chartData : fallbackData;
  const isUsingRealData = chartData.length > 0;

  // Estado de carga
  if (loading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Cargando datos del gráfico...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Indicador de tipo de datos */}
      {!isUsingRealData && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <p className="text-yellow-700 text-sm">
            ⚠️ Mostrando datos de ejemplo. {selectedCrop ?
              'Los datos reales se cargarán cuando haya lecturas disponibles.' :
              'Selecciona un cultivo para ver datos reales.'
            }
          </p>
        </div>
      )}

      {/* Grid para humedad y temperatura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfica de Humedad */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <HumidityIcon />
            <h3 className="text-lg font-semibold text-blue-600">Humedad</h3>
            {isUsingRealData && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                En vivo
              </span>
            )}
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataToShow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[50, 90]}
                  tickFormatter={formatHumidity}
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />

                {/* Líneas de umbral */}
                <ReferenceLine y={80} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
                <ReferenceLine y={60} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />

                <Line
                  type="monotone"
                  dataKey="hum"
                  name="humedad"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />

                {/* Líneas para la leyenda de umbrales */}
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral máximo"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral mínimo"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfica de Temperatura */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <TemperatureIcon />
            <h3 className="text-lg font-semibold text-red-600">Temperatura</h3>
            {isUsingRealData && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                En vivo
              </span>
            )}
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataToShow}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
                <YAxis
                  domain={[15, 35]}
                  tickFormatter={formatTemperature}
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />

                {/* Líneas de umbral */}
                <ReferenceLine y={26} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
                <ReferenceLine y={18} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />

                <Line
                  type="monotone"
                  dataKey="temp"
                  name="temperatura"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                  connectNulls={false}
                />

                {/* Líneas para la leyenda de umbrales */}
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral máximo"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey={() => null}
                  name="Umbral mínimo"
                  stroke="#f97316"
                  strokeDasharray="4 4"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gráfica de Conductividad - Ancho completo */}
      <div className="bg-white rounded-lg p-4 shadow">
        <div className="flex items-center gap-2 mb-4">
          <ConductivityIcon />
          <h3 className="text-lg font-semibold text-purple-600">Conductividad eléctrica (EC)</h3>
          {isUsingRealData && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
              En vivo
            </span>
          )}
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dataToShow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" stroke="#4b5563" tick={{ fontSize: 12 }} />
              <YAxis
                domain={[0.5, 2]}
                tickFormatter={formatConductivity}
                stroke="#4b5563"
                tick={{ fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />

              {/* Líneas de umbral */}
              <ReferenceLine y={1.6} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />
              <ReferenceLine y={0.9} stroke="#f97316" strokeDasharray="4 4" strokeWidth={1.5} />

              <Line
                type="monotone"
                dataKey="cond"
                name="conductividad"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />

              {/* Líneas para la leyenda de umbrales */}
              <Line
                type="monotone"
                dataKey={() => null}
                name="Umbral máximo"
                stroke="#f97316"
                strokeDasharray="4 4"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey={() => null}
                name="Umbral mínimo"
                stroke="#f97316"
                strokeDasharray="4 4"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Información adicional */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Rango de tiempo: <strong>{timeRange}</strong> |
          Última actualización: <strong>{new Date().toLocaleTimeString('es-ES')}</strong>
        </p>
      </div>
    </div>
  );
};