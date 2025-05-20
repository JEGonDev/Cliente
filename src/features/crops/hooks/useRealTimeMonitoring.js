import { useState, useCallback, useEffect } from 'react';
import { cropService } from '../services/cropService';

/**
 * Hook personalizado para la monitorización en tiempo real
 * 
 * @param {number} cropId - ID del cultivo a monitorear
 * @param {Array} sensorIds - IDs de los sensores a monitorear
 * @param {number} interval - Intervalo de actualización en ms (por defecto 60000ms = 1min)
 * @returns {Object} Lecturas en tiempo real y métodos relacionados
 */
export const useRealTimeMonitoring = (cropId, sensorIds = [], interval = 60000) => {
  const [realTimeData, setRealTimeData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [timeRange, setTimeRange] = useState('6H'); // '1H', '6H', '24H'

  /**
   * Obtiene las últimas lecturas de los sensores
   */
  const fetchLatestReadings = useCallback(async () => {
    if (!cropId || sensorIds.length === 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Crear objeto para almacenar los datos por sensor
      const data = {};
      
      // Para cada sensor, obtener su última lectura
      for (const sensorId of sensorIds) {
        // Calcular el rango de tiempo según la selección
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
        
        // Obtener las lecturas para este sensor en el rango de tiempo
        const params = {
          cropId,
          sensorId,
          startDate: startDate.toISOString(),
          endDate: now.toISOString(),
          limit: 100
        };
        
        const response = await cropService.getReadingHistory(params);
        
        // Si tenemos lecturas, guardarlas en data
        if (response.data && response.data.length > 0) {
          // Ordenar por fecha (más reciente primero)
          const readings = response.data.sort((a, b) => 
            new Date(b.readingDate) - new Date(a.readingDate)
          );
          
          // Mantener una serie de datos para gráficos
          data[sensorId] = {
            current: readings[0], // La lectura más reciente
            trend: calculateTrend(readings), // Calcular tendencia
            history: readings // Todas las lecturas para graficar
          };
        }
      }
      
      setRealTimeData(data);
    } catch (err) {
      console.error('Error al obtener lecturas en tiempo real:', err);
      setError(err.message || 'Error al obtener las lecturas en tiempo real.');
    } finally {
      setLoading(false);
    }
  }, [cropId, sensorIds, timeRange]);

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
    if (isMonitoring) return;
    
    // Obtener datos inmediatamente
    fetchLatestReadings();
    
    // Iniciar monitoreo periódico
    setIsMonitoring(true);
  }, [fetchLatestReadings, isMonitoring]);

  /**
   * Detiene el monitoreo en tiempo real
   */
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
  }, []);

  /**
   * Cambia el rango de tiempo para el monitoreo
   * 
   * @param {string} range - Nuevo rango de tiempo ('1H', '6H', '24H')
   */
  const changeTimeRange = useCallback((range) => {
    setTimeRange(range);
  }, []);

  // Efecto para manejar el intervalo de actualización
  useEffect(() => {
    let intervalId = null;
    
    if (isMonitoring) {
      intervalId = setInterval(fetchLatestReadings, interval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isMonitoring, fetchLatestReadings, interval]);

  // Efecto para actualizar cuando cambia el rango de tiempo
  useEffect(() => {
    if (isMonitoring) {
      fetchLatestReadings();
    }
  }, [timeRange, fetchLatestReadings, isMonitoring]);

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