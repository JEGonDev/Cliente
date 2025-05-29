import { ChevronRight, Droplets, Thermometer } from 'lucide-react';
import PropTypes from 'prop-types';
import { CropStatusBadge } from './CropStatusBadge';

export const CropCard = ({ crop, onClick }) => {
  // Formatear la fecha de inicio
  const startDate = new Date(crop.startDate);
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(startDate);

  return (
    <div
      className="w-full bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02]"
      onClick={() => onClick(crop)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{crop.cropName || 'Sin nombre'}</h3>
        <CropStatusBadge status={crop.status} />
      </div>
      <p className="text-sm text-gray-600 mb-3">{crop.cropType || 'Tipo no especificado'}</p>
      <div className="flex items-center justify-between">
        <div className="flex space-x-4">
          <div className="flex items-center text-sm">
            <Droplets className="h-4 w-4 text-blue-500 mr-1" />
            <span className="text-gray-500">Próximamente</span>
          </div>
          <div className="flex items-center text-sm">
            <Thermometer className="h-4 w-4 text-red-500 mr-1" />
            <span className="text-gray-500">Próximamente</span>
          </div>
        </div>
        <div className="flex items-center text-gray-600">
          <span className="text-xs mr-2">Inicio: {formattedDate}</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};

CropCard.propTypes = {
  crop: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userId: PropTypes.number,
    cropName: PropTypes.string,
    cropType: PropTypes.string,
    startDate: PropTypes.string,
    status: PropTypes.string
  }).isRequired,
  onClick: PropTypes.func.isRequired
};
