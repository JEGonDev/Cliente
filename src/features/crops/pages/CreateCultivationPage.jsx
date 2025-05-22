import { CreateCultivationLayout } from "../layouts/CreateCultivationLayout";
import { MonitoringLayout } from "../layouts/MonitoringLayout";

export const CreateCultivationPage = () => {
  return (
    <MonitoringLayout activeSection="cultivos">
      <CreateCultivationLayout />
    </MonitoringLayout>
  );
};
