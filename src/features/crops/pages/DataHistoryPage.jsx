import { MonitoringLayout } from '../layouts/MonitoringLayout';
import { DataHistoryLayout } from '../layouts/DataHistoryLayout';

/**
 * Página dedicada a mostrar el historial y análisis de datos
 */
export const DataHistoryPage = () => {
  return (
    <MonitoringLayout activeSection="historial">
      <DataHistoryLayout />
    </MonitoringLayout>
  );
};