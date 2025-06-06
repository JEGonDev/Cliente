import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { RealTimeIndicator } from "../ui/RealTimeIndicator";
import { RealTimeChart } from "../ui/RealTimeChart";
<<<<<<< HEAD
import { TimeSelector } from "../ui/TimeSelector";
import { ThresholdEditModal } from "../ui/ThresholdEditModal"; 
import { Link } from 'react-router-dom';
=======
import { ThresholdEditModal } from "../ui/ThresholdEditModal";
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
import { ThresholdSlider } from "../ui/ThresholdSlider";

<<<<<<< HEAD
// Valores por defecto para umbrales
const defaultThresholds = {
  temperature: { min: 18.0, max: 26.0 },
  humidity: { min: 60, max: 80 },
  ec: { min: 1.0, max: 1.6 },
};

// Datos de ejemplo 
const demoData = {
  temperature: {
    current: 22.4,
    unit: "°C",
    trend: "+0.3",
    trendDirection: "up",
    trendTime: "última hora",
  },
  humidity: {
    current: 68,
    unit: "%",
    trend: "-2",
    trendDirection: "down",
    trendTime: "última hora",
  },
  ec: {
    current: 1.3,
    unit: "mS/cm",
    trend: "Estable",
    trendTime: "hace 2h",
  },
};

/**
 * Layout para la sección de monitoreo en tiempo real
 * Ahora incluye sliders visuales para umbrales y modal de edición
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.data - Datos para mostrar en tiempo real
 */
export const RealTimeLayout = ({ data = {} }) => {
  const isValidData =
    data?.temperature?.current !== undefined &&
    data?.humidity?.current !== undefined &&
    data?.ec?.current !== undefined;

  const displayData = isValidData ? data : demoData;

  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);

  // Actualiza thresholds si vienen desde props.data
  useEffect(() => {
    if (data?.thresholds) {
      setThresholds((prevThresholds) => ({
        ...prevThresholds,
        ...data.thresholds,
      }));
=======
export const RealTimeLayout = () => {
  console.log('RealTimeLayout: Componente renderizado');

  const {
    selectedCrop,
    sensors,
    realTimeData,
    thresholds,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    loading: globalLoading,
    error: globalError,
    updateAllThresholds,
    loadThresholds,
    getReadingsByCropId
  } = useMonitoring();

  console.log('RealTimeLayout: selectedCrop:', selectedCrop);

  const [localThresholds, setLocalThresholds] = useState({});
  const [status, setStatus] = useState(null);
  const [isThresholdModalOpen, setIsThresholdModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('monitoring'); // 'monitoring' | 'manual-readings'
  const [readings, setReadings] = useState([]);

  // Cargar umbrales cuando cambia el cultivo seleccionado
  useEffect(() => {
    if (selectedCrop?.id) {
      loadThresholds(selectedCrop.id);
    }
  }, [selectedCrop?.id, loadThresholds]);

  // Actualizar umbrales locales cuando cambian los del contexto
  useEffect(() => {
    if (Object.keys(thresholds).length > 0) {
      console.log('Actualizando umbrales locales:', thresholds);
      setLocalThresholds(thresholds);
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
    }
  }, [data]);

<<<<<<< HEAD
  // Maneja apertura del modal de edición
  const handleEditThresholds = () => {
    setIsThresholdModalOpen(true);
=======
  // Efecto para cargar las lecturas cuando cambia el cultivo o cuando se crean nuevas lecturas
  useEffect(() => {
    const loadReadings = async () => {
      if (selectedCrop?.id) {
        try {
          const response = await getReadingsByCropId(selectedCrop.id);
          setReadings(response.data || []);
        } catch (error) {
          console.error('Error al cargar lecturas:', error);
        }
      }
    };

    loadReadings();

    // Configurar un intervalo para actualizar las lecturas cada 5 segundos cuando no hay monitoreo en tiempo real
    if (!isMonitoring) {
      const interval = setInterval(loadReadings, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedCrop?.id, getReadingsByCropId, isMonitoring]);

  // Efecto para actualizar las lecturas cuando hay nuevos datos en tiempo real
  useEffect(() => {
    if (realTimeData && Object.keys(realTimeData).length > 0) {
      const loadReadings = async () => {
        if (selectedCrop?.id) {
          try {
            const response = await getReadingsByCropId(selectedCrop.id);
            setReadings(response.data || []);
          } catch (error) {
            console.error('Error al cargar lecturas:', error);
          }
        }
      };
      loadReadings();
    }
  }, [realTimeData, selectedCrop?.id, getReadingsByCropId]);

  // Verificar si hay sensores configurados
  const hasSensorsConfigured = sensors && sensors.length > 0;

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
      setStatus('loading');
      const success = await updateAllThresholds(selectedCrop.id, newThresholds);

      if (success) {
        setStatus('success');
        setLocalThresholds(newThresholds);
        setIsThresholdModalOpen(false);

        // Recargar los umbrales después de un breve delay
        setTimeout(() => {
          loadThresholds(selectedCrop.id);
        }, 500);
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error updating thresholds:', error);
      setStatus('error');
    } finally {
      // Limpiar el estado después de 3 segundos
      setTimeout(() => {
        setStatus(null);
      }, 3000);
    }
  }, [selectedCrop?.id, updateAllThresholds, loadThresholds]);

  // Obtener datos de monitoreo en tiempo real
  const getCurrentSensorData = () => {
    // Si hay datos en tiempo real, usarlos
    if (isMonitoring && realTimeData && Object.keys(realTimeData).length > 0) {
      const result = {};

      // Procesar datos en tiempo real
      Object.entries(realTimeData).forEach(([sensorId, sensorData]) => {
        const sensor = sensors.find(s => s.id === parseInt(sensorId));
        if (sensor && sensorData.current) {
          // Normalizar el tipo de sensor
          const sensorTypeMap = {
            'temperature': 'temperature',
            'temperatura': 'temperature',
            'sensor temperatura': 'temperature',
            'humidity': 'humidity',
            'humedad': 'humidity',
            'tds': 'tds',
            'conductividad electrica': 'tds'
          };

          const normalizedType = sensorTypeMap[sensor.sensorType.toLowerCase()] || sensor.sensorType.toLowerCase();

          if (['temperature', 'humidity', 'tds'].includes(normalizedType)) {
            result[normalizedType] = {
              current: parseFloat(sensorData.current.readingValue),
              unit: normalizedType === 'temperature' ? '°C' : normalizedType === 'humidity' ? '%' : 'mS/cm',
              trend: sensorData.trend?.value || 'Estable',
              trendDirection: sensorData.trend?.direction || 'stable',
              trendTime: sensorData.trend?.time || 'Sin datos'
            };
          }
        }
      });

      return result;
    }

    // Si no hay datos en tiempo real, usar las últimas lecturas manuales
    console.log('Usando lecturas manuales:', readings);

    // Crear un mapa para almacenar la última lectura de cada tipo de sensor
    const latestReadings = {};

    // Iterar sobre todas las lecturas para encontrar las más recientes por tipo
    readings.forEach(reading => {
      const sensorTypeMap = {
        'temperature': 'temperature',
        'temperatura': 'temperature',
        'sensor temperatura': 'temperature',
        'humidity': 'humidity',
        'humedad': 'humidity',
        'tds': 'tds',
        'conductividad electrica': 'tds'
      };

      const normalizedType = sensorTypeMap[reading.sensorType.toLowerCase()] || reading.sensorType.toLowerCase();

      const currentLatest = latestReadings[normalizedType];

      // Si no hay lectura previa o esta es más reciente, actualizar
      if (!currentLatest || new Date(reading.readingDate) > new Date(currentLatest.readingDate)) {
        latestReadings[normalizedType] = reading;
      }
    });

    // Crear el objeto de respuesta con el formato esperado
    const result = {
      temperature: {
        current: 0,
        unit: "°C",
        trend: "Sin datos",
        trendTime: ""
      },
      humidity: {
        current: 0,
        unit: "%",
        trend: "Sin datos",
        trendTime: ""
      },
      tds: {
        current: 0,
        unit: "mS/cm",
        trend: "Sin datos",
        trendTime: ""
      }
    };

    // Actualizar los valores con las últimas lecturas
    Object.entries(latestReadings).forEach(([type, reading]) => {
      if (result[type]) {
        result[type] = {
          current: parseFloat(reading.readingValue),
          unit: reading.unitOfMeasurement,
          trend: "Estable",
          trendTime: new Date(reading.readingDate).toLocaleString(),
          trendDirection: 'stable'
        };
      }
    });

    console.log('Datos procesados:', result);
    return result;
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
  };

  //  Maneja guardado desde el modal
  const handleSaveThresholdsFromModal = async (newThresholds) => {
    try {
      // Simular llamada a API (reemplaza con tu endpoint real)
      const response = await fetch("/api/thresholds", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newThresholds),
      });

<<<<<<< HEAD
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Actualizar los umbrales locales inmediatamente
      setThresholds(newThresholds);
      setStatus("success");
      setTimeout(() => setStatus(null), 3000);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error saving thresholds:', error);
      throw error; // Re-lanzar para que el modal lo maneje
    }
  };
=======
  // Estado de carga
  if (globalLoading && !sensors.length) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-4 text-gray-600">Cargando datos de monitoreo...</span>
        </div>
      </div>
    );
  }

  if (globalError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-700">Error: {globalError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407

  const handleSaveThresholds = async () => {
    setStatus("loading");
    try {
      await handleSaveThresholdsFromModal(thresholds);
    } catch (error) {
      setStatus("error");
    }
  };

  // Mensaje cuando no hay sensores configurados
  if (!hasSensorsConfigured) {
    return (
      <div className="p-6">
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-gray-400 text-5xl mb-4">🌱</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No hay sensores configurados
          </h3>
          <p className="text-gray-600 mb-6">
            Este cultivo aún no tiene sensores asociados. Necesitas configurar sensores para poder establecer umbrales y monitorear en tiempo real.
          </p>
          <Link
            to="/monitoring/crops"
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            Configurar sensores
          </Link>
        </div>
      </div>
    );
  }

  return (
<<<<<<< HEAD
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

      <h1 className="text-2xl font-bold mb-6">Monitoreo en tiempo real</h1>

      {/* Indicadores en tiempo real (existentes) */}
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
=======
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
              Cultivo: <span className="font-medium">{selectedCrop?.cropName}</span>
              <span className="ml-4 text-sm">
                {`${sensors.length} sensores asociados`}
              </span>
            </p>
          </div>
        </div>
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
      </div>

      {/* Gráfico de monitoreo en tiempo real (existente) */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Monitoreo en tiempo real</h2>
          <TimeSelector />
        </div>
        <RealTimeChart />
      </div>

      {/* Sliders de umbrales en lugar del formulario */}
      <ThresholdSlider
        thresholds={thresholds}
        onEditClick={handleEditThresholds}
      />

<<<<<<< HEAD
      {/*  Modal para editar umbrales */}
=======
            <RealTimeIndicator
              label="EC"
              value={displayData.tds.current}
              unit={displayData.tds.unit}
              trend={displayData.tds.trend}
              trendDirection={displayData.tds.trendDirection}
              trendTime={displayData.tds.trendTime}
              icon="conductivity"
            />
          </div>

          {/* Gráfico de monitoreo en tiempo real */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Gráficos en Tiempo Real</h2>
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
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
      <ThresholdEditModal
        isOpen={isThresholdModalOpen}
        onClose={() => setIsThresholdModalOpen(false)}
        initialThresholds={thresholds}
        onSave={handleSaveThresholdsFromModal}
      />

      {/* NOTIFICACIÓN GLOBAL DE ÉXITO */}
      {status === "success" && (
        <div className="fixed bottom-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>Umbrales actualizados correctamente</span>
          </div>
        </div>
      )}
    </div>
  );
};

RealTimeLayout.propTypes = {
  data: PropTypes.shape({
    temperature: PropTypes.shape({
      current: PropTypes.number,
      unit: PropTypes.string,
      trend: PropTypes.string,
      trendDirection: PropTypes.string,
      trendTime: PropTypes.string,
    }),
    humidity: PropTypes.shape({
      current: PropTypes.number,
      unit: PropTypes.string,
      trend: PropTypes.string,
      trendDirection: PropTypes.string,
      trendTime: PropTypes.string,
    }),
    ec: PropTypes.shape({
      current: PropTypes.number,
      unit: PropTypes.string,
      trend: PropTypes.string,
      trendTime: PropTypes.string,
    }),
    thresholds: PropTypes.shape({
      temperature: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
      }),
      humidity: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
      }),
      ec: PropTypes.shape({
        min: PropTypes.number,
        max: PropTypes.number,
      }),
    }),
  }),
};