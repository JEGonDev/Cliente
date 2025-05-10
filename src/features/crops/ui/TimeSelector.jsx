import PropTypes from 'prop-types';
/**
 * Componente para seleccionar el rango de tiempo en visualizaciones en tiempo real
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.activeRange - Rango activo (1H, 6H, 24H)
 * @param {Function} props.onChange - Función a llamar cuando cambia el rango
 */
export const TimeSelector = ({
  activeRange = '6H',
  onChange = () => {}
}) => {
  // Opciones de rango disponibles
  const ranges = [
    { id: '1H', label: '1H' },
    { id: '6H', label: '6H' },
    { id: '24H', label: '24H' }
  ];
  
  return (
    <div className="inline-flex rounded-md shadow-sm">
      {ranges.map(range => (
        <button
          key={range.id}
          type="button"
          className={`px-4 py-1 text-sm font-medium 
            ${range.id === activeRange 
              ? 'bg-primary text-white' 
              : 'bg-white text-gray-700 hover:bg-gray-50'}
            ${range.id === '1H' ? 'rounded-l-md' : ''}
            ${range.id === '24H' ? 'rounded-r-md' : ''}
            border border-gray-300
          `}
          onClick={() => onChange(range.id)}
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