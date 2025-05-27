import PropTypes from 'prop-types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Modal } from '../../../ui/components/Modal';
import { useState } from 'react';


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
 */
export const AlertItem = ({
  type = 'info',
  parameter = '',
  crop = '',
  message = '',
  value = '',
  threshold = '',
  time = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const alertConfig = {
    error: {
      icon: <AlertCircle size={20} />,
      colorClasses: 'bg-red-50 border-l-4 border-l-red-500 text-red-700',
      iconClass: 'text-red-500'
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      colorClasses: 'bg-yellow-50 border-l-4 border-l-yellow-500 text-yellow-700',
      iconClass: 'text-yellow-500'
    },
    info: {
      icon: <Info size={20} />,
      colorClasses: 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-700',
      iconClass: 'text-blue-500'
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
              <button
                className="text-sm text-blue-600 hover:underline"
                onClick={(e) => {
                  e.stopPropagation(); // Para que no se abra el modal al hacer click aquí
                  // Aquí podrías poner la lógica para "Resolver"
                }}
              >
                Resolver
              </button>
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
            onClick={() => setIsModalOpen(false)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Cerrar
          </button>
        }
      >
        <p><strong>Mensaje:</strong> {message}</p>
        <p><strong>Valor actual:</strong> {value}</p>
        <p><strong>Umbral:</strong> {threshold}</p>
        <p><strong>Tiempo transcurrido:</strong> {time}</p>
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
  time: PropTypes.string
};