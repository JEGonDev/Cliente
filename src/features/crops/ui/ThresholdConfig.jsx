import { useEffect, useState } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Componente para configurar umbrales de alertas
 * Los umbrales dependen del cultivo activo y no son editables
 */
export const ThresholdConfig = () => {
  const [localThresholds, setLocalThresholds] = useState(null);

  const {
    selectedCrop,
    thresholds: cropThresholds,
    loading,
    error
  } = useMonitoring();

  // Cargar umbrales del cultivo seleccionado
  useEffect(() => {
    if (cropThresholds && Object.keys(cropThresholds).length > 0) {
      setLocalThresholds(cropThresholds);
    } else if (selectedCrop) {
      // Umbrales por defecto si no hay ninguno configurado
      const defaultThresholds = {
        temperature: { min: 18.0, max: 26.0 },
        humidity: { min: 60, max: 80 },
        ec: { min: 1.0, max: 1.6 },
        ph: { min: 5.5, max: 6.5 }
      };
      setLocalThresholds(defaultThresholds);
    }
  }, [cropThresholds, selectedCrop]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Configuración de alertas</h2>
      </div>

      {/* Umbrales de cultivo */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="font-medium mb-4">
          Umbrales de alerta del cultivo
          {selectedCrop && ` - ${selectedCrop.name}`}
        </h3>

        {loading ? (
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary mr-2"></div>
            <p className="text-sm text-gray-500">Cargando umbrales del cultivo...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">Error: {error}</p>
          </div>
        ) : !selectedCrop ? (
          <p className="text-sm text-gray-500">
            Selecciona un cultivo para ver sus umbrales configurados
          </p>
        ) : localThresholds ? (
          ['temperature', 'humidity', 'ec'].map(param => (
            <div key={param} className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {param === 'ec' ? 'EC (PPM)' :
                  param === 'ph' ? 'pH' :
                    param.charAt(0).toUpperCase() + param.slice(1) +
                    (param === 'humidity' ? ' (%)' : param === 'temperature' ? ' (°C)' : '')}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Mínimo</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-gray-700"
                    value={localThresholds[param]?.min || 0}
                    readOnly
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Máximo</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-gray-700"
                    value={localThresholds[param]?.max || 0}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No hay umbrales configurados para este cultivo</p>
        )}

        {selectedCrop && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Nota:</strong> Los umbrales mostrados son específicos para este cultivo.
              Para modificarlos, ve a la sección de monitoreo en tiempo real del cultivo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
