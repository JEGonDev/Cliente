import PropTypes from 'prop-types';
import { X, Droplets, Thermometer, Zap } from 'lucide-react';
import { CropStatusBadge } from './CropStatusBadge';
import { CropAlertItem } from './CropAlertItem';


export const CropDetailModal = ({ isOpen, crop, onClose }) => {
  if (!isOpen || !crop) return null;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

  const getHumidityClass = (value) =>
    value < 60 || value > 85 ? 'text-red-600' : 'text-green-600';

  const getConductivityClass = (value) =>
    value < 1.0 || value > 3.0 ? 'text-red-600' : 'text-green-600';

  const getTemperatureClass = (value) =>
    value < 18 ? 'text-blue-600' : value > 26 ? 'text-red-600' : 'text-green-600';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{crop.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Información general</h3>
            <div className="grid grid-cols-2 gap-4">
              <Info label="Ubicación" value={crop.location} />
              <Info label="Fecha de inicio" value={formatDate(crop.startDate)} />
              <Info label="Tipo de planta" value={crop.plantType} />
              <div>
                <p className="text-xs text-gray-500">Estado</p>
                <CropStatusBadge status={crop.status} />
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Lecturas de sensores</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <SensorItem label="Humedad" icon={<Droplets className="h-5 w-5 text-blue-500" />} value={`${crop.sensors.humidity}%`} className={getHumidityClass(crop.sensors.humidity)} />
              <SensorItem label="Conductividad" icon={<Zap className="h-5 w-5 text-purple-500" />} value={`${crop.sensors.conductivity} mS/cm`} className={getConductivityClass(crop.sensors.conductivity)} />
              <SensorItem label="Temperatura" icon={<Thermometer className="h-5 w-5 text-red-500" />} value={`${crop.sensors.temperature}°C`} className={getTemperatureClass(crop.sensors.temperature)} />
            </div>
          </section>

          <section className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Alertas recientes ({crop.alerts.length})</h3>
            {crop.alerts.length > 0 ? (
              <div className="space-y-2">
                {crop.alerts.map(alert => <CropAlertItem key={alert.id} alert={alert} />)}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No hay alertas recientes para este cultivo.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-sm font-medium">{value}</p>
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

CropDetailModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    crop: PropTypes.shape({
      name: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      startDate: PropTypes.string.isRequired, // ISO date string
      plantType: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      sensors: PropTypes.shape({
        humidity: PropTypes.number.isRequired,
        conductivity: PropTypes.number.isRequired,
        temperature: PropTypes.number.isRequired,
      }).isRequired,
      alerts: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
          // puedes agregar más campos si los usas dentro de CropAlertItem
        })
      ).isRequired,
    }),
    onClose: PropTypes.func.isRequired,
  };
  
  Info.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
  };
  
  SensorItem.propTypes = {
    label: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,
    value: PropTypes.string.isRequired,
    className: PropTypes.string,
  };
