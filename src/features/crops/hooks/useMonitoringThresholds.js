import { useState, useCallback } from 'react';
import { cropService } from '../services/cropService';

/**
 * Hook personalizado para la gestión de umbrales de monitoreo
 * 
 * @returns {Object} Métodos y estados para trabajar con umbrales
 */
export const useMonitoringThresholds = () => {
  const [thresholds, setThresholds] = useState({
    temperature: { min: 18.0, max: 26.0 },
    humidity: { min: 60, max: 80 },
    ec: { min: 1.0, max: 1.6 },
    ph: { min: 5.5, max: 6.5 }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
          min: newThresholds.min,
          max: newThresholds.max
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
   * @param {Object} newThresholds - Objeto con todos los umbrales
   */
  const updateAllThresholds = useCallback((newThresholds) => {
    if (!newThresholds) return;
    setThresholds(newThresholds);
  }, []);

  return {
    thresholds,
    loading,
    error,
    updateThreshold,
    updateAllThresholds
  };
};