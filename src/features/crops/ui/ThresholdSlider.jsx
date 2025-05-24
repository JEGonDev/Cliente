import PropTypes from 'prop-types';

/**
 * Componente para mostrar umbrales como sliders visuales siguiendo el diseño específico
 * Replica exactamente el estilo mostrado en la interfaz de monitoreo en tiempo real
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.thresholds - Objeto con los umbrales actuales
 * @param {Function} props.onEditClick - Callback para abrir modal de edición
 */
export const ThresholdSlider = ({ thresholds, onEditClick }) => {
  // Configuración visual exacta según el diseño de la imagen
  const thresholdConfig = {
    temperature: {
      label: 'Temperatura',
      unit: '°C',
      icon: '🌡️',
      // Colores del gradiente de la paleta armonizada
      gradientColors: ['#A0522D', '#E0B887', '#043707'], 
      // Color para los marcadores (círculos)
      markerColor: '#A0522D'
    },
    humidity: {
      label: 'Humedad',
      unit: '%',
      icon: '💧',
      // Colores del gradiente de la paleta armonizada
      gradientColors: ['#4F6D7A', '#8A9A5B', '#D0D6B5'],
      markerColor: '#4F6D7A' 
    },
    ec: {
      label: 'Conductividad (EC)',
      unit: '',
      icon: '⚡',
      // Colores del gradiente de la paleta armonizada
      gradientColors: ['#2F4F4F', '#556B2F', '#FFD700'], 
    
      markerColor: '#2F4F4F' 
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Título principal */}
      <h2 className="text-lg font-medium text-gray-900 mb-6">Umbrales configurados</h2>

      {/* Grid de sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        {Object.entries(thresholds).map(([key, { min, max }]) => {
          const config = thresholdConfig[key];
          if (!config) return null;

          // Creamos la cadena de estilo para el gradiente lineal
          const gradientStyle = {
            background: `linear-gradient(to right, ${config.gradientColors.join(', ')})`
          };

          return (
            <div key={key} className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{config.icon}</span>
                <h3 className="text-sm font-medium text-gray-700">{config.label}</h3>
              </div>

              {/* Slider visual */}
              <div className="relative">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  {/* Barra de color con gradiente*/}
                  <div className="h-full rounded-full" style={gradientStyle}></div>
                </div>

                {/* Marcadores de posición (círculos) */}
                <div className="relative mt-1">
                  {/* Marcador izquierdo (mínimo)*/}
                  <div className="absolute left-0 transform -translate-x-1/2">
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm`} style={{ backgroundColor: config.markerColor }}></div>
                  </div>

                  {/* Marcador derecho (máximo)*/}
                  <div className="absolute right-0 transform translate-x-1/2">
                    <div className={`w-3 h-3 rounded-full border-2 border-white shadow-sm`} style={{ backgroundColor: config.markerColor }}></div>
                  </div>
                </div>
              </div>

              {/* Valores mínimo y máximo */}
              <div className="flex justify-between items-center text-xs text-gray-600 mt-3">
                <div>
                  <span className="block">Mínimo: </span>
                  <span className="font-medium text-gray-900">
                    {min}{config.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block">Máximo: </span>
                  <span className="font-medium text-gray-900">
                    {max}{config.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botón/enlace para editar umbrales */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={onEditClick}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          aria-label="Editar configuración de umbrales"
        >
          Editar umbrales
        </button>
      </div>
    </div>
  );
};

ThresholdSlider.propTypes = {
  thresholds: PropTypes.shape({
    temperature: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    humidity: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
    ec: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
    }).isRequired,
  }).isRequired,
  onEditClick: PropTypes.func.isRequired,
};