import { useState, useCallback } from 'react';
import { cropService } from '../services/cropService';

/**
 * Hook personalizado para la gestión de lecturas de sensores
 * 
 * @returns {Object} Métodos y estados para trabajar con lecturas
 */
export const useReadings = () => {
  const [readings, setReadings] = useState([]);
  const [selectedReading, setSelectedReading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene lecturas de un cultivo específico
   * 
   * @param {number} cropId - ID del cultivo
   */
  const fetchReadingsByCropId = useCallback(async (cropId) => {
    if (!cropId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getReadingsByCropId(cropId);
      setReadings(response.data || []);
    } catch (err) {
      console.error(`Error al obtener lecturas del cultivo ${cropId}:`, err);
      setError(err.message || 'Error al cargar las lecturas del cultivo.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene una lectura por su ID
   * 
   * @param {number} readingId - ID de la lectura
   */
  const fetchReadingById = useCallback(async (readingId) => {
    if (!readingId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getReadingById(readingId);
      setSelectedReading(response.data || null);
    } catch (err) {
      console.error(`Error al obtener lectura ${readingId}:`, err);
      setError(err.message || 'Error al cargar la lectura.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene historial de lecturas con filtros
   * 
   * @param {Object} params - Parámetros de filtrado
   */
  const fetchReadingHistory = useCallback(async (params) => {
    if (!params || !params.cropId || !params.sensorId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getReadingHistory(params);
      setReadings(response.data || []);
    } catch (err) {
      console.error('Error al obtener historial de lecturas:', err);
      setError(err.message || 'Error al cargar el historial de lecturas.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea una nueva lectura de sensor
   * 
   * @param {Object} readingData - Datos de la lectura
   * @returns {Promise<Object|null>} Lectura creada o null si hay error
   */
  const createReading = useCallback(async (readingData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.createReading(readingData);
      
      // Actualizar la lista de lecturas
      const newReading = response.data;
      setReadings(prevReadings => [...prevReadings, newReading]);
      
      return newReading;
    } catch (err) {
      console.error('Error al crear lectura:', err);
      setError(err.message || 'Error al crear la lectura.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Procesa un lote de lecturas
   * 
   * @param {Object} batchData - Datos del lote de lecturas
   * @returns {Promise<Array|null>} Lecturas procesadas o null si hay error
   */
  const processBatchReadings = useCallback(async (batchData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.processBatchReadings(batchData);
      
      // Actualizar la lista de lecturas
      const newReadings = response.data;
      setReadings(prevReadings => [...prevReadings, ...newReadings]);
      
      return newReadings;
    } catch (err) {
      console.error('Error al procesar lote de lecturas:', err);
      setError(err.message || 'Error al procesar el lote de lecturas.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    readings,
    selectedReading,
    loading,
    error,
    fetchReadingsByCropId,
    fetchReadingById,
    fetchReadingHistory,
    createReading,
    processBatchReadings,
    setSelectedReading
  };
};