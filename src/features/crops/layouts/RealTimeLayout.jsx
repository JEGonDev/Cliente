import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useMonitoring } from '../hooks/useMonitoring';
import { RealTimeIndicator } from "../ui/RealTimeIndicator";
import { RealTimeChart } from "../ui/RealTimeChart";
import { TimeSelector } from "../ui/TimeSelector";
import { ThresholdEditModal } from "../ui/ThresholdEditModal";
import { ThresholdSlider } from "../ui/ThresholdSlider";

export const RealTimeLayout = () => {
  const {
    selectedCrop,
    sensors,
    realTimeData,
    thresholds,
    isMonitoring,
    timeRange,
    startMonitoring,
    stopMonitoring,
    changeTimeRange,
    loading,
    error,
    fetchSensorsByCropId,
    updateAllThresholds
  } = useMonitoring();

  const [localThresholds, setLocalThresholds] = useState({
    temperature: { min: 18.0, max: 26.0 },
    humidity: { min: 60, max: 80 },
    ec: { min: 1.0, max: 1.6 },
  });
  const [status, setStatus] = useState(null);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  // Cargar sensores del cultivo seleccionado
  useEffect(() => {
    if (selectedCrop) {
      fetchSensorsByCropId(selectedCrop.id);
    }
  }, [selectedCrop, fetchSensorsByCropId]);

  // Actualizar umbrales locales cuando cambian los del contexto
  useEffect(() => {
    if (Object.keys(thresholds).length > 0) {
      setLocalThresholds(thresholds);
    }
  }, [thresholds]);

  // Obtener datos de monitoreo en tiempo real
  const getCurrentSensorData = () => {
    if (!selectedCrop || !realTimeData || Object.keys(realTimeData).length === 0) {
      return {
        temperature: { current: 0, unit: "°C", trend: "Sin datos", trendTime: "" },
        humidity: { current: 0, unit: "%", trend: "Sin datos", trendTime: "" },
        ec: { current: 0, unit: "mS/cm", trend: "Sin datos", trendTime: "" },
      };
    }

    const result = {};

    // Procesar cada sensor
    Object.entries(realTimeData).forEach(([sensorId, sensorData]) => {
      const sensor = sensors.find(s => s.id === parseInt(sensorId));
      if (sensor && sensorData.current) {
        const sensorType = sensor.type.toLowerCase();
        if (['temperature', 'humidity', 'ec'].includes(sensorType)) {
          result[sensorType] = {
            current: sensorData.current.readingValue,
            unit: sensorType === 'temperature' ? '°C' : sensorType === 'humidity' ? '%' : 'mS/cm',
            trend: sensorData.trend?.value || 'Estable',
            trendDirection: sensorData.trend?.direction || 'stable',
            trendTime: sensorData.trend?.time || 'Sin datos'
          };
        }
      }
    });

    return result;
  };

  const displayData = getCurrentSensorData();

  // Estados de carga y error
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-4 text-gray-600">Cargando datos de monitoreo...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error: {error}</p>
          <button
            onClick={() => fetchSensorsByCropId(selectedCrop?.id)}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!selectedCrop) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay cultivo seleccionado
          </h3>
          <p className="text-gray-600">
            Selecciona un cultivo para ver el monitoreo en tiempo real
          </p>
          <Link
            to="/monitoring/crops"
            className="mt-4 inline-block bg-primary text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Ver cultivos
          </Link>
        </div>
      </div>
    );
  }

  const handleEditThresholds = () => {
    setIsThresholdModalOpen(true);
  };

  const handleSaveThresholds = async (newThresholds) => {
    setStatus("loading");
    try {
      await updateAllThresholds(selectedCrop.id, newThresholds);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus(null), 3000);
    }
  };

  return (
    <div className="p-6">
      {/* Botón de navegación */}
      <div className="mb-4">
        <Link
          to="/monitoring/crops"
          className="inline-block bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 transition"
        >
          ← Volver a cultivos
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monitoreo en tiempo real</h1>
        <div className="flex items-center gap-4">
          <TimeSelector value={timeRange} onChange={changeTimeRange} />
          <button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            className={`px-4 py-2 rounded-md ${isMonitoring
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            {isMonitoring ? 'Detener monitoreo' : 'Iniciar monitoreo'}
          </button>
        </div>
      </div>

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
          trendDirection={displayData.ec.trendDirection}
          trendTime={displayData.ec.trendTime}
          icon="conductivity"
        />
      </div>

      {/* Gráfico de monitoreo en tiempo real */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <RealTimeChart />
      </div>

      {/* Sliders de umbrales */}
      <ThresholdSlider
        thresholds={localThresholds}
        onEditClick={handleEditThresholds}
      />

      {/* Modal para editar umbrales */}
      <ThresholdEditModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        initialThresholds={localThresholds}
        onSave={handleSaveThresholds}
      />

      {/* Notificaciones de estado */}
      {status === "success" && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Umbrales actualizados correctamente</span>
          </div>
        </div>
      )}

      {status === "error" && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>Error al actualizar los umbrales</span>
          </div>
        </div>
      )}
    </div>
  );
};