import { useState, useCallback, useEffect, useRef } from 'react';
import { cropService } from '../services/cropService';

/**
 * Hook personalizado para la monitorización en tiempo real
 * 
 * @param {number} cropId - ID del cultivo a monitorear
 * @param {Array} sensorIds - IDs de los sensores a monitorear
 * @param {number} interval - Intervalo de actualización en ms (por defecto 15000ms = 15s)
 * @returns {Object} Lecturas en tiempo real y métodos relacionados
 */
export const useRealTimeMonitoring = (cropId, sensorIds = [], interval = 15000) => {
  const [realTimeData, setRealTimeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [timeRange, setTimeRange] = useState('6H'); // '1H', '6H', '24H'

  // Referencia para controlar el tiempo entre llamadas
  const lastFetchTime = useRef(0);
  const minTimeBetweenFetches = 5000; // Mínimo 5 segundos entre llamadas

  /**
   * Obtiene las últimas lecturas de los sensores
   */
  const fetchLatestReadings = useCallback(async () => {
    if (!cropId || sensorIds.length === 0) {
      console.log('[Monitor] No hay cultivo o sensores para monitorear');
      return;
    }

    // Controlar tiempo entre llamadas
    const now = Date.now();
    if (now - lastFetchTime.current < minTimeBetweenFetches) {
      console.log('[Monitor] Demasiado pronto para otra llamada, esperando...');
      return;
    }

    console.log(`[Monitor] Iniciando fetchLatestReadings para cultivo ${cropId} y sensores ${sensorIds.join(', ')}`);
    lastFetchTime.current = now;

    if (loading) {
      console.log('[Monitor] Ya hay una petición en curso, saltando...');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {};
      console.log(`[Monitor] Obteniendo lecturas para rango: ${timeRange}`);

      for (const sensorId of sensorIds) {
        const now = new Date();
        let startDate = new Date(now);

        switch (timeRange) {
          case '1H':
            startDate.setHours(now.getHours() - 1);
            break;
          case '24H':
            startDate.setDate(now.getDate() - 1);
            break;
          case '6H':
          default:
            startDate.setHours(now.getHours() - 6);
            break;
        }

        const params = {
          cropId,
          sensorId,
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
          limit: 100
        };

        console.log(`[Monitor] Consultando sensor ${sensorId} con params:`, params);
        const response = await cropService.getReadingHistory(params);

        if (response.data && response.data.length > 0) {
          const readings = response.data.sort((a, b) =>
            new Date(b.readingDate) - new Date(a.readingDate)
          );

          data[sensorId] = {
            current: readings[0],
            trend: calculateTrend(readings),
            history: readings
          };
        }
      }

      console.log('[Monitor] Actualizando datos en tiempo real:', data);
      setRealTimeData(data);
    } catch (err) {
      console.error('[Monitor] Error al obtener lecturas:', err);
      setError(err.message || 'Error al obtener las lecturas en tiempo real.');
    } finally {
      setLoading(false);
    }
  }, [cropId, sensorIds, timeRange, loading]);

  /**
   * Calcula la tendencia de las lecturas
   * 
   * @param {Array} readings - Lecturas ordenadas por fecha (más reciente primero)
   * @returns {Object} Información sobre la tendencia
   */
  const calculateTrend = (readings) => {
    if (!readings || readings.length < 2) {
      return { direction: 'stable', value: 'Estable', time: '' };
    }

    // Tomar la primera (más reciente) y la última lectura
    const latest = readings[0];
    const oldest = readings[readings.length - 1];

    // Calcular diferencia
    const diff = latest.readingValue - oldest.readingValue;

    // Determinar dirección
    const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable';

    // Formatear valor (con signo + si es positivo)
    const value = direction === 'stable' ? 'Estable' :
      (direction === 'up' ? '+' : '') + diff.toFixed(1);

    // Calcular tiempo transcurrido
    const latestDate = new Date(latest.readingDate);
    const oldestDate = new Date(oldest.readingDate);
    const diffTime = Math.abs(latestDate - oldestDate);
    const diffHours = Math.round(diffTime / (1000 * 60 * 60));
    const time = diffHours > 0 ? `últimas ${diffHours}h` : 'última hora';

    return { direction, value, time };
  };

  /**
   * Inicia el monitoreo en tiempo real
   */
  const startMonitoring = useCallback(() => {
    if (isMonitoring) {
      console.log('[Monitor] Ya está monitoreando, ignorando llamada');
      return;
    }

    console.log('[Monitor] Iniciando monitoreo');
    fetchLatestReadings();
    setIsMonitoring(true);
  }, [fetchLatestReadings, isMonitoring]);

  /**
   * Detiene el monitoreo en tiempo real
   */
  const stopMonitoring = useCallback(() => {
    console.log('[Monitor] Deteniendo monitoreo');
    setIsMonitoring(false);
  }, []);

  /**
   * Cambia el rango de tiempo para el monitoreo
   */
  const changeTimeRange = useCallback((range) => {
    console.log(`[Monitor] Cambiando rango de tiempo a: ${range}`);
    setTimeRange(range);
  }, []);

  // Efecto único para manejar el intervalo de actualización
  useEffect(() => {
    let intervalId = null;

    if (isMonitoring) {
      console.log(`[Monitor] Configurando intervalo de actualización: ${interval}ms`);
      intervalId = setInterval(() => {
        console.log('[Monitor] Ejecutando actualización programada');
        fetchLatestReadings();
      }, interval);
    }

    return () => {
      if (intervalId) {
        console.log('[Monitor] Limpiando intervalo de actualización');
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring, interval]); // Removido fetchLatestReadings de las dependencias

  return {
    realTimeData,
    loading,
    error,
    isMonitoring,
    timeRange,
    startMonitoring,
    stopMonitoring,
    changeTimeRange,
    fetchLatestReadings
  };
};