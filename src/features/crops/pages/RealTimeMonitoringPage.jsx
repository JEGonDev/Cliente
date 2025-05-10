import { MonitoringLayout } from '../layouts/MonitoringLayout';
import { RealTimeLayout } from '../layouts/RealTimeLayout';

/**
 * Página dedicada a mostrar monitoreo en tiempo real
 */
export const RealTimeMonitoringPage = () => {
  return (
    <MonitoringLayout activeSection="tiempo-real">
      <RealTimeLayout />
    </MonitoringLayout>
  );
};