import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Componente para seleccionar el rango de tiempo en visualizaciones en tiempo real
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.activeRange - Rango activo inicial (1H, 6H, 24H)
 * @param {Function} props.onChange - Función a llamar cuando cambia el rango
 */
export const TimeSelector = ({
  activeRange,
  onChange = () => { }
}) => {
  const {
    timeRange: contextTimeRange,
    changeTimeRange
  } = useMonitoring();

  // Usar el rango del contexto si no se proporciona uno específico
  const selectedRange = activeRange || contextTimeRange;

  const ranges = [
    { id: '1H', label: '1H' },
    { id: '6H', label: '6H' },
    { id: '24H', label: '24H' }
  ];

  const handleClick = (id) => {
    // Actualizar en el contexto
    changeTimeRange(id);

    // Llamar al callback si se proporciona
    onChange(id);
  };

  return (
    <div className="inline-flex rounded-md shadow-sm">
      {ranges.map(range => (
        <button
          key={range.id}
          type="button"
          className={`px-4 py-1 text-sm font-medium transition-colors
            ${range.id === selectedRange
              ? 'bg-primary text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'}
            ${range.id === '1H' ? 'rounded-l-md' : ''}
            ${range.id === '24H' ? 'rounded-r-md' : ''}
            border border-gray-300
          `}
          onClick={() => handleClick(range.id)}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
};

TimeSelector.propTypes = {
  activeRange: PropTypes.oneOf(['1H', '6H', '24H']),
  onChange: PropTypes.func
};
