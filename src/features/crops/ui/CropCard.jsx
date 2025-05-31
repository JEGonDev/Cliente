import { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Droplets, Thermometer, Pencil, Cpu } from 'lucide-react';
import PropTypes from 'prop-types';
import { CropStatusBadge } from './CropStatusBadge';
import { EditCropModal } from './EditCropModal';
import { SensorManagementModal } from './SensorManagementModal';
import { useMonitoring } from '../hooks/useMonitoring';

export const CropCard = ({ crop, onClick, onModalOpen, onModalClose }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSensorModalOpen, setIsSensorModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cropSensors, setCropSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { fetchSensorsByCropId } = useMonitoring();

  // Función para cargar los sensores
  const loadSensors = async () => {
    if (!crop?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchSensorsByCropId(crop.id);
      const sensors = Array.isArray(response) ? response : [];
      setCropSensors(sensors);
    } catch (error) {
      console.error('Error al cargar sensores:', error);
      setError('Error al cargar los sensores');
      setCropSensors([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Efecto para cargar los sensores del cultivo
  useEffect(() => {
    let isMounted = true;

    const fetchSensors = async () => {
      if (!isMounted) return;
      await loadSensors();
    };

    fetchSensors();

    return () => {
      isMounted = false;
    };
  }, [crop?.id, fetchSensorsByCropId]);

  // Procesar datos de sensores de manera eficiente usando useMemo
  const sensorData = useMemo(() => {
    const data = { humidity: 0, temperature: 0, conductivity: 0 };

    cropSensors.forEach(sensor => {
      const type = sensor.sensorType.toLowerCase();
      if (type.includes('humedad')) {
        data.humidity = sensor.lastReading || 0;
      } else if (type.includes('temperatura')) {
        data.temperature = sensor.lastReading || 0;
      } else if (type.includes('conductividad') || type.includes('ec')) {
        data.conductivity = sensor.lastReading || 0;
      }
    });

    return data;
  }, [cropSensors]);

  // Función para obtener el número de alertas
  const getAlertsCount = () => {
    return 0; // Por ahora retornamos 0 ya que no hay integración con alertas
  };

  // Función para obtener el número de sensores
  const getSensorsCount = () => {
    return cropSensors.length;
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
    loadSensors();
  };

  const alertsCount = getAlertsCount();
  const sensorsCount = getSensorsCount();
  const normalizedStatus = getNormalizedStatus();

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
        <div className="flex justify-between items-start mb-4 pr-16">
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
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-500 mb-1" />
            <span className="text-sm font-medium text-blue-700">
              {sensorData.humidity}%
            </span>
            <span className="text-xs text-gray-600">Humedad</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-red-50 rounded-lg">
            <Thermometer className="h-5 w-5 text-red-500 mb-1" />
            <span className="text-sm font-medium text-red-700">
              {sensorData.temperature}°C
            </span>
            <span className="text-xs text-gray-600">Temperatura</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-purple-50 rounded-lg">
            <span className="text-purple-500 mb-1 text-lg">⚡</span>
            <span className="text-sm font-medium text-purple-700">
              {sensorData.conductivity} mS/cm
            </span>
            <span className="text-xs text-gray-600">EC</span>
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
                <span>{sensorsCount} sensores</span>
              )}
            </div>
            <div className={`flex items-center gap-1 ${alertsCount > 0 ? 'text-red-600' : ''}`}>
              <span className="text-lg">🔔</span>
              <span>{alertsCount} alertas</span>
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
        onSensorChange={loadSensors}
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