import { useState, useCallback } from 'react';
import { cropService } from '../services/cropService';

/**
 * Hook personalizado para la gestión de sensores
 * 
 * @returns {Object} Métodos y estados para trabajar con sensores
 */
export const useSensors = () => {
  const [sensors, setSensors] = useState([]);
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene todos los sensores disponibles
   */
  const fetchAllSensors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getAllSensors();
      setSensors(response.data || []);
    } catch (err) {
      console.error('Error al obtener sensores:', err);
      setError(err.message || 'Error al cargar los sensores.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene los sensores del usuario
   */
  const fetchUserSensors = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getUserSensors();
      setSensors(response.data || []);
    } catch (err) {
      console.error('Error al obtener sensores del usuario:', err);
      setError(err.message || 'Error al cargar los sensores del usuario.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene un sensor por su ID
   * 
   * @param {number} sensorId - ID del sensor
   */
  const fetchSensorById = useCallback(async (sensorId) => {
    if (!sensorId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getSensorById(sensorId);
      setSelectedSensor(response.data || null);
    } catch (err) {
      console.error(`Error al obtener sensor ${sensorId}:`, err);
      setError(err.message || 'Error al cargar el sensor.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene los sensores de un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   */
  const fetchSensorsByCropId = useCallback(async (cropId) => {
    if (!cropId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getSensorsByCropId(cropId);
      setSensors(response.data || []);
    } catch (err) {
      console.error(`Error al obtener sensores del cultivo ${cropId}:`, err);
      setError(err.message || 'Error al cargar los sensores del cultivo.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo sensor
   * 
   * @param {Object} sensorData - Datos del sensor
   * @returns {Promise<Object|null>} Sensor creado o null si hay error
   */
  const createSensor = useCallback(async (sensorData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.createSensor(sensorData);
      
      // Actualizar la lista de sensores
      const newSensor = response.data;
      setSensors(prevSensors => [...prevSensors, newSensor]);
      
      return newSensor;
    } catch (err) {
      console.error('Error al crear sensor:', err);
      setError(err.message || 'Error al crear el sensor.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza un sensor existente
   * 
   * @param {number} sensorId - ID del sensor
   * @param {Object} sensorData - Nuevos datos del sensor
   * @returns {Promise<Object|null>} Sensor actualizado o null si hay error
   */
  const updateSensor = useCallback(async (sensorId, sensorData) => {
    if (!sensorId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.updateSensor(sensorId, sensorData);
      
      // Actualizar la lista de sensores
      const updatedSensor = response.data;
      setSensors(prevSensors => 
        prevSensors.map(sensor => sensor.id === sensorId ? updatedSensor : sensor)
      );
      
      // Actualizar selectedSensor si es el que se está editando
      if (selectedSensor && selectedSensor.id === sensorId) {
        setSelectedSensor(updatedSensor);
      }
      
      return updatedSensor;
    } catch (err) {
      console.error(`Error al actualizar sensor ${sensorId}:`, err);
      setError(err.message || 'Error al actualizar el sensor.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedSensor]);

  /**
   * Elimina un sensor
   * 
   * @param {number} sensorId - ID del sensor
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const deleteSensor = useCallback(async (sensorId) => {
    if (!sensorId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await cropService.deleteSensor(sensorId);
      
      // Actualizar la lista de sensores
      setSensors(prevSensors => prevSensors.filter(sensor => sensor.id !== sensorId));
      
      // Limpiar selectedSensor si es el que se está eliminando
      if (selectedSensor && selectedSensor.id === sensorId) {
        setSelectedSensor(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error al eliminar sensor ${sensorId}:`, err);
      setError(err.message || 'Error al eliminar el sensor.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedSensor]);

/**
   * Asocia un sensor a un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const addSensorToCrop = useCallback(async (cropId, sensorId) => {
    if (!cropId || !sensorId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await cropService.addSensorToCrop(cropId, sensorId);
      return true;
    } catch (err) {
      console.error(`Error al asociar sensor ${sensorId} a cultivo ${cropId}:`, err);
      setError(err.message || 'Error al asociar el sensor al cultivo.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Asocia un sensor a un cultivo con umbrales
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @param {Object} thresholds - Umbrales para el sensor
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const addSensorToCropWithThresholds = useCallback(async (cropId, sensorId, thresholds) => {
    if (!cropId || !sensorId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await cropService.addSensorToCropWithThresholds(cropId, sensorId, thresholds);
      return true;
    } catch (err) {
      console.error(`Error al asociar sensor ${sensorId} a cultivo ${cropId} con umbrales:`, err);
      setError(err.message || 'Error al asociar el sensor al cultivo con umbrales.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza los umbrales de un sensor asociado a un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @param {Object} thresholds - Nuevos umbrales
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const updateSensorThresholds = useCallback(async (cropId, sensorId, thresholds) => {
    if (!cropId || !sensorId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await cropService.updateSensorThresholds(cropId, sensorId, thresholds);
      return true;
    } catch (err) {
      console.error(`Error al actualizar umbrales de sensor ${sensorId} en cultivo ${cropId}:`, err);
      setError(err.message || 'Error al actualizar los umbrales del sensor.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Desasocia un sensor de un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const removeSensorFromCrop = useCallback(async (cropId, sensorId) => {
    if (!cropId || !sensorId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await cropService.removeSensorFromCrop(cropId, sensorId);
      return true;
    } catch (err) {
      console.error(`Error al desasociar sensor ${sensorId} de cultivo ${cropId}:`, err);
      setError(err.message || 'Error al desasociar el sensor del cultivo.');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un sensor y lo asocia a un cultivo con umbrales
   * 
   * @param {number} cropId - ID del cultivo
   * @param {Object} sensorData - Datos del sensor y umbrales
   * @returns {Promise<Object|null>} Sensor creado o null si hay error
   */
  const createSensorAndAssociateToCrop = useCallback(async (cropId, sensorData) => {
    if (!cropId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.createSensorAndAssociateToCrop(cropId, sensorData);
      
      // Actualizar la lista de sensores
      const newSensor = response.data;
      setSensors(prevSensors => [...prevSensors, newSensor]);
      
      return newSensor;
    } catch (err) {
      console.error(`Error al crear sensor y asociarlo al cultivo ${cropId}:`, err);
      setError(err.message || 'Error al crear y asociar el sensor al cultivo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sensors,
    selectedSensor,
    loading,
    error,
    fetchAllSensors,
    fetchUserSensors,
    fetchSensorById,
    fetchSensorsByCropId,
    createSensor,
    updateSensor,
    deleteSensor,
    addSensorToCrop,
    addSensorToCropWithThresholds,
    updateSensorThresholds,
    removeSensorFromCrop,
    createSensorAndAssociateToCrop,
    setSelectedSensor
  };
};