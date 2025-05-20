import { useState, useCallback } from 'react';
import { cropService } from '../services/cropService'

/**
 * Hook personalizado para la gestión de alertas
 * 
 * @returns {Object} Métodos y estados para trabajar con alertas
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene todas las alertas del usuario
   */
  const fetchUserAlerts = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getUserAlerts();
      setAlerts(response.data || []);
    } catch (err) {
      console.error('Error al obtener alertas del usuario:', err);
      setError(err.message || 'Error al cargar las alertas.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene las alertas de un cultivo específico
   * 
   * @param {number} cropId - ID del cultivo
   */
  const fetchAlertsByCropId = useCallback(async (cropId) => {
    if (!cropId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getAlertsByCropId(cropId);
      setAlerts(response.data || []);
    } catch (err) {
      console.error(`Error al obtener alertas del cultivo ${cropId}:`, err);
      setError(err.message || 'Error al cargar las alertas del cultivo.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene una alerta por su ID
   * 
   * @param {number} alertId - ID de la alerta
   */
  const fetchAlertById = useCallback(async (alertId) => {
    if (!alertId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getAlertById(alertId);
      setSelectedAlert(response.data || null);
    } catch (err) {
      console.error(`Error al obtener alerta ${alertId}:`, err);
      setError(err.message || 'Error al cargar la alerta.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Elimina una alerta
   * 
   * @param {number} alertId - ID de la alerta a eliminar
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const deleteAlert = useCallback(async (alertId) => {
    if (!alertId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await cropService.deleteAlert(alertId);
      // Actualizar la lista de alertas
      setAlerts(prevAlerts => prevAlerts.filter(alert => alert.id !== alertId));
      
      if (selectedAlert && selectedAlert.id === alertId) {
        setSelectedAlert(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error al eliminar alerta ${alertId}:`, err);
      setError(err.message || 'Error al eliminar la alerta.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedAlert]);

  return {
    alerts,
    selectedAlert,
    loading,
    error,
    fetchUserAlerts,
    fetchAlertsByCropId,
    fetchAlertById,
    deleteAlert,
    setSelectedAlert
  };
};