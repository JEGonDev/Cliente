import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Droplets, Thermometer, Pencil, Cpu } from 'lucide-react';
import PropTypes from 'prop-types';
import { CropStatusBadge } from './CropStatusBadge';
import { EditCropModal } from './EditCropModal';
import { SensorManagementModal } from './SensorManagementModal';
import { useMonitoring } from '../hooks/useMonitoring';
import { cropService } from '../services/cropService';

export const CropCard = ({ crop, onClick, onModalOpen, onModalClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cropSensors, setCropSensors] = useState([]);
  const [cropAlerts, setCropAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    fetchSensorsByCropId,
    fetchAlertsByCropId,
    removeSensorAndDelete,
    createSensorAndAssociateToCrop,
    loading
  } = useMonitoring();

  // Efecto para cargar datos cuando se monta el componente
  useEffect(() => {
    let isMounted = true;
    let intervalId;

    const loadData = async () => {
      if (!crop?.id || isLoading) return;

      setIsLoading(true);
      setError(null);
      try {
        console.log(`[CropCard ${crop.id}] Iniciando carga de datos`);

        // Cargar sensores y lecturas recientes
        const [sensorsResponse, readingsResponse] = await Promise.all([
          fetchSensorsByCropId(crop.id),
          cropService.getReadingsByCropId(crop.id)
        ]);

        console.log(`[CropCard ${crop.id}] Respuesta de sensores:`, sensorsResponse);
        console.log(`[CropCard ${crop.id}] Respuesta de lecturas:`, readingsResponse);

        if (!isMounted) return;

        // Procesar sensores
        let sensors = Array.isArray(sensorsResponse) ? sensorsResponse :
          Array.isArray(sensorsResponse?.data) ? sensorsResponse.data : [];

        // Obtener las lecturas y ordenarlas por fecha
        const readings = readingsResponse?.data || [];
        const latestReadings = new Map();

        console.log(`[CropCard ${crop.id}] Lecturas obtenidas:`, readings);

        // Si no hay sensores pero hay lecturas, reconstruir los sensores desde las lecturas
        if (sensors.length === 0 && readings.length > 0) {
          console.log(`[CropCard ${crop.id}] Reconstruyendo sensores desde lecturas`);

          // Crear un Map para agrupar lecturas por sensorId
          const sensorReadings = new Map();
          readings.forEach(reading => {
            if (!sensorReadings.has(reading.sensorId)) {
              sensorReadings.set(reading.sensorId, {
                id: reading.sensorId,
                sensorType: reading.sensorType,
                unitOfMeasurement: reading.unitOfMeasurement,
                cropId: reading.cropId
              });
            }
          });

          sensors = Array.from(sensorReadings.values());
          console.log(`[CropCard ${crop.id}] Sensores reconstruidos:`, sensors);
        }

        console.log(`[CropCard ${crop.id}] Sensores procesados:`, sensors);

        // Procesar las lecturas para obtener la más reciente de cada sensor
        readings.forEach(reading => {
          const sensorId = reading.sensorId;
          const currentLatest = latestReadings.get(sensorId);
          if (!currentLatest || new Date(reading.readingDate) > new Date(currentLatest.readingDate)) {
            latestReadings.set(sensorId, reading);
          }
        });

        console.log(`[CropCard ${crop.id}] Últimas lecturas por sensor:`, Object.fromEntries(latestReadings));

        // Asociar las lecturas más recientes a cada sensor
        const sensorsWithReadings = sensors.map(sensor => {
          const sensorId = sensor.id;
          const latestReading = latestReadings.get(sensorId);

          console.log(`[CropCard ${crop.id}] Procesando sensor:`, {
            sensorId,
            sensorType: sensor.sensorType,
            type: sensor.type,
            latestReading
          });

          // Normalizar el tipo de sensor
          const sensorTypeMap = {
            'temperature': 'temperature',
            'temperatura': 'temperature',
            'sensor temperatura': 'temperature',
            'humidity': 'humidity',
            'humedad': 'humidity',
            'sensor humedad': 'humidity',
            'tds': 'tds',
            'conductividad': 'tds',
            'conductividad electrica': 'tds'
          };

          // Intentar obtener el tipo de diferentes propiedades
          const rawType = (sensor.sensorType || sensor.type || '').toLowerCase();
          const normalizedType = sensorTypeMap[rawType] || rawType;

          console.log(`[CropCard ${crop.id}] Tipo de sensor normalizado:`, {
            rawType,
            normalizedType
          });

          // Intentar obtener el valor de diferentes propiedades posibles
          let readingValue = 0;
          if (latestReading) {
            readingValue = latestReading.readingValue;
            console.log(`[CropCard ${crop.id}] Valor obtenido de latestReading:`, readingValue);
          } else if (sensor.lastReading) {
            readingValue = sensor.lastReading;
            console.log(`[CropCard ${crop.id}] Valor obtenido de sensor.lastReading:`, readingValue);
          } else if (sensor.readings && sensor.readings.length > 0) {
            // Si hay lecturas en el sensor, tomar la más reciente
            const sortedReadings = [...sensor.readings].sort((a, b) =>
              new Date(b.readingDate) - new Date(a.readingDate)
            );
            readingValue = sortedReadings[0].readingValue;
            console.log(`[CropCard ${crop.id}] Valor obtenido de sensor.readings:`, readingValue);
          }

          const processedSensor = {
            ...sensor,
            type: normalizedType,
            lastReading: readingValue,
            readingDate: latestReading ? latestReading.readingDate : (
              sensor.readings && sensor.readings.length > 0
                ? sensor.readings[0].readingDate
                : null
            )
          };

          console.log(`[CropCard ${crop.id}] Sensor procesado:`, processedSensor);
          return processedSensor;
        });

        console.log(`[CropCard ${crop.id}] Todos los sensores procesados:`, sensorsWithReadings);

        if (isMounted) {
          setCropSensors(sensorsWithReadings);
        }
      } catch (error) {
        console.error(`[CropCard ${crop.id}] Error cargando datos:`, error);
        if (isMounted) {
          setError('Error al cargar los datos');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    // Configurar actualización periódica solo si el documento está visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    intervalId = setInterval(loadData, 60000);

    return () => {
      isMounted = false;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [crop?.id, fetchSensorsByCropId]);

  // Procesar datos de sensores de manera eficiente usando useMemo
  const sensorData = useMemo(() => {
    const data = { humidity: 0, temperature: 0, conductivity: 0 };

    console.log(`[CropCard ${crop.id}] Calculando sensorData con sensores:`, cropSensors);

    cropSensors.forEach(sensor => {
      const value = parseFloat(sensor.lastReading || 0);

      console.log(`[CropCard ${crop.id}] Procesando valor para sensorData:`, {
        sensorType: sensor.type,
        value,
        rawLastReading: sensor.lastReading
      });

      switch (sensor.type) {
        case 'humidity':
          data.humidity = value;
          break;
        case 'temperature':
          data.temperature = value;
          break;
        case 'tds':
          data.conductivity = value;
          break;
      }
    });

    console.log(`[CropCard ${crop.id}] SensorData final:`, data);
    return data;
  }, [cropSensors, crop.id]);

  // Función para obtener el número de sensores
  const getSensorsCount = () => {
    return cropSensors.filter(sensor => sensor.status === 'ACTIVE' || sensor.isActive !== false).length;
  };

  // Función para normalizar el status
  const getNormalizedStatus = () => {
    // Si no hay status, retornar active por defecto
    if (!crop.status) return 'active';

    const status = crop.status.toString().toLowerCase();
    switch (status) {
      case 'active':
      case 'activo':
        return 'active';
      case 'inactive':
      case 'inactivo':
        return 'paused';
      case 'paused':
      case 'pausado':
        return 'paused';
      case 'completed':
      case 'completado':
        return 'completed';
      default:
        return 'active';
    }
  };

  const handleEditModalOpen = () => {
    setIsEditModalOpen(true);
    onModalOpen?.();
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    onModalClose?.();
  };

  const handleSensorModalOpen = () => {
    setIsSensorModalOpen(true);
    onModalOpen?.();
  };

  const handleSensorModalClose = () => {
    setIsSensorModalOpen(false);
    onModalClose?.();
    // Recargar los sensores cuando se cierra el modal
    fetchSensorsByCropId(crop.id);
  };

  const sensorsCount = getSensorsCount();
  const normalizedStatus = getNormalizedStatus();

  const getSensorIcon = (type) => {
    const normalizedType = type.toLowerCase();
    if (normalizedType.includes('temperature')) return '🌡️';
    if (normalizedType.includes('humidity')) return '💧';
    if (normalizedType.includes('tds')) return '⚡';
    return '📊'; // Icono por defecto
  };

  return (
    <>
      <div
        className={`w-full bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-all duration-200 relative border-l-4 border-primary
          ${isHovered ? 'scale-[1.02] shadow-lg' : ''}`}
        onClick={() => onClick(crop)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Botones de acción en la esquina superior derecha */}
        <div className="absolute top-3 right-3 flex gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSensorModalOpen();
            }}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Gestionar sensores"
            disabled={isLoading}
          >
            <Cpu className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleEditModalOpen();
            }}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Editar cultivo"
          >
            <Pencil className="h-4 w-4" />
          </button>
        </div>

        {/* Encabezado con estado */}
        <div className="flex flex-wrap justify-between items-start mb-4 pr-16">
          <div>
            <h3 className="text-xl font-bold text-gray-800 truncate">
              {crop.cropName || crop.name || 'Sin nombre'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {crop.cropType || 'Tipo no especificado'}
            </p>
          </div>
          <CropStatusBadge status={normalizedStatus} />
        </div>

        {/* Información del cultivo */}
        <div className="mb-4">
          <p className="text-xs text-gray-500">
            {crop.location || 'Sin ubicación especificada'}
          </p>
          {crop.startDate && (
            <p className="text-xs text-gray-500">
              Iniciado: {new Date(crop.startDate).toLocaleDateString('es-ES')}
            </p>
          )}
        </div>

        {/* Datos de sensores en grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className={`flex flex-col items-center p-3 rounded-lg ${sensorData.humidity > 0 ? 'bg-blue-50' : 'bg-gray-50'}`}>
            <Droplets className={`h-5 w-5 ${sensorData.humidity > 0 ? 'text-blue-500' : 'text-gray-400'} mb-1`} />
            <span className={`text-sm font-medium ${sensorData.humidity > 0 ? 'text-blue-700' : 'text-gray-500'}`}>
              {sensorData.humidity.toFixed(1)}%
            </span>
            <span className="text-xs text-gray-600">Humedad</span>
          </div>
          <div className={`flex flex-col items-center p-3 rounded-lg ${sensorData.temperature > 0 ? 'bg-red-50' : 'bg-gray-50'}`}>
            <Thermometer className={`h-5 w-5 ${sensorData.temperature > 0 ? 'text-red-500' : 'text-gray-400'} mb-1`} />
            <span className={`text-sm font-medium ${sensorData.temperature > 0 ? 'text-red-700' : 'text-gray-500'}`}>
              {sensorData.temperature.toFixed(1)}°C
            </span>
            <span className="text-xs text-gray-600">Temperatura</span>
          </div>
          <div className={`flex flex-col items-center p-3 rounded-lg ${sensorData.conductivity > 0 ? 'bg-purple-50' : 'bg-gray-50'}`}>
            <span className={`${sensorData.conductivity > 0 ? 'text-purple-500' : 'text-gray-400'} mb-1 text-lg`}>⚡</span>
            <span className={`text-sm font-medium ${sensorData.conductivity > 0 ? 'text-purple-700' : 'text-gray-500'}`}>
              {sensorData.conductivity.toFixed(2)} PPM
            </span>
            <span className="text-xs text-gray-600">TDS</span>
          </div>
        </div>


        {/* Información de sensores y alertas */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Cpu className="h-4 w-4" />
              {isLoading ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin h-4 w-4 text-gray-500 mr-1" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Cargando...
                </span>
              ) : (
                <span>{getSensorsCount()} sensores</span>
              )}
            </div>
          </div>

          {/* Indicador de navegación */}
          <div className="flex items-center text-gray-400">
            <span className="text-xs mr-1">Ver detalles</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Indicador de actividad reciente */}
        <div className="absolute bottom-3 left-3">
          <div className={`w-2 h-2 rounded-full ${normalizedStatus === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
        </div>

        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-50 text-red-600 text-sm p-2 rounded-b-lg">
            {error}
          </div>
        )}
      </div>

      {/* Modal de edición */}
      <EditCropModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        crop={crop}
      />

      {/* Modal de gestión de sensores */}
      <SensorManagementModal
        isOpen={isSensorModalOpen}
        onClose={handleSensorModalClose}
        onSensorChange={fetchSensorsByCropId}
        crop={{
          id: crop.id,
          name: crop.cropName || crop.name || 'Sin nombre'
        }}
      />
    </>
  );
};

CropCard.propTypes = {
  crop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string,
    cropName: PropTypes.string,
    location: PropTypes.string,
    description: PropTypes.string,
    status: PropTypes.oneOf(['ACTIVE', 'INACTIVE', 'PAUSED', 'COMPLETED', 'active', 'paused', 'alert', 'completed']),
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    cropType: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string
      })
    ])
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onModalOpen: PropTypes.func,
  onModalClose: PropTypes.func
};