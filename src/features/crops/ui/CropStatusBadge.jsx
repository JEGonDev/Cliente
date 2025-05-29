import PropTypes from 'prop-types';

export const CropStatusBadge = ({ status }) => {
  // Normalizar el estado para manejar diferentes formatos del backend
  const normalizeStatus = (rawStatus) => {
    if (!rawStatus) return 'active';

    const statusStr = rawStatus.toString().toLowerCase();

    // Mapeo de estados del backend a estados normalizados
    const statusMap = {
      // Estados en inglés (backend)
      'active': 'active',
      'inactive': 'paused',
      'paused': 'paused',
      'completed': 'completed',
      'finished': 'completed',
      'alert': 'alert',
      'error': 'alert',
      'warning': 'alert',
      // Estados en español
      'activo': 'active',
      'inactivo': 'paused',
      'pausado': 'paused',
      'completado': 'completed',
      'terminado': 'completed',
      'alerta': 'alert',
      // Estados adicionales que puede enviar el backend
      'running': 'active',
      'stopped': 'paused',
      'disabled': 'paused'
    };

    return statusMap[statusStr] || 'active';
  };

  const normalizedStatus = normalizeStatus(status);

  const statusConfig = {
    active: {
      label: "Activo",
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      icon: "🟢"
    },
    paused: {
      label: "En pausa",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-800",
      icon: "⏸️"
    },
    alert: {
      label: "Alerta",
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      icon: "⚠️"
    },
    completed: {
      label: "Completado",
      bgColor: "bg-gray-100",
      textColor: "text-gray-800",
      icon: "✅"
    }
  };

  const config = statusConfig[normalizedStatus] || statusConfig.active;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
      title={`Estado del cultivo: ${config.label}`}
    >
      <span className="mr-1" role="img" aria-label={config.label}>
        {config.icon}
      </span>
      {config.label}
    </span>
  );
};

// ACTUALIZAR PropTypes para ser más flexible:
CropStatusBadge.propTypes = {
  status: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};
