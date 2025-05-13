import { ChevronRight, Droplets, Thermometer } from 'lucide-react';
import PropTypes from 'prop-types';
import { CropStatusBadge } from './CropStatusBadge';

export const CropCard = ({ crop, onClick }) => (
 <div
  className="w-full bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02]"
  onClick={() => onClick(crop)}
>

    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-800">{crop.name}</h3>
      <CropStatusBadge status={crop.status} />
    </div>
    <p className="text-sm text-gray-600 mb-3">{crop.location}</p>
    <div className="flex items-center justify-between">
      <div className="flex space-x-3">
        <div className="flex items-center text-sm">
          <Droplets className="h-4 w-4 text-blue-500 mr-1" />
          <span>{crop.sensors.humidity}%</span>
        </div>
        <div className="flex items-center text-sm">
          <Thermometer className="h-4 w-4 text-red-500 mr-1" />
          <span>{crop.sensors.temperature}°C</span>
        </div>
      </div>
      <div className="flex items-center text-gray-600">
        <span className="text-xs">{crop.alerts.length > 0 ? `${crop.alerts.length} alertas` : 'Sin alertas'}</span>
        <ChevronRight className="h-4 w-4 ml-1" />
      </div>
    </div>
  </div>
);

CropCard.propTypes = {
  crop: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['active', 'paused', 'alert', 'completed']).isRequired,
    sensors: PropTypes.shape({
      humidity: PropTypes.number.isRequired,
      temperature: PropTypes.number.isRequired
    }).isRequired,
    alerts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
