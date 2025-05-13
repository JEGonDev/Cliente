import PropTypes from 'prop-types';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

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
}) => {// Configuración según el tipo de alerta
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

  // Usar configuración por defecto para 'info' si el tipo no es reconocido
  const config = alertConfig[type] || alertConfig.info;

  return (
    <div className={`rounded-md p-4 ${config.colorClasses}`}>
      <div className="flex">
        <div className={`flex-shrink-0 mr-3 ${config.iconClass}`}>
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium">
                {parameter} - {crop}
              </h3>
              <p className="text-sm mt-1">
                {message}
              </p>
            </div>
            <div className="text-xs">
              {time}
            </div>
          </div>
          
          <div className="mt-2 text-sm flex justify-between">
            <div>
              <span className="font-medium">Valor:</span> {value}
            </div>
            <div>
              <span className="font-medium">Umbral:</span> {threshold}
            </div>
            <button className="text-sm hover:underline">
              Resolver
            </button>
          </div>
        </div>
      </div>
    </div>
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