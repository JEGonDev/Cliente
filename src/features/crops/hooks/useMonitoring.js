import { useContext } from 'react';
import { MonitoringContext } from '../context/MonitoringContext';
import { useMonitoringThresholds } from './useMonitoringThresholds';

/**
 * Hook personalizado para acceder al contexto de monitoreo
 * 
 * @returns {Object} Contexto de monitoreo
 */
export const useMonitoring = () => {
  const context = useContext(MonitoringContext);
  
  if (!context) {
    throw new Error(
      'useMonitoring debe ser utilizado dentro de un MonitoringProvider'
    );
  }
<<<<<<< HEAD
  
  return context;
=======

  const {
    thresholds,
    loading: thresholdsLoading,
    error: thresholdsError,
    updateThreshold,
    updateAllThresholds,
    loadThresholds
  } = useMonitoringThresholds();

  return {
    // Valores del contexto original
    ...context,
    // Valores de thresholds
    thresholds,
    loading: context.loading || thresholdsLoading,
    error: context.error || thresholdsError,
    updateThreshold,
    updateAllThresholds,
    loadThresholds
  };
>>>>>>> 0a2550518ec84c66039853f89ca439e946330407
};