import PropTypes from 'prop-types';

/**
 * Tarjeta para mostrar estadísticas con barra de progreso
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.label - Etiqueta de la estadística
 * @param {string} props.value - Valor de la estadística
 * @param {string} props.color - Color de la barra de progreso
 * @param {number} props.percentage - Porcentaje para la barra de progreso (0-100)
 */
export const StatCard = ({ 
  label = 'Estadística', 
  value = '0', 
  color = 'blue', 
  percentage = 0 
}) => {
  // Mapeo de colores a clases de Tailwind
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500'
  };
  
  // Clase de color por defecto si no se especifica un color válido
  const barColor = colorClasses[color] || 'bg-blue-500';
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${barColor} h-2 rounded-full`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

StatCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.string,
  color: PropTypes.string,
  percentage: PropTypes.number
};