import { CropsLayout } from '../layouts/CropsLayout';  
import { MonitoringLayout } from '../layouts/MonitoringLayout';


export const CropsPage = () => {
  return (
  <div>
     {/* Contenido principal de cultivos */}
<MonitoringLayout activeSection="cultivos">
      <CropsLayout />
    </MonitoringLayout>
  </div>      
       

  );
};
