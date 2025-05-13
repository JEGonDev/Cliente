// AlertDetailModal.jsx
import PropTypes from 'prop-types';
import { X } from 'lucide-react';

export const AlertDetailModal = ({ isOpen, alert, onClose }) => {
  if (!isOpen || !alert) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Detalle de alerta</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <p><strong>Parámetro:</strong> {alert.parameter}</p>
          <p><strong>Cultivo:</strong> {alert.crop}</p>
          <p><strong>Mensaje:</strong> {alert.message}</p>
          <p><strong>Valor:</strong> {alert.value}</p>
          <p><strong>Umbral:</strong> {alert.threshold}</p>
          <p><strong>Fecha:</strong> {alert.time}</p>
        </div>
      </div>
    </div>
  );
};

AlertDetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  alert: PropTypes.shape({
    parameter: PropTypes.string.isRequired,
    crop: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    threshold: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired
  }),
  onClose: PropTypes.func.isRequired
};
