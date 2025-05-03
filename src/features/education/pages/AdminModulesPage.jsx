import { EducationLayout } from '../layouts/EducationLayout';
import { AdminModules } from '../ui/AdminModules';

/**
 * Página de administración de módulos educativos
 * Permite crear, modificar y eliminar módulos
 * 
 * @returns {JSX.Element} Página de administración
 */
export const AdminModulesPage = () => {
  return (
    <EducationLayout
      title="Administrar Módulos Educativos"
    >
      <AdminModules />
    </EducationLayout>
  );
};
