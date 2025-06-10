import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { X, Droplets, Thermometer, Zap } from 'lucide-react';
import { useMonitoring } from '../hooks/useMonitoring';
import { CropStatusBadge } from './CropStatusBadge';
import { CropAlertItem } from './CropAlertItem';

export const CropDetailModal = ({ isOpen, crop, onClose }) => {
  const [cropSensors, setCropSensors] = useState([]);
  const [cropAlerts, setCropAlerts] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    fetchSensorsByCropId,
    fetchAlertsByCropId,
    sensors,
    alerts
  } = useMonitoring();

  // Cargar datos adicionales del cultivo cuando se abre el modal
  useEffect(() => {
    if (isOpen && crop?.id) {
      setLoading(true);

      Promise.all([
        fetchSensorsByCropId(crop.id),
        fetchAlertsByCropId(crop.id)
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [isOpen, crop?.id, fetchSensorsByCropId, fetchAlertsByCropId]);

  // Actualizar estados locales cuando cambian los datos del contexto
  useEffect(() => {
    if (crop?.id) {
      setCropSensors(sensors.filter(sensor => sensor.cropId === crop.id || sensor.crops?.includes(crop.id)));
      setCropAlerts(alerts.filter(alert => alert.cropId === crop.id));
    }
  }, [sensors, alerts, crop?.id]);

  if (!isOpen || !crop) return null;

  const formatDate = (date) => {
    if (!date) return 'No especificada';

    try {
      return new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return 'Fecha inválida';
    }
  };

  // Función para obtener datos de sensores con valores por defecto
  const getSensorReadings = () => {
    const defaultReadings = {
      temperature: { value: 0, unit: '°C', status: 'sin-datos' },
      humidity: { value: 0, unit: '%', status: 'sin-datos' },
      tds: { value: 0, unit: 'PPM', status: 'sin-datos' }
    };

    cropSensors.forEach(sensor => {
      const sensorType = sensor.type.toLowerCase();
      const reading = sensor.lastReading || 0;

      if (sensorType.includes('temperature')) {
        defaultReadings.temperature = {
          value: reading,
          unit: '°C',
          status: getReadingStatus(reading, 18, 26)
        };
      } else if (sensorType.includes('humidity')) {
        defaultReadings.humidity = {
          value: reading,
          unit: '%',
          status: getReadingStatus(reading, 60, 80)
        };
      } else if (sensorType.includes('tds') || sensorType.includes('conductivity')) {
        defaultReadings.tds = {
          value: reading,
          unit: 'mS/cm',
          status: getReadingStatus(reading, 1.0, 3.0)
        };
      }
    });

    return defaultReadings;
  };

  const getReadingStatus = (value, min, max) => {
    if (value === 0 || value === null || value === undefined) return 'sin-datos';
    if (value < min || value > max) return 'fuera-rango';
    return 'normal';
  };

  const getReadingClass = (status) => {
    switch (status) {
      case 'normal': return 'text-green-600';
      case 'fuera-rango': return 'text-red-600';
      case 'sin-datos': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };

  const sensorReadings = getSensorReadings();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{crop.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
            aria-label="Cerrar modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando datos del cultivo...</p>
          </div>
        )}

        {/* Content */}
        <div className="p-4">
          {/* Información general */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Información general</h3>
            <div className="grid grid-cols-2 gap-4">
              <Info
                label="Ubicación"
                value={crop.location || crop.description || 'No especificada'}
              />
              <Info
                label="Fecha de inicio"
                value={formatDate(crop.startDate)}
              />
              <Info
                label="Tipo de cultivo"
                value={crop.cropType?.name || crop.plantType || 'No especificado'}
              />
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <CropStatusBadge status={crop.status} />
              </div>
            </div>

            {/* Información adicional del backend */}
            {crop.endDate && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Info
                  label="Fecha de finalización"
                  value={formatDate(crop.endDate)}
                />
              </div>
            )}
          </section>

          {/* Lecturas de sensores */}
          <section className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-500 uppercase">
                Lecturas de sensores
              </h3>
              <span className="text-xs text-gray-400">
                {cropSensors.length} sensor{cropSensors.length !== 1 ? 'es' : ''}
              </span>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <SensorItem
                label="Humedad"
                icon={<Droplets className="h-5 w-5 text-blue-500" />}
                value={`${sensorReadings.humidity.value}${sensorReadings.humidity.unit}`}
                className={getReadingClass(sensorReadings.humidity.status)}
              />
              <SensorItem
                label="Conductividad"
                icon={<Zap className="h-5 w-5 text-purple-500" />}
                value={`${sensorReadings.tds.value} ${sensorReadings.tds.unit}`}
                className={getReadingClass(sensorReadings.tds.status)}
              />
              <SensorItem
                label="Temperatura"
                icon={<Thermometer className="h-5 w-5 text-red-500" />}
                value={`${sensorReadings.temperature.value}${sensorReadings.temperature.unit}`}
                className={getReadingClass(sensorReadings.temperature.status)}
              />
            </div>

            {cropSensors.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p className="text-sm">No hay sensores asociados a este cultivo</p>
              </div>
            )}
          </section>

          {/* Alertas recientes */}
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
              Alertas recientes ({cropAlerts.length})
            </h3>

            {cropAlerts.length > 0 ? (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cropAlerts.slice(0, 5).map(alert => (
                  <CropAlertItem key={alert.id} alert={alert} />
                ))}
                {cropAlerts.length > 5 && (
                  <p className="text-xs text-gray-500 text-center pt-2">
                    Y {cropAlerts.length - 5} alertas más...
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No hay alertas recientes para este cultivo.
              </p>
            )}
          </section>

          {/* Estadísticas adicionales si están disponibles */}
          {cropSensors.length > 0 && (
            <section className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">
                Estado de sensores
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-green-50 p-2 rounded">
                  <span className="text-green-700 font-medium">
                    {cropSensors.filter(s => s.status === 'ACTIVE').length} Activos
                  </span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-700 font-medium">
                    {cropSensors.filter(s => s.status !== 'ACTIVE').length} Inactivos
                  </span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Componentes auxiliares
const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium break-words">{value || 'N/A'}</p>
  </div>
);

const SensorItem = ({ label, icon, value, className }) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center space-x-2">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <span className={`text-lg font-semibold ${className}`}>{value}</span>
  </div>
);

// PropTypes
CropDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  crop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string.isRequired,
    location: PropTypes.string,
    description: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
    plantType: PropTypes.string,
    cropType: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    status: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    sensors: PropTypes.oneOfType([
      PropTypes.shape({
        humidity: PropTypes.number,
        conductivity: PropTypes.number,
        temperature: PropTypes.number,
      }),
      PropTypes.array
    ]),
    alerts: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.number
    ])
  }),
  onClose: PropTypes.func.isRequired,
};

Info.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

SensorItem.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};
