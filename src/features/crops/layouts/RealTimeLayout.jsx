import { useState, useEffect, useCallback } from "react";
import { Link } from 'react-router-dom';
import { useMonitoring } from '../hooks/useMonitoring';
import { RealTimeIndicator } from "../ui/RealTimeIndicator";
import { RealTimeChart } from "../ui/RealTimeChart";
import { TimeSelector } from "../ui/TimeSelector";
import { ThresholdEditModal } from "../ui/ThresholdEditModal";
import { ThresholdSlider } from "../ui/ThresholdSlider";
import { ManualReadingSection } from "../ui/ManualReadingSection";
import { Database, Activity, Eye, EyeOff } from 'lucide-react';

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
  const [activeSection, setActiveSection] = useState('monitoring'); // 'monitoring' | 'manual-readings'
  const [showManualReadings, setShowManualReadings] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Cargar sensores del cultivo seleccionado solo una vez al inicio
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      if (selectedCrop && isInitialLoad) {
        try {
          await fetchSensorsByCropId(selectedCrop.id);
          if (isMounted) {
            setIsInitialLoad(false);
          }
        } catch (error) {
          console.error('Error loading sensors:', error);
        }
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, [selectedCrop, fetchSensorsByCropId, isInitialLoad]);

  // Actualizar umbrales locales cuando cambian los del contexto
  useEffect(() => {
    if (Object.keys(thresholds).length > 0) {
      setLocalThresholds(thresholds);
    }
  }, [thresholds]);

  // Función para cambiar de sección
  const handleSectionChange = useCallback((section) => {
    setActiveSection(section);
    // Detener monitoreo en tiempo real si cambiamos a lecturas manuales
    if (section === 'manual-readings' && isMonitoring) {
      stopMonitoring();
    }
  }, [isMonitoring, stopMonitoring]);

  // Función para manejar la edición de umbrales
  const handleEditThresholds = useCallback(() => {
    setIsThresholdModalOpen(true);
  }, []);

  // Función para guardar umbrales
  const handleSaveThresholds = useCallback(async (newThresholds) => {
    try {
      await updateAllThresholds(selectedCrop.id, newThresholds);
      setLocalThresholds(newThresholds);
      setIsThresholdModalOpen(false);
    } catch (error) {
      console.error('Error updating thresholds:', error);
    }
  }, [selectedCrop, updateAllThresholds]);

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

  // Estado de carga
  if (loading && !sensors.length) {
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

  return (
    <div className="space-y-6 p-6">
      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          {/* Selector de sección */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleSectionChange('monitoring')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'monitoring'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Activity size={16} />
              Monitoreo en Vivo
            </button>
            <button
              onClick={() => handleSectionChange('manual-readings')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSection === 'manual-readings'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <Database size={16} />
              Lecturas Manuales
            </button>
          </div>
        </div>

        {/* Controles según la sección activa */}
        {activeSection === 'monitoring' && (
          <div className="flex items-center gap-4">
            <TimeSelector value={timeRange} onChange={changeTimeRange} />
            <button
              onClick={isMonitoring ? stopMonitoring : startMonitoring}
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${isMonitoring
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              {isMonitoring ? <EyeOff size={16} /> : <Eye size={16} />}
              {isMonitoring ? 'Detener monitoreo' : 'Iniciar monitoreo'}
            </button>
          </div>
        )}
      </div>

      {/* Título con información del cultivo */}
      <div className="bg-white rounded-lg p-4 border-l-4 border-primary">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {activeSection === 'monitoring' ? 'Monitoreo en Tiempo Real' : 'Lecturas Manuales'}
            </h1>
            <p className="text-gray-600 mt-1">
              Cultivo: <span className="font-medium">{selectedCrop?.name}</span>
              <span className="ml-4 text-sm">
                {sensors.filter(s => s.cropId === selectedCrop?.id).length} sensores asociados
              </span>
            </p>
          </div>

          {activeSection === 'monitoring' && (
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-400 animate-pulse' : 'bg-gray-300'
                }`}></div>
              <span className="text-sm text-gray-600">
                {isMonitoring ? 'En vivo' : 'Detenido'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Contenido según la sección activa */}
      {activeSection === 'monitoring' ? (
        <>
          {/* Indicadores en tiempo real */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Gráficos en Tiempo Real</h2>
              <div className="text-sm text-gray-500">
                Actualización automática cada {isMonitoring ? '1 minuto' : 'detenida'}
              </div>
            </div>
            <RealTimeChart />
          </div>

          {/* Sliders de umbrales */}
          <ThresholdSlider
            thresholds={localThresholds}
            onEditClick={handleEditThresholds}
          />
        </>
      ) : (
        /* Sección de lecturas manuales */
        <ManualReadingSection key={selectedCrop?.id} />
      )}

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

      {status === "loading" && (
        <div className="fixed bottom-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-blue-600"></div>
            <span>Actualizando umbrales...</span>
          </div>
        </div>
      )}
    </div>
  );
};