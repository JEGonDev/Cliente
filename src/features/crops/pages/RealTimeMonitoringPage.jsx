import { MonitoringLayout } from '../layouts/MonitoringLayout';
import { RealTimeLayout } from '../layouts/RealTimeLayout';

export const RealTimeMonitoringPage = () => {
  // cultivoId estático para pruebas temporales
  const cultivoId = "12345";

  return (
    <MonitoringLayout activeSection="tiempo-real">
      <RealTimeLayout cultivoId={cultivoId} />
    </MonitoringLayout>
  );
};
