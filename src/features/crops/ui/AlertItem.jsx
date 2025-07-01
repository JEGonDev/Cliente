import PropTypes from 'prop-types';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Modal } from '../../../ui/components/Modal';
import { useState } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Componente para mostrar una alerta individual
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.id - Identificador de la alerta
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
  id,
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
  const [isDeleting, setIsDeleting] = useState(false);

  const { deleteAlert } = useMonitoring();

  const alertConfig = {
    error: {
      icon: <AlertCircle size={20} />,
      colorClasses: 'bg-red-50 border-l-4 border-l-red-500 text-red-700',
      iconClass: 'text-red-500',
      severityLabel: 'Alta'
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      colorClasses: 'bg-yellow-50 border-l-4 border-l-yellow-500 text-yellow-700',
      iconClass: 'text-yellow-500',
      severityLabel: 'Media'
    },
    info: {
      icon: <Info size={20} />,
      colorClasses: 'bg-blue-50 border-l-4 border-l-blue-500 text-blue-700',
      iconClass: 'text-blue-500',
      severityLabel: 'Baja'
    }
  };

  const config = alertConfig[type] || alertConfig.info;

  const handleResolve = async (e) => {
    e.stopPropagation();

    if (!id) {
      console.warn('No se puede resolver la alerta: ID no proporcionado');
      return;
    }

    setIsDeleting(true);

    try {
      const success = await deleteAlert(id);

      if (success) {
        // Llamar callback si se proporciona
        if (onDelete) {
          onDelete(id);
        }
        console.log('Alerta resuelta exitosamente');
      } else {
        alert('Error al resolver la alerta');
      }
    } catch (error) {
      console.error('Error al resolver alerta:', error);
      alert('Error al resolver la alerta. Inténtalo de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  };

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

            <div className="mt-4 text-sm flex-wrap flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-700">Valor:</span> {value}
              </div>
              <div>
                <span className="font-medium text-gray-700">Umbral:</span> {threshold}
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
          <div className="flex gap-2">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              Cerrar
            </button>
          </div>
        }
      >
        <div className="space-y-4 text-gray-800">
          <p>
            <strong>Mensaje:</strong>{" "}
            <span className="font-medium">{message}</span>
          </p>
          <p>
            <strong>Valor actual:</strong>{" "}
            <span className={`font-semibold ${type === 'error' ? 'text-red-600' : type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`}>
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
            <span className={`px-2 py-1 rounded font-semibold text-sm ${type === 'error' ? 'bg-red-100 text-red-800' :
              type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
              {config.severityLabel}
            </span>
          </p>
          <p>
            <strong>Cultivo:</strong>{" "}
            <span>{crop}</span>
          </p>
          <p className="flex items-center space-x-2">
            <strong>Estado:</strong>
            <span className="px-3 py-1 rounded-full text-white text-xs font-bold bg-red-400">
              Activa
            </span>
          </p>
        </div>
      </Modal>
    </>
  );
};

AlertItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  type: PropTypes.oneOf(['error', 'warning', 'info']),
  parameter: PropTypes.string,
  crop: PropTypes.string,
  message: PropTypes.string,
  value: PropTypes.string,
  threshold: PropTypes.string,
  time: PropTypes.string,
  onDelete: PropTypes.func
};