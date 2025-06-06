<<<<<<< HEAD
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { DateRangeFilter } from '../ui/DateRangeFilter';
=======
import { useState, useEffect, useRef } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
import { StatCard } from '../ui/StatCard';
import { ExportSection } from '../ui/ExportSection';
import { SensorDataPDF } from '../ui/SensorDataPDF';

export const DataHistoryLayout = () => {
  const [range, setRange] = useState('semana');
<<<<<<< HEAD

  const data = [
    { fecha: '2025-05-01', temperatura: 18.2, humedad: 60, ec: 1.1 },
    { fecha: '2025-05-02', temperatura: 20.1, humedad: 62, ec: 1.2 },
    { fecha: '2025-05-03', temperatura: 21.5, humedad: 65, ec: 1.3 },
    { fecha: '2025-05-04', temperatura: 19.8, humedad: 63, ec: 1.2 },
    { fecha: '2025-05-05', temperatura: 22.3, humedad: 64, ec: 1.4 },
    { fecha: '2025-05-06', temperatura: 23.1, humedad: 67, ec: 1.5 },
    { fecha: '2025-05-07', temperatura: 20.7, humedad: 66, ec: 1.3 },
  ];

  // Simular filtrado por rango
  const getFilteredData = () => {
    if (range === 'día') {
      return [data[data.length - 1]]; // Último día
    } else if (range === 'semana') {
      return data.slice(-7); // Últimos 7 días
    } else if (range === 'mes') {
      return data; // Todo (simulado como mes)
    }
    return data;
  };

  const filteredData = getFilteredData();
  const temps = filteredData.map(d => d.temperatura);
  const min = Math.min(...temps).toFixed(1);
  const max = Math.max(...temps).toFixed(1);
  const avg = (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1);
  const stdDev = Math.sqrt(
    temps.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / temps.length
  ).toFixed(2);
=======
  const [selectedSensor, setSelectedSensor] = useState('');
  const [localSelectedCrop, setLocalSelectedCrop] = useState(null);
  const chartRef = useRef(null);

  // Usar el contexto de monitoreo
  const {
    crops,
    sensors,
    readings,
    selectedCrop,
    fetchUserCrops,
    fetchSensorsByCropId,
    fetchReadingHistory,
    loading,
    error
  } = useMonitoring();

  // Cargar cultivos al montar el componente
  useEffect(() => {
    fetchUserCrops();
  }, [fetchUserCrops]);

  // Inicializar el cultivo seleccionado local con el del contexto
  useEffect(() => {
    if (selectedCrop && !localSelectedCrop) {
      setLocalSelectedCrop(selectedCrop);
    }
  }, [selectedCrop]);

  // Cargar sensores cuando se selecciona un cultivo
  useEffect(() => {
    if (localSelectedCrop?.id) {
      fetchSensorsByCropId(localSelectedCrop.id);
      setSelectedSensor(''); // Resetear sensor seleccionado al cambiar de cultivo
    }
  }, [localSelectedCrop?.id, fetchSensorsByCropId]);

  // Cargar lecturas cuando se selecciona cultivo y sensor
  useEffect(() => {
    if (localSelectedCrop?.id && selectedSensor) {
      const now = new Date();
      let startDate = new Date(now);

      switch (range) {
        case 'día':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'semana':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'mes':
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate.setDate(now.getDate() - 7);
      }

      const params = {
        cropId: localSelectedCrop.id,
        sensorId: parseInt(selectedSensor),
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        limit: 100
      };

      fetchReadingHistory(params);
    }
  }, [localSelectedCrop?.id, selectedSensor, range, fetchReadingHistory]);

  // Formatear el nombre del sensor
  const formatSensorName = (sensor) => {
    if (!sensor) return '';

    const sensorTypes = {
      'temperature': 'Temperatura',
      'temperatura': 'Temperatura',
      'sensor temperatura': 'Temperatura',
      'humidity': 'Humedad',
      'humedad': 'Humedad',
      'ec': 'Conductividad',
      'conductividad': 'Conductividad',
      'conductividad electrica': 'Conductividad'
    };

    const type = sensor.sensorType?.toLowerCase();
    const displayType = sensorTypes[type] || type || 'Desconocido';
    const unit = sensor.unitOfMeasurement || getUnit(type);

    // Generar un nombre descriptivo basado en el tipo
    return `Sensor de ${displayType} (${unit})`;
  };

  // Obtener la unidad según el tipo de sensor
  const getUnit = (type) => {
    if (!type) return '';

    const typeMap = {
      'temperature': '°C',
      'temperatura': '°C',
      'sensor temperatura': '°C',
      'humidity': '%',
      'humedad': '%',
      'ec': 'mS/cm',
      'conductividad': 'mS/cm',
      'conductividad electrica': 'mS/cm'
    };
    return typeMap[type.toLowerCase()] || '';
  };

  // Procesar datos para el gráfico
  const getChartData = () => {
    if (!readings || readings.length === 0) return [];

    const selectedSensorData = sensors.find(s => s.id === parseInt(selectedSensor));
    if (!selectedSensorData) return [];

    return readings.map(reading => {
      const date = new Date(reading.readingDate);
      return {
        fecha: date.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        timestamp: date.getTime(),
        valor: reading.readingValue || 0,
        tipo: selectedSensorData.sensorType
      };
    }).sort((a, b) => a.timestamp - b.timestamp);
  };

  // Calcular estadísticas
  const getStatistics = () => {
    if (!readings || readings.length === 0) {
      return { min: 0, max: 0, avg: 0, stdDev: 0 };
    }

    const values = readings.map(r => r.readingValue || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const stdDev = Math.sqrt(
      values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length
    );

    return {
      min: min.toFixed(1),
      max: max.toFixed(1),
      avg: avg.toFixed(1),
      stdDev: stdDev.toFixed(2)
    };
  };

  const chartData = getChartData();
  const stats = getStatistics();
  const selectedSensorData = sensors.find(s => s.id === parseInt(selectedSensor));
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial y análisis de datos</h1>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
<<<<<<< HEAD
        <DateRangeFilter />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Historial de Datos</h2>
          <div className="flex gap-2">
            {['día', 'semana', 'mes'].map((label) => (
              <button
                key={label}
                onClick={() => setRange(label)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  range === label
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </button>
            ))}
=======
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Seleccionar cultivo</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={localSelectedCrop?.id || ''}
              onChange={(e) => {
                const crop = crops.find(c => c.id === parseInt(e.target.value));
                setLocalSelectedCrop(crop || null);
              }}
            >
              <option value="">Seleccionar cultivo</option>
              {crops.map(crop => (
                <option key={crop.id} value={crop.id}>
                  {crop.cropName || crop.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Sensor</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              disabled={!localSelectedCrop}
            >
              <option value="">Seleccionar sensor</option>
              {sensors.map(sensor => (
                <option key={sensor.id} value={sensor.id}>
                  {formatSensorName(sensor)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Cargando datos...</span>
        </div>
      )}

      {/* Mensaje cuando no hay datos */}
      {!loading && (!localSelectedCrop || !selectedSensor) && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            {!localSelectedCrop
              ? 'Selecciona un cultivo para ver su historial'
              : 'Selecciona un sensor para ver el historial de datos'
            }
          </p>
        </div>
      )}

      {/* Contenido cuando hay datos */}
      {!loading && localSelectedCrop && selectedSensor && (
        <>
          {/* Gráfico */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">
                Historial de {selectedSensorData ? formatSensorName(selectedSensorData) : 'datos'}
              </h2>
              <div className="flex gap-2">
                {['día', 'semana', 'mes'].map((label) => (
                  <button
                    key={label}
                    onClick={() => setRange(label)}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${range === label
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                  >
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {chartData.length > 0 ? (
              <div ref={chartRef}>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="fecha"
                      interval="preserveStartEnd"
                      minTickGap={50}
                    />
                    <YAxis
                      label={{
                        value: selectedSensorData?.unitOfMeasurement,
                        angle: -90,
                        position: 'insideLeft'
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="valor"
                      name={selectedSensorData ? formatSensorName(selectedSensorData) : 'Valor'}
                      stroke="#4F46E5"
                      dot={false}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos disponibles para el período seleccionado
              </div>
            )}
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
          </div>
        </div>

<<<<<<< HEAD
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="temperatura" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="humedad" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="ec" stroke="#f97316" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium mb-4">Estadísticas</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard label="Valor mínimo" value={`${min}°C`} color="blue" percentage={20} />
          <StatCard label="Valor promedio" value={`${avg}°C`} color="blue" percentage={50} />
          <StatCard label="Valor máximo" value={`${max}°C`} color="black" percentage={80} />
          <StatCard label="Desviación estándar" value={`${stdDev}°C`} color="blue" percentage={30} />
        </div>
      </div>

      <ExportSection />
=======
          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatCard
              title="Valor mínimo"
              value={`${stats.min} ${selectedSensorData?.unitOfMeasurement || ''}`}
              description="Lectura más baja registrada"
            />
            <StatCard
              title="Valor máximo"
              value={`${stats.max} ${selectedSensorData?.unitOfMeasurement || ''}`}
              description="Lectura más alta registrada"
            />
            <StatCard
              title="Promedio"
              value={`${stats.avg} ${selectedSensorData?.unitOfMeasurement || ''}`}
              description="Media de las lecturas"
            />
            <StatCard
              title="Desviación estándar"
              value={`±${stats.stdDev} ${selectedSensorData?.unitOfMeasurement || ''}`}
              description="Variabilidad de los datos"
            />
          </div>

          {/* Sección de exportación */}
          <ExportSection
            data={chartData}
            sensorType={selectedSensorData?.sensorType}
            cropName={localSelectedCrop.cropName}
            dateRange={range}
            stats={stats}
            chartRef={chartRef}
          />
        </>
      )}
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    </div>
  );
};
