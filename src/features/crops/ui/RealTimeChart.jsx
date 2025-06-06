<<<<<<< HEAD
=======
import { useMonitoring } from '../hooks/useMonitoring';
import { useMemo, useEffect, useState, useCallback } from 'react';
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';

const sampleData = [
  { time: '00:00', temp: 22, hum: 80, cond: 1.2 },
  { time: '02:00', temp: 21, hum: 75, cond: 1.3 },
  { time: '04:00', temp: 20, hum: 70, cond: 1.4 },
  { time: '06:00', temp: 22, hum: 68, cond: 1.2 },
  { time: '08:00', temp: 25, hum: 65, cond: 1.1 },
  { time: '10:00', temp: 28, hum: 60, cond: 1.0 },
  { time: '12:00', temp: 30, hum: 55, cond: 0.9 },
  { time: '14:00', temp: 29, hum: 58, cond: 1.1 },
  { time: '16:00', temp: 27, hum: 62, cond: 1.2 },
  { time: '18:00', temp: 24, hum: 66, cond: 1.3 },
  { time: '20:00', temp: 23, hum: 70, cond: 1.4 },
  { time: '22:00', temp: 22, hum: 75, cond: 1.5 }
];

// Funciones para formatear valores
const formatTemperature = (value) => `${value} °C`;
const formatHumidity = (value) => `${value} %`;
const formatConductivity = (value) => `${value} dS/m`;

// Componentes de iconos (sin cambios, solo para referencia visual)
const HumidityIcon = () => (
  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const TemperatureIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v4a6 6 0 1012 0V6a4 4 0 00-4-4zM8 6a2 2 0 114 0v7.5a3.5 3.5 0 11-4-3.45V6z" clipRule="evenodd" />
  </svg>
);

const ConductivityIcon = () => (
  <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
  </svg>
);

// Componente de Tooltip Personalizado
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // El 'payload' contiene los datos de todas las líneas en el punto actual
    const dataPoint = payload[0].payload; // Accede al objeto de datos completo (ej. { time: '00:00', temp: 22, hum: 80, cond: 1.2 })

<<<<<<< HEAD
=======
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
    thresholds,
    loading,
    getReadingsByCropId,
    isMonitoring
  } = useMonitoring();

  const [chartReadings, setChartReadings] = useState([]);

  // Función para cargar lecturas
  const loadReadings = useCallback(async () => {
    if (selectedCrop?.id) {
      try {
        const response = await getReadingsByCropId(selectedCrop.id);
        setChartReadings(response.data || []);
      } catch (error) {
        console.error('Error al cargar lecturas:', error);
      }
    }
  }, [selectedCrop?.id, getReadingsByCropId]);

  // Efecto para cargar lecturas iniciales y configurar actualizaciones
  useEffect(() => {
    loadReadings();

    // Actualizar cada 5 segundos
    const interval = setInterval(loadReadings, 5000);
    return () => clearInterval(interval);
  }, [loadReadings, selectedCrop?.id]);

  // Efecto adicional para actualizar cuando hay nuevos datos en tiempo real
  useEffect(() => {
    if (realTimeData && Object.keys(realTimeData).length > 0) {
      loadReadings();
    }
  }, [realTimeData, loadReadings]);

  // Procesar datos para el gráfico
  const chartData = useMemo(() => {
    const timePoints = new Map();

    // Función para procesar una lectura
    const processReading = (reading, sensorType) => {
      const date = new Date(reading.readingDate);
      const time = date.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
      });

      if (!timePoints.has(time)) {
        timePoints.set(time, {
          time,
          timestamp: date.getTime(),
          temp: null,
          hum: null,
          cond: null
        });
      }

      const point = timePoints.get(time);

      switch (sensorType.toLowerCase()) {
        case 'temperature':
        case 'sensor temperatura':
          point.temp = reading.readingValue;
          break;
        case 'humidity':
        case 'humedad':
          point.hum = reading.readingValue;
          break;
        case 'tds':
        case 'conductividad electrica':
          point.cond = reading.readingValue;
          break;
        default:
          break;
      }
    };

    // Procesar datos en tiempo real si están disponibles
    if (realTimeData && Object.keys(realTimeData).length > 0) {
      Object.entries(realTimeData).forEach(([sensorId, sensorData]) => {
        if (sensorData.history && sensorData.history.length > 0) {
          const sensor = sensors.find(s => s.id === parseInt(sensorId));
          if (sensor) {
            sensorData.history.forEach(reading => {
              processReading(reading, sensor.type);
            });
          }
        }
      });
    }

    // Procesar lecturas del estado local
    chartReadings.forEach(reading => {
      processReading(reading, reading.sensorType);
    });

    // Convertir el Map a array y ordenar por timestamp
    const sortedData = Array.from(timePoints.values())
      .sort((a, b) => a.timestamp - b.timestamp);

    // Interpolar valores faltantes
    const interpolatedData = [];
    for (let i = 0; i < sortedData.length; i++) {
      const current = sortedData[i];
      interpolatedData.push(current);

      if (i < sortedData.length - 1) {
        const next = sortedData[i + 1];
        const timeDiff = next.timestamp - current.timestamp;

        if (timeDiff > 15 * 60 * 1000) {
          const steps = Math.floor(timeDiff / (15 * 60 * 1000));
          for (let j = 1; j <= steps; j++) {
            const fraction = j / (steps + 1);
            const interpolatedTime = new Date(current.timestamp + timeDiff * fraction);
            const interpolatedPoint = {
              time: interpolatedTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              }),
              timestamp: interpolatedTime.getTime(),
              temp: current.temp !== null && next.temp !== null
                ? current.temp + (next.temp - current.temp) * fraction
                : null,
              hum: current.hum !== null && next.hum !== null
                ? current.hum + (next.hum - current.hum) * fraction
                : null,
              cond: current.cond !== null && next.cond !== null
                ? current.cond + (next.cond - current.cond) * fraction
                : null
            };
            interpolatedData.push(interpolatedPoint);
          }
        }
      }
    }

    return interpolatedData;
  }, [realTimeData, sensors, chartReadings]);

  // Estado de carga
  if (loading) {
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-md text-sm">
        <p className="font-semibold text-gray-800 mb-1">{`Tiempo: ${label}`}</p>
        <p className="text-blue-600">{`Humedad: ${formatHumidity(dataPoint.hum)}`}</p>
        <p className="text-red-600">{`Temperatura: ${formatTemperature(dataPoint.temp)}`}</p>
        <p className="text-purple-600">{`Conductividad: ${formatConductivity(dataPoint.cond)}`}</p>
      </div>
    );
  }

<<<<<<< HEAD
  return null;
};


export const RealTimeChart = () => {
=======
  // Si no hay datos, mostrar mensaje
  if (chartData.length === 0) {
    return (
      <div className="w-full space-y-6">
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay datos para mostrar
          </h3>
          <p className="text-gray-600">
            {selectedCrop ?
              'Los datos se mostrarán cuando haya lecturas disponibles.' :
              'Selecciona un cultivo para ver datos en tiempo real.'
            }
          </p>
        </div>
      </div>
    );
  }

  // Obtener umbrales actuales
  const currentThresholds = thresholds || {};

  // Modificar las propiedades de las líneas en los gráficos
  const lineProps = {
    type: "monotone",
    strokeWidth: 2,
    dot: { r: 3 },
    activeDot: { r: 5 },
    connectNulls: true // Cambiar a true para conectar puntos no nulos
  };

>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
  return (
    <div className="w-full space-y-6">
      {/* Grid para humedad y temperatura */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Gráfica de Humedad */}
        <div className="bg-white rounded-lg p-4 shadow">
          <div className="flex items-center gap-2 mb-4">
            <HumidityIcon />
            <h3 className="text-lg font-semibold text-blue-600">Humedad</h3>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
<<<<<<< HEAD
              <LineChart data={sampleData}>
=======
              <LineChart data={chartData}>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[
                    dataMin => Math.max(0, Math.floor(dataMin - 5)),
                    dataMax => Math.min(100, Math.ceil(dataMax + 5))
                  ]}
                  tickFormatter={formatHumidity}
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                />
                {/* Usar el CustomTooltip */}
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />

                {currentThresholds.humidity && (
                  <>
                    <ReferenceLine
                      y={currentThresholds.humidity.max}
                      stroke="#f97316"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{ value: 'Máx', position: 'right' }}
                    />
                    <ReferenceLine
                      y={currentThresholds.humidity.min}
                      stroke="#f97316"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{ value: 'Mín', position: 'right' }}
                    />
                  </>
                )}

                <Line
                  {...lineProps}
                  dataKey="hum"
                  name="humedad"
                  stroke="#3b82f6"
<<<<<<< HEAD
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
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
=======
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
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
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
<<<<<<< HEAD
              <LineChart data={sampleData}>
=======
              <LineChart data={chartData}>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
<<<<<<< HEAD
                  domain={[15, 30]}
=======
                  domain={[
                    dataMin => Math.max(0, Math.floor(dataMin - 2)),
                    dataMax => Math.ceil(dataMax + 2)
                  ]}
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
                  tickFormatter={formatTemperature}
                  stroke="#4b5563"
                  tick={{ fontSize: 12 }}
                />
                {/* Usar el CustomTooltip */}
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} />

                {currentThresholds.temperature && (
                  <>
                    <ReferenceLine
                      y={currentThresholds.temperature.max}
                      stroke="#f97316"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{ value: 'Máx', position: 'right' }}
                    />
                    <ReferenceLine
                      y={currentThresholds.temperature.min}
                      stroke="#f97316"
                      strokeDasharray="4 4"
                      strokeWidth={1.5}
                      label={{ value: 'Mín', position: 'right' }}
                    />
                  </>
                )}

                <Line
                  {...lineProps}
                  dataKey="temp"
                  name="temperatura"
                  stroke="#ef4444"
<<<<<<< HEAD
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
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
=======
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
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
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
<<<<<<< HEAD
            <LineChart data={sampleData}>
=======
            <LineChart data={chartData}>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                stroke="#4b5563"
                tick={{ fontSize: 12 }}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[
                  dataMin => Math.max(0, Math.floor(dataMin - 0.2)),
                  dataMax => Math.ceil(dataMax + 0.2)
                ]}
                tickFormatter={formatConductivity}
                stroke="#4b5563"
                tick={{ fontSize: 12 }}
              />
              {/* Usar el CustomTooltip */}
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />

              {currentThresholds.ec && (
                <>
                  <ReferenceLine
                    y={currentThresholds.ec.max}
                    stroke="#f97316"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{ value: 'Máx', position: 'right' }}
                  />
                  <ReferenceLine
                    y={currentThresholds.ec.min}
                    stroke="#f97316"
                    strokeDasharray="4 4"
                    strokeWidth={1.5}
                    label={{ value: 'Mín', position: 'right' }}
                  />
                </>
              )}

              <Line
                {...lineProps}
                dataKey="cond"
                name="conductividad"
                stroke="#10b981"
<<<<<<< HEAD
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
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
=======
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
<<<<<<< HEAD
=======

      {/* Información adicional */}
      <div className="text-center text-sm text-gray-600">
        <p>
          Última actualización: <strong>{new Date().toLocaleTimeString('es-ES')}</strong>
        </p>
      </div>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    </div>
  );
};