import PropTypes from 'prop-types';

/**
 * Tarjeta para mostrar estadísticas con título, valor y descripción
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la estadística
 * @param {string} props.value - Valor de la estadística
 * @param {string} props.description - Descripción adicional
 */
export const StatCard = ({
  title = 'Estadística',
  value = '0',
  description = ''
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      {description && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
};

StatCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  description: PropTypes.string
};