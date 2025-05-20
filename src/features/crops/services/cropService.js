import { API } from '../../../common/config/api';

export const cropService = {

  // ==================== Operaciones para los cultivos ====================

  /**
   * Crea un nuevo cultivo
   * 
   * @param {Object} cropData - Datos del cultivo a crear
   * @returns {Promise<Object>} - Datos del cultivo creado
   */
  createCrop: async (cropData) => {
    try {
      const response = await API.post('/crops', cropData);
      return response.data;
    } catch (error) {
      console.error('Error al crear cultivo:', error);
      throw error;
    }
  },

  /**
   * Obtiene un cultivo por su ID
   * 
   * @param {number} id - ID del cultivo
   * @returns {Promise<Object>} - Datos del cultivo
   */
  getCropById: async (id) => {
    try {
      const response = await API.get(`/crops/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener cultivo:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los cultivos del usuario autenticado
   * 
   * @returns {Promise<Array>} - Lista de cultivos del usuario
   */
  getUserCrops: async () => {
    try {
      const response = await API.get('/crops');
      return response.data;
    } catch (error) {
      console.error('Error al obtener cultivos del usuario:', error);
      throw error;
    }
  },

  /**
   * Actualiza un cultivo existente
   * 
   * @param {number} id - ID del cultivo a actualizar
   * @param {Object} cropData - Nuevos datos del cultivo
   * @returns {Promise<Object>} - Datos del cultivo actualizado
   */
  updateCrop: async (id, cropData) => {
    try {
      const response = await API.put(`/crops/${id}`, cropData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar cultivo:', error);
      throw error;
    }
  },

  /**
   * Elimina un cultivo por su ID
   * 
   * @param {number} id - ID del cultivo a eliminar
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  deleteCrop: async (id) => {
    try {
      const response = await API.delete(`/crops/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar cultivo:', error);
      throw error;
    }
  },

  // ==================== Operaciones para los sensores ====================

  /**
   * Crea un nuevo sensor
   * 
   * @param {Object} sensorData - Datos del sensor a crear
   * @returns {Promise<Object>} - Datos del sensor creado
   */
  createSensor: async (sensorData) => {
    try {
      const response = await API.post('/sensors', sensorData);
      return response.data;
    } catch (error) {
      console.error('Error al crear sensor:', error);
      throw error;
    }
  },

  /**
   * Obtiene un sensor por su ID
   * 
   * @param {number} id - ID del sensor
   * @returns {Promise<Object>} - Datos del sensor
   */
  getSensorById: async (id) => {
    try {
      const response = await API.get(`/sensors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener sensor:', error);
      throw error;
    }
  },

  /**
   * Obtiene todos los sensores disponibles
   * 
   * @returns {Promise<Array>} - Lista de todos los sensores
   */
  getAllSensors: async () => {
    try {
      const response = await API.get('/sensors');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sensores:', error);
      throw error;
    }
  },

  /**
   * Obtiene los sensores del usuario autenticado
   * 
   * @returns {Promise<Array>} - Lista de sensores del usuario
   */
  getUserSensors: async () => {
    try {
      const response = await API.get('/sensors/user');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sensores del usuario:', error);
      throw error;
    }
  },

  /**
   * Actualiza un sensor existente
   * 
   * @param {number} id - ID del sensor a actualizar
   * @param {Object} sensorData - Nuevos datos del sensor
   * @returns {Promise<Object>} - Datos del sensor actualizado
   */
  updateSensor: async (id, sensorData) => {
    try {
      const response = await API.put(`/sensors/${id}`, sensorData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar sensor:', error);
      throw error;
    }
  },

  /**
   * Elimina un sensor por su ID
   * 
   * @param {number} id - ID del sensor a eliminar
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  deleteSensor: async (id) => {
    try {
      const response = await API.delete(`/sensors/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar sensor:', error);
      throw error;
    }
  },

  /**
   * Obtiene los sensores asociados a un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   * @returns {Promise<Array>} - Lista de sensores del cultivo
   */
  getSensorsByCropId: async (cropId) => {
    try {
      const response = await API.get(`/sensors/crop/${cropId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener sensores del cultivo:', error);
      throw error;
    }
  },

  /**
   * Asocia un sensor a un cultivo con umbrales personalizados
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @param {Object} thresholds - Umbrales para el sensor
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  addSensorToCropWithThresholds: async (cropId, sensorId, thresholds) => {
    try {
      const response = await API.post(
        `/sensors/crop/${cropId}/sensor/${sensorId}/thresholds`,
        null,
        { params: thresholds }
      );
      return response.data;
    } catch (error) {
      console.error('Error al asociar sensor con umbrales:', error);
      throw error;
    }
  },

  /**
   * Actualiza los umbrales de un sensor asociado a un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @param {Object} thresholds - Nuevos umbrales
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  updateSensorThresholds: async (cropId, sensorId, thresholds) => {
    try {
      const response = await API.put(
        `/sensors/crop/${cropId}/sensor/${sensorId}/thresholds`,
        null,
        { params: thresholds }
      );
      return response.data;
    } catch (error) {
      console.error('Error al actualizar umbrales de sensor:', error);
      throw error;
    }
  },

  /**
   * Asocia un sensor a un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  addSensorToCrop: async (cropId, sensorId) => {
    try {
      const response = await API.post(`/sensors/crop/${cropId}/sensor/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error('Error al asociar sensor a cultivo:', error);
      throw error;
    }
  },

  /**
   * Desasocia un sensor de un cultivo
   * 
   * @param {number} cropId - ID del cultivo
   * @param {number} sensorId - ID del sensor
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  removeSensorFromCrop: async (cropId, sensorId) => {
    try {
      const response = await API.delete(`/sensors/crop/${cropId}/sensor/${sensorId}`);
      return response.data;
    } catch (error) {
      console.error('Error al desasociar sensor de cultivo:', error);
      throw error;
    }
  },

  /**
   * Crea un sensor y lo asocia a un cultivo con umbrales
   * 
   * @param {number} cropId - ID del cultivo
   * @param {Object} sensorData - Datos del sensor y umbrales
   * @returns {Promise<Object>} - Datos del sensor creado y asociado
   */
  createSensorAndAssociateToCrop: async (cropId, sensorData) => {
    try {
      const response = await API.post(`/sensors/crop/${cropId}/create-with-thresholds`, sensorData);
      return response.data;
    } catch (error) {
      console.error('Error al crear y asociar sensor:', error);
      throw error;
    }
  },

  // ==================== Operaciones para las alertas ====================

  /**
   * Obtiene una alerta por su ID
   * 
   * @param {number} id - ID de la alerta
   * @returns {Promise<Object>} - Datos de la alerta
   */
  getAlertById: async (id) => {
    try {
      const response = await API.get(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener alerta:', error);
      throw error;
    }
  },

  /**
   * Obtiene las alertas de un cultivo específico
   * 
   * @param {number} cropId - ID del cultivo
   * @returns {Promise<Array>} - Lista de alertas del cultivo
   */
  getAlertsByCropId: async (cropId) => {
    try {
      const response = await API.get(`/alerts/crop/${cropId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener alertas del cultivo:', error);
      throw error;
    }
  },

  /**
   * Obtiene todas las alertas del usuario autenticado
   * 
   * @returns {Promise<Array>} - Lista de alertas del usuario
   */
  getUserAlerts: async () => {
    try {
      const response = await API.get('/alerts/user');
      return response.data;
    } catch (error) {
      console.error('Error al obtener alertas del usuario:', error);
      throw error;
    }
  },

  /**
   * Elimina una alerta por su ID
   * 
   * @param {number} id - ID de la alerta a eliminar
   * @returns {Promise<Object>} - Respuesta de confirmación
   */
  deleteAlert: async (id) => {
    try {
      const response = await API.delete(`/alerts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar alerta:', error);
      throw error;
    }
  },

  // ==================== Operaciones para las lecturas de los sensores ====================

    /**
   * Crea una nueva lectura de sensor
   * 
   * @param {Object} readingData - Datos de la lectura a crear
   * @returns {Promise<Object>} - Datos de la lectura creada
   */
  createReading: async (readingData) => {
    try {
      const response = await API.post('/readings', readingData);
      return response.data;
    } catch (error) {
      console.error('Error al crear lectura:', error);
      throw error;
    }
  },

  /**
   * Procesa un lote de lecturas de sensores
   * 
   * @param {Object} batchData - Datos del lote de lecturas
   * @returns {Promise<Array>} - Lista de lecturas procesadas
   */
  processBatchReadings: async (batchData) => {
    try {
      const response = await API.post('/readings/batch', batchData);
      return response.data;
    } catch (error) {
      console.error('Error al procesar lote de lecturas:', error);
      throw error;
    }
  },

  /**
   * Obtiene una lectura por su ID
   * 
   * @param {number} id - ID de la lectura
   * @returns {Promise<Object>} - Datos de la lectura
   */
  getReadingById: async (id) => {
    try {
      const response = await API.get(`/readings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lectura:', error);
      throw error;
    }
  },

  /**
   * Obtiene las lecturas de un cultivo específico
   * 
   * @param {number} cropId - ID del cultivo
   * @returns {Promise<Array>} - Lista de lecturas del cultivo
   */
  getReadingsByCropId: async (cropId) => {
    try {
      const response = await API.get(`/readings/crop/${cropId}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener lecturas del cultivo:', error);
      throw error;
    }
  },

  /**
   * Obtiene historial de lecturas con filtros
   * 
   * @param {Object} params - Parámetros de filtrado
   * @param {number} params.cropId - ID del cultivo
   * @param {number} params.sensorId - ID del sensor
   * @param {string} params.startDate - Fecha de inicio (opcional)
   * @param {string} params.endDate - Fecha de fin (opcional)
   * @param {number} params.limit - Límite de registros (opcional)
   * @returns {Promise<Array>} - Lista de lecturas filtradas
   */
  getReadingHistory: async (params) => {
    try {
      const response = await API.get('/readings/history', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener historial de lecturas:', error);
      throw error;
    }
  }
}