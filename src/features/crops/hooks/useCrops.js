import { useState, useCallback } from 'react';
import { cropService } from '../services/cropService';

/**
 * Hook personalizado para la gestión de cultivos
 * 
 * @returns {Object} Métodos y estados para trabajar con cultivos
 */
export const useCrops = () => {
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Obtiene todos los cultivos del usuario
   */
  const fetchUserCrops = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getUserCrops();
      setCrops(response.data || []);
    } catch (err) {
      console.error('Error al obtener cultivos del usuario:', err);
      setError(err.message || 'Error al cargar los cultivos.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Obtiene un cultivo por su ID
   * 
   * @param {number} cropId - ID del cultivo
   */
  const fetchCropById = useCallback(async (cropId) => {
    if (!cropId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.getCropById(cropId);
      setSelectedCrop(response.data || null);
    } catch (err) {
      console.error(`Error al obtener cultivo ${cropId}:`, err);
      setError(err.message || 'Error al cargar el cultivo.');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Crea un nuevo cultivo
   * 
   * @param {Object} cropData - Datos del cultivo a crear
   * @returns {Promise<Object|null>} Cultivo creado o null si hay error
   */
  const createCrop = useCallback(async (cropData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.createCrop(cropData);
      
      // Actualizar la lista de cultivos
      const newCrop = response.data;
      setCrops(prevCrops => [...prevCrops, newCrop]);
      
      return newCrop;
    } catch (err) {
      console.error('Error al crear cultivo:', err);
      setError(err.message || 'Error al crear el cultivo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Actualiza un cultivo existente
   * 
   * @param {number} cropId - ID del cultivo a actualizar
   * @param {Object} cropData - Nuevos datos del cultivo
   * @returns {Promise<Object|null>} Cultivo actualizado o null si hay error
   */
  const updateCrop = useCallback(async (cropId, cropData) => {
    if (!cropId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await cropService.updateCrop(cropId, cropData);
      
      // Actualizar la lista de cultivos
      const updatedCrop = response.data;
      setCrops(prevCrops => 
        prevCrops.map(crop => crop.id === cropId ? updatedCrop : crop)
      );
      
      // Actualizar selectedCrop si es el que se está editando
      if (selectedCrop && selectedCrop.id === cropId) {
        setSelectedCrop(updatedCrop);
      }
      
      return updatedCrop;
    } catch (err) {
      console.error(`Error al actualizar cultivo ${cropId}:`, err);
      setError(err.message || 'Error al actualizar el cultivo.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedCrop]);

  /**
   * Elimina un cultivo
   * 
   * @param {number} cropId - ID del cultivo a eliminar
   * @returns {Promise<boolean>} Resultado de la operación
   */
  const deleteCrop = useCallback(async (cropId) => {
    if (!cropId) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      await cropService.deleteCrop(cropId);
      
      // Actualizar la lista de cultivos
      setCrops(prevCrops => prevCrops.filter(crop => crop.id !== cropId));
      
      // Limpiar selectedCrop si es el que se está eliminando
      if (selectedCrop && selectedCrop.id === cropId) {
        setSelectedCrop(null);
      }
      
      return true;
    } catch (err) {
      console.error(`Error al eliminar cultivo ${cropId}:`, err);
      setError(err.message || 'Error al eliminar el cultivo.');
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedCrop]);

  return {
    crops,
    selectedCrop,
    loading,
    error,
    fetchUserCrops,
    fetchCropById,
    createCrop,
    updateCrop,
    deleteCrop,
    setSelectedCrop
  };
};