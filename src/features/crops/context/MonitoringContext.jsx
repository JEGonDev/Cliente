import { createContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useCrops } from '../hooks/useCrops';
import { useSensors } from '../hooks/useSensors';
import { useReadings } from '../hooks/useReadings';
import { useAlerts } from '../hooks/useAlerts';
import { useRealTimeMonitoring } from '../hooks/useRealTimeMonitoring';
import { useMonitoringThresholds } from '../hooks/useMonitoringThresholds';

// Crear el contexto
export const MonitoringContext = createContext({
  // Estado
  crops: [],
  selectedCrop: null,
  sensors: [],
  selectedSensor: null,
  readings: [],
  alerts: [],
  realTimeData: {},
  thresholds: {},
  
  // Estado de la aplicación
  loading: false,
  error: null,
  activeSection: 'monitoreo',
  
  // Métodos para cultivos
  fetchUserCrops: () => {},
  fetchCropById: () => {},
  createCrop: () => {},
  updateCrop: () => {},
  deleteCrop: () => {},
  selectCrop: () => {},
  
  // Métodos para sensores
  fetchAllSensors: () => {},
  fetchUserSensors: () => {},
  fetchSensorById: () => {},
  fetchSensorsByCropId: () => {},
  createSensor: () => {},
  updateSensor: () => {},
  deleteSensor: () => {},
  selectSensor: () => {},
  addSensorToCrop: () => {},
  addSensorToCropWithThresholds: () => {},
  updateSensorThresholds: () => {},
  removeSensorFromCrop: () => {},
  createSensorAndAssociateToCrop: () => {},
  
  // Métodos para lecturas
  fetchReadingsByCropId: () => {},
  fetchReadingById: () => {},
  fetchReadingHistory: () => {},
  createReading: () => {},
  processBatchReadings: () => {},
  
  // Métodos para alertas
  fetchUserAlerts: () => {},
  fetchAlertsByCropId: () => {},
  fetchAlertById: () => {},
  deleteAlert: () => {},
  
  // Métodos para monitoreo en tiempo real
  startMonitoring: () => {},
  stopMonitoring: () => {},
  changeTimeRange: () => {},
  isMonitoring: false,
  timeRange: '6H',
  
  // Métodos para umbrales
  updateThreshold: () => {},
  updateAllThresholds: () => {},
  
  // Navegación
  setActiveSection: () => {}
});

// Proveedor del contexto
export const MonitoringProvider = ({ children }) => {
  // Estado para la sección activa
  const [activeSection, setActiveSection] = useState('monitoreo');
  
  // Usando los hooks personalizados
  const {
    crops, 
    selectedCrop, 
    loading: cropsLoading, 
    error: cropsError,
    fetchUserCrops,
    fetchCropById,
    createCrop,
    updateCrop,
    deleteCrop,
    setSelectedCrop: selectCrop
  } = useCrops();
  
  const {
    sensors,
    selectedSensor,
    loading: sensorsLoading,
    error: sensorsError,
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
    setSelectedSensor: selectSensor
  } = useSensors();
  
  const {
    readings,
    loading: readingsLoading,
    error: readingsError,
    fetchReadingsByCropId,
    fetchReadingById,
    fetchReadingHistory,
    createReading,
    processBatchReadings
  } = useReadings();
  
  const {
    alerts,
    loading: alertsLoading,
    error: alertsError,
    fetchUserAlerts,
    fetchAlertsByCropId,
    fetchAlertById,
    deleteAlert
  } = useAlerts();
  
  // Real-time monitoring 
  // Nota: Solo activamos esto cuando hay un cultivo seleccionado y sensores disponibles
  const sensorIds = useMemo(() => 
    selectedCrop && sensors.filter(s => s.cropId === selectedCrop.id).map(s => s.id) || [],
    [selectedCrop, sensors]
  );
  
  const {
    realTimeData,
    loading: realTimeLoading,
    error: realTimeError,
    isMonitoring,
    timeRange,
    startMonitoring,
    stopMonitoring,
    changeTimeRange
  } = useRealTimeMonitoring(
    selectedCrop?.id, 
    sensorIds, 
    60000 // Actualizar cada minuto
  );
  
  const {
    thresholds,
    loading: thresholdsLoading,
    error: thresholdsError,
    updateThreshold,
    updateAllThresholds
  } = useMonitoringThresholds();
  
  // Combinar estados de carga y error
  const loading = 
    cropsLoading || 
    sensorsLoading || 
    readingsLoading || 
    alertsLoading || 
    realTimeLoading ||
    thresholdsLoading;
  
  const error = 
    cropsError || 
    sensorsError || 
    readingsError || 
    alertsError || 
    realTimeError ||
    thresholdsError;
  
  // Cargar datos iniciales cuando se renderiza el componente
  useEffect(() => {
    fetchUserCrops();
    fetchAllSensors();
    fetchUserAlerts();
  }, [fetchUserCrops, fetchAllSensors, fetchUserAlerts]);
  
  // Cuando se selecciona un cultivo, cargar sus sensores y alertas
  useEffect(() => {
    if (selectedCrop) {
      fetchSensorsByCropId(selectedCrop.id);
      fetchAlertsByCropId(selectedCrop.id);
    }
  }, [selectedCrop, fetchSensorsByCropId, fetchAlertsByCropId]);
  
  // Valor del contexto con todos los estados y métodos
  const contextValue = {
    // Estado
    crops,
    selectedCrop,
    sensors,
    selectedSensor,
    readings,
    alerts,
    realTimeData,
    thresholds,
    
    // Estado de la aplicación
    loading,
    error,
    activeSection,
    
    // Métodos para cultivos
    fetchUserCrops,
    fetchCropById,
    createCrop,
    updateCrop,
    deleteCrop,
    selectCrop,
    
    // Métodos para sensores
    fetchAllSensors,
    fetchUserSensors,
    fetchSensorById,
    fetchSensorsByCropId,
    createSensor,
    updateSensor,
    deleteSensor,
    selectSensor,
    addSensorToCrop,
    addSensorToCropWithThresholds,
    updateSensorThresholds,
    removeSensorFromCrop,
    createSensorAndAssociateToCrop,
    
    // Métodos para lecturas
    fetchReadingsByCropId,
    fetchReadingById,
    fetchReadingHistory,
    createReading,
    processBatchReadings,
    
    // Métodos para alertas
    fetchUserAlerts,
    fetchAlertsByCropId,
    fetchAlertById,
    deleteAlert,
    
    // Métodos para monitoreo en tiempo real
    startMonitoring,
    stopMonitoring,
    changeTimeRange,
    isMonitoring,
    timeRange,
    
    // Métodos para umbrales
    updateThreshold,
    updateAllThresholds,
    
    // Navegación
    setActiveSection
  };
  
  return (
    <MonitoringContext.Provider value={contextValue}>
      {children}
    </MonitoringContext.Provider>
  );
};