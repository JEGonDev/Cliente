import { useEffect } from 'react';
import { CropsLayout } from '../layouts/CropsLayout';
import { MonitoringLayout } from '../layouts/MonitoringLayout';
import { useMonitoring } from '../hooks/useMonitoring';

export const CropsPage = () => {
  const {
    fetchUserCrops,
    setActiveSection,
    loading,
    error
  } = useMonitoring();

  // Establecer la sección activa y cargar datos
  useEffect(() => {
    setActiveSection('cultivos');
    fetchUserCrops();
  }, [setActiveSection, fetchUserCrops]);

  return (
    <MonitoringLayout activeSection="cultivos">
      <CropsLayout />
    </MonitoringLayout>
  );
};
