import { useEffect } from 'react';
import { MonitoringLayout } from '../layouts/MonitoringLayout';
import { DataHistoryLayout } from '../layouts/DataHistoryLayout';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Página dedicada a mostrar el historial y análisis de datos
 */
export const DataHistoryPage = () => {
  const { setActiveSection } = useMonitoring();

  useEffect(() => {
    setActiveSection('historial');
  }, [setActiveSection]);

  return (
    <MonitoringLayout activeSection="historial">
      <DataHistoryLayout />
    </MonitoringLayout>
  );
};