import PropTypes from 'prop-types';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Componente para mostrar umbrales como sliders visuales siguiendo el diseño específico
 * Replica exactamente el estilo mostrado en la interfaz de monitoreo en tiempo real
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.thresholds - Objeto con los umbrales actuales
 * @param {Function} props.onEditClick - Callback para abrir modal de edición
 */
export const ThresholdSlider = ({ thresholds, onEditClick }) => {
  const { selectedCrop, loading } = useMonitoring();

  // Configuración visual exacta según el diseño
  const thresholdConfig = {
    temperature: {
      label: 'Temperatura',
      unit: '°C',
      icon: '🌡️',
      gradientColors: ['#A0522D', '#E0B887', '#043707'],
      markerColor: '#A0522D'
    },
    humidity: {
      label: 'Humedad',
      unit: '%',
      icon: '💧',
      gradientColors: ['#4F6D7A', '#8A9A5B', '#D0D6B5'],
      markerColor: '#4F6D7A'
    },
    ec: {
      label: 'Conductividad (EC)',
      unit: '',
      icon: '⚡',
      gradientColors: ['#2F4F4F', '#556B2F', '#FFD700'],
      markerColor: '#2F4F4F'
    }
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Umbrales configurados</h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <span className="ml-2 text-gray-600">Cargando umbrales...</span>
        </div>
      </div>
    );
  }

  // Mostrar mensaje si no hay cultivo seleccionado
  if (!selectedCrop) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Umbrales configurados</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">⚙️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay cultivo seleccionado
          </h3>
          <p className="text-gray-600">
            Selecciona un cultivo para ver y editar sus umbrales configurados
          </p>
        </div>
      </div>
    );
  }

  // Verificar si hay umbrales configurados
  if (!thresholds || Object.keys(thresholds).length === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Umbrales configurados</h2>
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay umbrales configurados
          </h3>
          <p className="text-gray-600 mb-4">
            Configure umbrales para el cultivo "{selectedCrop.name}" para recibir alertas automáticas
          </p>
          <button
            onClick={onEditClick}
            className="px-4 py-2 bg-primary text-white rounded hover:bg-green-700 transition-colors"
          >
            Configurar umbrales
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6">
      {/* Título principal con información del cultivo */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Umbrales configurados</h2>
          <p className="text-sm text-gray-600">
            Cultivo: <span className="font-medium">{selectedCrop.name}</span>
          </p>
        </div>
        <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
          ✓ Configurado
        </div>
      </div>

      {/* Grid de sliders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
        {Object.entries(thresholds).map(([key, { min, max }]) => {
          const config = thresholdConfig[key];
          if (!config) return null;

          // Validar que min y max sean números válidos
          const minValue = typeof min === 'number' ? min : 0;
          const maxValue = typeof max === 'number' ? max : 0;

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
                  <div className="h-full rounded-full" style={gradientStyle}></div>
                </div>

                {/* Marcadores de posición */}
                <div className="relative mt-1">
                  <div className="absolute left-0 transform -translate-x-1/2">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: config.markerColor }}
                    ></div>
                  </div>
                  <div className="absolute right-0 transform translate-x-1/2">
                    <div
                      className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: config.markerColor }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Valores mínimo y máximo */}
              <div className="flex justify-between items-center text-xs text-gray-600 mt-3">
                <div>
                  <span className="block">Mínimo: </span>
                  <span className="font-medium text-gray-900">
                    {minValue}{config.unit}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block">Máximo: </span>
                  <span className="font-medium text-gray-900">
                    {maxValue}{config.unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
        <p className="text-sm text-blue-700">
          <strong>💡 Información:</strong> Los umbrales configurados generarán alertas automáticas
          cuando los valores de los sensores superen estos límites.
        </p>
      </div>

      {/* Botón para editar umbrales */}
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
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    humidity: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
    ec: PropTypes.shape({
      min: PropTypes.number,
      max: PropTypes.number,
    }),
  }),
  onEditClick: PropTypes.func.isRequired,
};