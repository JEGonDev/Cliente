import { useState, useCallback, useEffect } from 'react';
import { cropService } from '../services/cropService';

/**
 * Hook personalizado para la gestión de umbrales de monitoreo
 * 
 * @returns {Object} Métodos y estados para trabajar con umbrales
 */
export const useMonitoringThresholds = () => {
  // Estado inicial con valores por defecto
  const [thresholds, setThresholds] = useState({
    temperature: { min: 18.0, max: 26.0 },
    humidity: { min: 60, max: 80 },
    ec: { min: 500, max: 1500 },
    ph: { min: 5.5, max: 6.5 }
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Determina el tipo normalizado del sensor
   * @param {string} sensorType - Tipo de sensor original
   * @returns {string} Tipo normalizado o cadena vacía si no se reconoce
   */
  const getNormalizedSensorType = (sensorType) => {
    if (!sensorType) return '';

    const type = sensorType.toLowerCase();
    if (type.includes('temp')) return 'temperature';
    if (type.includes('hum')) return 'humidity';
    if (type.includes('tds') || type.includes('ec') || type.includes('cond')) return 'ec';
    if (type.includes('ph')) return 'ph';
    return '';
  };

  /**
   * Carga los umbrales configurados para un cultivo específico
   */
  const loadThresholds = useCallback(async (cropId) => {
    if (!cropId) return;

    // Evitar cargar si ya estamos cargando
    if (loading) {
      console.log('[Thresholds] Ya hay una carga en progreso, saltando...');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('[Thresholds] Cargando umbrales para cultivo:', cropId);
      const response = await cropService.getThresholdsByCropId(cropId);
      console.log('[Thresholds] Respuesta recibida:', response);

      const newThresholds = { ...thresholds }; // Mantener valores por defecto

      // Verificar que tenemos datos válidos
      if (response?.data) {
        const sensorData = Array.isArray(response.data) ? response.data : [response.data];
        let hasChanges = false;

        // Procesar cada sensor
        sensorData.forEach(sensor => {
          if (!sensor) return;

          const type = getNormalizedSensorType(sensor.sensorType);
          if (!type) return;

          // Asegurarse de que los valores son números válidos
          const minValue = parseFloat(sensor.minThreshold);
          const maxValue = parseFloat(sensor.maxThreshold);

          if (!isNaN(minValue) && !isNaN(maxValue)) {
            // Solo actualizar si los valores son diferentes
            if (!newThresholds[type] ||
              newThresholds[type].min !== minValue ||
              newThresholds[type].max !== maxValue) {
              newThresholds[type] = {
                min: minValue,
                max: maxValue
              };
              hasChanges = true;
            }
          }
        });

        // Solo actualizar el estado si hay cambios reales
        if (hasChanges) {
          console.log('[Thresholds] Actualizando umbrales con:', newThresholds);
          setThresholds(newThresholds);
        } else {
          console.log('[Thresholds] No hay cambios en los umbrales');
        }
      }
    } catch (err) {
      console.error('[Thresholds] Error al cargar umbrales:', err);
      setError(err.message || 'Error al cargar los umbrales.');
    } finally {
      setLoading(false);
    }
  }, [loading, thresholds]);

  /**
   * Actualiza los umbrales de un sensor para un cultivo específico
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @param {string} sensorType - Tipo de sensor (temperature, humidity, etc.)
   * @param {Object} newThresholds - Nuevos umbrales { min, max }
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const updateThreshold = useCallback(async (cropId, sensorId, sensorType, newThresholds) => {
    if (!cropId || !sensorId || !sensorType || !newThresholds) return false;

    setLoading(true);
    setError(null);

    try {
      await cropService.updateSensorThresholds(cropId, sensorId, {
        minThreshold: newThresholds.min,
        maxThreshold: newThresholds.max
      });

      // Actualizar el estado local
      setThresholds(prev => ({
        ...prev,
        [sensorType]: {
          min: parseFloat(newThresholds.min),
          max: parseFloat(newThresholds.max)
        }
      }));

      return true;
    } catch (err) {
      console.error('Error al actualizar umbrales:', err);
      setError(err.message || 'Error al actualizar los umbrales.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza todos los umbrales de una vez
   * 
   * @param {number} cropId - ID del cultivo
   * @param {Object} newThresholds - Objeto con todos los umbrales
   */
  const updateAllThresholds = useCallback(async (cropId, newThresholds) => {
    if (!cropId || !newThresholds) return;

    setLoading(true);
    setError(null);

    try {
      // Obtener los sensores del cultivo
      const response = await cropService.getSensorsByCropId(cropId);
      const sensors = Array.isArray(response.data) ? response.data : [];

      // Para cada sensor, actualizar sus umbrales
      for (const sensor of sensors) {
        if (!sensor) continue;

        const type = getNormalizedSensorType(sensor.sensorType);
        if (!type || !newThresholds[type]) continue;

        await cropService.updateSensorThresholds(cropId, sensor.id, {
          minThreshold: newThresholds[type].min,
          maxThreshold: newThresholds[type].max
        });
      }

      // Actualizar el estado local
      setThresholds(newThresholds);

      // Recargar los umbrales para asegurarnos de tener los datos más recientes
      await loadThresholds(cropId);

      return true;
    } catch (err) {
      console.error('Error al actualizar umbrales:', err);
      setError(err.message || 'Error al actualizar los umbrales.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadThresholds]);

  return {
    thresholds,
    loading,
    error,
    updateThreshold,
    updateAllThresholds,
    loadThresholds
  };
};