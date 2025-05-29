import { useState, useEffect } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { StatCard } from '../ui/StatCard';
import { ExportSection } from '../ui/ExportSection';

export const DataHistoryLayout = () => {
  const [range, setRange] = useState('semana');
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedSensor, setSelectedSensor] = useState('');

  // Usar el contexto de monitoreo
  const {
    crops,
    sensors,
    readings,
    selectedCrop: contextSelectedCrop,
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

  // Cargar sensores cuando se selecciona un cultivo
  useEffect(() => {
    if (selectedCrop) {
      fetchSensorsByCropId(parseInt(selectedCrop));
    }
  }, [selectedCrop, fetchSensorsByCropId]);

  // Cargar lecturas cuando se selecciona cultivo y sensor
  useEffect(() => {
    if (selectedCrop && selectedSensor) {
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
        cropId: parseInt(selectedCrop),
        sensorId: parseInt(selectedSensor),
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        limit: 100
      };

      fetchReadingHistory(params);
    }
  }, [selectedCrop, selectedSensor, range, fetchReadingHistory]);

  // Procesar datos para el gráfico
  const getChartData = () => {
    if (!readings || readings.length === 0) return [];

    return readings.map(reading => ({
      fecha: new Date(reading.readingDate).toLocaleDateString('es-ES'),
      temperatura: reading.readingValue || 0,
      humedad: reading.readingValue || 0, // Esto depende del tipo de sensor
      ec: reading.readingValue || 0
    }));
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Historial y análisis de datos</h1>

      {/* Filtros mejorados */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Cultivo</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="">Seleccionar cultivo</option>
              {crops.map(crop => (
                <option key={crop.id} value={crop.id}>{crop.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Sensor</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              disabled={!selectedCrop}
            >
              <option value="">Seleccionar sensor</option>
              {sensors.map(sensor => (
                <option key={sensor.id} value={sensor.id}>
                  {sensor.name} ({sensor.type})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Período</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={range}
              onChange={(e) => setRange(e.target.value)}
            >
              <option value="día">Último día</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mes</option>
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
      {!loading && (!selectedCrop || !selectedSensor) && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600">
            Selecciona un cultivo y un sensor para ver el historial de datos
          </p>
        </div>
      )}

      {/* Contenido cuando hay datos */}
      {!loading && selectedCrop && selectedSensor && (
        <>
          {/* Gráfico */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Historial de Datos</h2>
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
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="fecha" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="temperatura" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No hay datos disponibles para el período seleccionado
              </div>
            )}
          </div>

          {/* Estadísticas */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Estadísticas</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Valor mínimo" value={`${stats.min}°C`} color="blue" percentage={20} />
              <StatCard label="Valor promedio" value={`${stats.avg}°C`} color="green" percentage={50} />
              <StatCard label="Valor máximo" value={`${stats.max}°C`} color="red" percentage={80} />
              <StatCard label="Desviación estándar" value={`${stats.stdDev}°C`} color="purple" percentage={30} />
            </div>
          </div>
        </>
      )}

      <ExportSection />
    </div>
  );
};
