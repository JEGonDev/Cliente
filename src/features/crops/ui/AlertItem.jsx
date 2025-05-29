import PropTypes from 'prop-types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Modal } from '../../../ui/components/Modal';
import { useState } from 'react';
import { CheckCircle } from 'lucide-react';

/**
 * Componente para mostrar una alerta individual
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.type - Tipo de alerta (error, warning, info)
 * @param {string} props.parameter - Parámetro al que se refiere la alerta
 * @param {string} props.crop - Cultivo relacionado con la alerta
 * @param {string} props.message - Mensaje de la alerta
 * @param {string} props.value - Valor actual
 * @param {string} props.threshold - Valor del umbral
 * @param {string} props.time - Tiempo transcurrido
 * @param {function} props.onDelete - Función para eliminar la alerta
 */
export const AlertItem = ({
  type = 'info',
  parameter = '',
  crop = '',
  message = '',
  value = '',
  threshold = '',
  time = '',
  onDelete
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const alertConfig = {
    error: {
      icon: <AlertCircle size={20} />,
      colorClasses: 'bg-red-50 border-l-4 border-l-red-500 text-red-700',
      iconClass: 'text-red-500',
      severityText: 'Alta',
      severityClass: 'bg-red-100 text-red-800'
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      colorClasses: 'bg-yellow-50 border-l-4 border-l-yellow-500 text-yellow-700',
      iconClass: 'text-yellow-500',
      severityText: 'Media',
      severityClass: 'bg-yellow-100 text-yellow-800'
    },
    info: {
      icon: <Info size={20} />,
      colorClasses: 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-700',
      iconClass: 'text-blue-500',
      severityText: 'Baja',
      severityClass: 'bg-blue-100 text-blue-800'
    }
  };

  const config = alertConfig[type] || alertConfig.info;

  return (
    <>
      <div
        className={`w-full bg-white rounded-lg shadow-md p-6 cursor-pointer transform transition-transform duration-200 hover:scale-[1.02] ${config.colorClasses}`}
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex">
          <div className={`flex-shrink-0 mr-3 ${config.iconClass}`}>
            {config.icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {parameter} - {crop}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {message}
                </p>
              </div>
              <div className="text-xs text-gray-500">
                {time}
              </div>
            </div>

            <div className="mt-4 text-sm flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-700">Valor:</span> {value}
              </div>
              <div>
                <span className="font-medium text-gray-700">Umbral:</span> {threshold}
              </div>
              <div className="flex items-center gap-1 text-blue-600 hover:underline text-sm cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}>
                <CheckCircle className="w-4 h-4" />
                <span>Resolver</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Alerta: ${parameter} - ${crop}`}
        size="md"
        footerActions={
          <button
            onClick={() => {
              onDelete?.();
              setIsModalOpen(false);
            }}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Resolver alerta
          </button>
        }
      >
        <div className="space-y-4 text-gray-800">
          <p>
            <strong>Mensaje:</strong>{" "}
            <span className="font-medium">{message}</span>
          </p>
          <p>
            <strong>Valor actual:</strong>{" "}
            <span className={`font-semibold ${type === 'error' ? 'text-red-600' :
                type === 'warning' ? 'text-yellow-600' :
                  'text-blue-600'
              }`}>
              {value}
            </span>
          </p>
          <p>
            <strong>Umbral:</strong>{" "}
            <span className="font-semibold text-gray-700">{threshold}</span>
          </p>
          <p>
            <strong>Tiempo de alerta:</strong>{" "}
            <span>{time}</span>
          </p>
          <p>
            <strong>Severidad:</strong>{" "}
            <span className={`px-2 py-1 rounded ${config.severityClass} font-semibold text-sm`}>
              {config.severityText}
            </span>
          </p>
          <p>
            <strong>Parámetro:</strong>{" "}
            <span>{parameter}</span>
          </p>
          <p>
            <strong>Cultivo:</strong>{" "}
            <span>{crop}</span>
          </p>
          <p className="flex items-center space-x-2">
            <strong>Estado:</strong>
            <span className="px-3 py-1 rounded-full text-white text-xs font-bold bg-yellow-500">
              Pendiente
            </span>
          </p>
        </div>
      </Modal>
    </>
  );
};

AlertItem.propTypes = {
  type: PropTypes.oneOf(['error', 'warning', 'info']),
  parameter: PropTypes.string,
  crop: PropTypes.string,
  message: PropTypes.string,
  value: PropTypes.string,
  threshold: PropTypes.string,
  time: PropTypes.string,
  onDelete: PropTypes.func
};