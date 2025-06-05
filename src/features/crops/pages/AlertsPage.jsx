import { useEffect } from 'react';
import { MonitoringLayout } from '../layouts/MonitoringLayout';
import { AlertsLayout } from '../layouts/AlertsLayout';
import { useMonitoring } from '../hooks/useMonitoring';

/**
 * Página dedicada a mostrar y configurar alertas
 */
export const AlertsPage = () => {
  const { setActiveSection } = useMonitoring();

  useEffect(() => {
    setActiveSection('alertas');
  }, [setActiveSection]);

  return (
    <MonitoringLayout activeSection="alertas">
      <AlertsLayout />
    </MonitoringLayout>
  );
};