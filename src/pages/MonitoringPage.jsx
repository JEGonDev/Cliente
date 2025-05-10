import { useState } from 'react';
import { MonitoringLayout } from '../features/crops/layouts/MonitoringLayout';
import { DataHistoryLayout } from '../features/crops/layouts/DataHistoryLayout';
import { AlertsLayout } from '../features/crops/layouts/AlertsLayout';
import { RealTimeLayout } from '../features/crops/layouts/RealTimeLayout';

/**
 * Página principal del módulo de monitoreo
 * Actúa como un contenedor para las distintas secciones
 */
export const MonitoringPage = () => {
  // Estado para controlar la sección activa
  const [activeSection, setActiveSection] = useState('historial');
  
  // Renderizar el contenido según la sección activa
  const renderContent = () => {
    switch (activeSection) {
      case 'alertas':
        return <AlertsLayout />;
      case 'tiempo-real':
        return <RealTimeLayout />;
      case 'historial':
      default:
        return <DataHistoryLayout />;
    }
  };
  
  return (
    <MonitoringLayout activeSection={activeSection}>
      {renderContent()}
    </MonitoringLayout>
  );
};