import { useContext } from 'react';
import { MonitoringContext } from '../context/MonitoringContext';

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
  
  return context;
};