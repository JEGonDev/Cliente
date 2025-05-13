import PropTypes from 'prop-types';
import { Bell } from 'lucide-react';

export const CropAlertItem = ({ alert }) => {
  const alertTypeConfig = {
    info: { iconColor: "text-blue-500", bgColor: "bg-blue-50" },
    warning: { iconColor: "text-yellow-500", bgColor: "bg-yellow-50" },
    error: { iconColor: "text-red-500", bgColor: "bg-red-50" }
  };

  const config = alertTypeConfig[alert.type] || alertTypeConfig.info;
  const date = new Date(alert.timestamp);
  const formattedDate = date.toLocaleDateString('es-ES');
  const formattedTime = date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`mb-2 ${config.bgColor} border-l-4 p-3 flex items-center`}>
      <Bell className={`h-4 w-4 ${config.iconColor} mr-2`} />
      <div>
        <p className="text-sm font-medium">{alert.message}</p>
        <p className="text-xs text-gray-600">{formattedDate} • {formattedTime}</p>
      </div>
    </div>
  );
};

CropAlertItem.propTypes = {
  alert: PropTypes.shape({
    type: PropTypes.oneOf(['info', 'warning', 'error']).isRequired,
    message: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date)
    ]).isRequired
  }).isRequired
};
