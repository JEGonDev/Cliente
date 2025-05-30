import { MonitoringLayout } from '../layouts/MonitoringLayout';
import { AlertsLayout } from '../layouts/AlertsLayout';

/**
 * Página dedicada a mostrar y configurar alertas
 */
export const AlertsPage = () => {
  return (
    <MonitoringLayout activeSection="alertas">
      <AlertsLayout />
    </MonitoringLayout>
  );
};