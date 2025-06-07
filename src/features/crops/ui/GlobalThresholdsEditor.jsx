import { useState, useEffect } from 'react';
import { useMonitoring } from '../hooks/useMonitoring';
import PropTypes from 'prop-types';

export const GlobalThresholdsEditor = ({ thresholds, setThresholds }) => {
  const [localThresholds, setLocalThresholds] = useState(thresholds);
  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const { selectedCrop } = useMonitoring();

  // Configuración de umbrales con límites y validaciones
  const thresholdConfig = {
    temperature: {
      label: 'Temperatura',
      unit: '°C',
      icon: '🌡️',
      limits: { min: -10, max: 50 },
      defaultRange: { min: 18, max: 26 },
      step: 0.1,
      description: 'Rango óptimo de temperatura para el crecimiento'
    },
    humidity: {
      label: 'Humedad',
      unit: '%',
      icon: '💧',
      limits: { min: 0, max: 100 },
      defaultRange: { min: 60, max: 80 },
      step: 1,
      description: 'Nivel de humedad relativa recomendado'
    },
    ec: {
      label: 'Conductividad Eléctrica (EC)',
      unit: 'mS/cm',
      icon: '⚡',
      limits: { min: 0, max: 5 },
      defaultRange: { min: 1.0, max: 1.6 },
      step: 0.1,
      description: 'Concentración de nutrientes en la solución'
    }
  };

  // Sincronizar con props cuando cambian
  useEffect(() => {
    setLocalThresholds(thresholds);
    setHasChanges(false);
  }, [thresholds]);

  // Detectar cambios
  useEffect(() => {
    const hasChanged = JSON.stringify(localThresholds) !== JSON.stringify(thresholds);
    setHasChanges(hasChanged);
  }, [localThresholds, thresholds]);

  const validateThreshold = (type, limit, value) => {
    const config = thresholdConfig[type];
    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return 'Debe ser un número válido';
    }

    if (numValue < config.limits.min || numValue > config.limits.max) {
      return `Debe estar entre ${config.limits.min} y ${config.limits.max} ${config.unit}`;
    }

    // Validar que min < max
    if (limit === 'min') {
      const maxValue = localThresholds[type]?.max;
      if (maxValue && numValue >= maxValue) {
        return 'El valor mínimo debe ser menor que el máximo';
      }
    } else if (limit === 'max') {
      const minValue = localThresholds[type]?.min;
      if (minValue && numValue <= minValue) {
        return 'El valor máximo debe ser mayor que el mínimo';
      }
    }

    return null;
  };

  const handleChange = (type, limit, value) => {
    const numValue = parseFloat(value);

    // Actualizar valor local
    setLocalThresholds(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [limit]: isNaN(numValue) ? value : numValue
      }
    }));

    // Validar
    const error = validateThreshold(type, limit, value);
    setErrors(prev => ({
      ...prev,
      [`${type}_${limit}`]: error
    }));

    // Actualizar en el componente padre
    if (!error && !isNaN(numValue)) {
      setThresholds(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          [limit]: numValue
        }
      }));
    }
  };

  const handleReset = (type) => {
    const config = thresholdConfig[type];
    const resetValues = {
      min: config.defaultRange.min,
      max: config.defaultRange.max
    };

    setLocalThresholds(prev => ({
      ...prev,
      [type]: resetValues
    }));

    setThresholds(prev => ({
      ...prev,
      [type]: resetValues
    }));

    // Limpiar errores
    setErrors(prev => ({
      ...prev,
      [`${type}_min`]: null,
      [`${type}_max`]: null
    }));
  };

  const handleResetAll = () => {
    const resetThresholds = {};
    Object.keys(thresholdConfig).forEach(type => {
      resetThresholds[type] = { ...thresholdConfig[type].defaultRange };
    });

    setLocalThresholds(resetThresholds);
    setThresholds(resetThresholds);
    setErrors({});
  };

  const getValidationSummary = () => {
    const errorCount = Object.values(errors).filter(error => error).length;
    const totalFields = Object.keys(thresholdConfig).length * 2;

    return {
      hasErrors: errorCount > 0,
      errorCount,
      validFields: totalFields - errorCount,
      totalFields
    };
  };

  const validation = getValidationSummary();

  return (
    <div className="space-y-6">
      {/* Header con información */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold mb-2">Configuración de Umbrales</h3>
          <p className="text-sm text-gray-600">
            Configure los valores mínimos y máximos para generar alertas automáticas
            {selectedCrop && ` para el cultivo "${selectedCrop.name}"`}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResetAll}
            className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
          >
            Restaurar defaults
          </button>
        </div>
      </div>

      {/* Estado de validación */}
      {validation.hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <p className="text-red-700 text-sm">
            ⚠️ {validation.errorCount} error{validation.errorCount !== 1 ? 'es' : ''} de validación.
            Corrígelos antes de guardar.
          </p>
        </div>
      )}

      {hasChanges && !validation.hasErrors && (
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
          <p className="text-blue-700 text-sm">
            💡 Tienes cambios sin guardar. Los umbrales se aplicarán cuando guardes la configuración.
          </p>
        </div>
      )}

      {/* Configuración de umbrales */}
      <div className="space-y-6">
        {Object.entries(thresholdConfig).map(([type, config]) => (
          <div key={type} className="bg-white border rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{config.icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{config.label}</h4>
                  <p className="text-xs text-gray-600">{config.description}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleReset(type)}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Restaurar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Valor mínimo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor mínimo
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={localThresholds[type]?.min || ''}
                    onChange={(e) => handleChange(type, 'min', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${errors[`${type}_min`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder={config.defaultRange.min.toString()}
                    step={config.step}
                    min={config.limits.min}
                    max={config.limits.max}
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">
                    {config.unit}
                  </span>
                </div>
                {errors[`${type}_min`] && (
                  <p className="mt-1 text-xs text-red-600">{errors[`${type}_min`]}</p>
                )}
              </div>

              {/* Valor máximo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valor máximo
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={localThresholds[type]?.max || ''}
                    onChange={(e) => handleChange(type, 'max', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary ${errors[`${type}_max`] ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder={config.defaultRange.max.toString()}
                    step={config.step}
                    min={config.limits.min}
                    max={config.limits.max}
                  />
                  <span className="absolute right-3 top-2 text-sm text-gray-500">
                    {config.unit}
                  </span>
                </div>
                {errors[`${type}_max`] && (
                  <p className="mt-1 text-xs text-red-600">{errors[`${type}_max`]}</p>
                )}
              </div>
            </div>

            {/* Rango visual */}
            <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
              Rango válido: {config.limits.min}{config.unit} - {config.limits.max}{config.unit} |
              Recomendado: {config.defaultRange.min}{config.unit} - {config.defaultRange.max}{config.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Resumen */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Resumen de configuración</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          {Object.entries(localThresholds).map(([type, values]) => {
            const config = thresholdConfig[type];
            if (!config || !values) return null;

            return (
              <div key={type} className="flex items-center justify-between">
                <span>{config.label}:</span>
                <span className="font-medium">
                  {values.min}{config.unit} - {values.max}{config.unit}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
          Estado: {validation.validFields}/{validation.totalFields} campos válidos
          {hasChanges && ' • Cambios pendientes'}
        </div>
      </div>
    </div>
  );
};

GlobalThresholdsEditor.propTypes = {
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
  }).isRequired,
  setThresholds: PropTypes.func.isRequired,
};
