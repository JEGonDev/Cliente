import PropTypes from 'prop-types';

export const CropStatusBadge = ({ status }) => {
  const statusConfig = {
    active: { label: "Activo", bgColor: "bg-green-100", textColor: "text-green-800" },
    paused: { label: "En pausa", bgColor: "bg-yellow-100", textColor: "text-yellow-800" },
    alert: { label: "Alerta", bgColor: "bg-red-100", textColor: "text-red-800" },
    completed: { label: "Completado", bgColor: "bg-gray-100", textColor: "text-gray-800" }
  };

  const config = statusConfig[status] || statusConfig.active;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
      {config.label}
    </span>
  );
};

CropStatusBadge.propTypes = {
  status: PropTypes.oneOf(['active', 'paused', 'alert', 'completed']).isRequired
};
