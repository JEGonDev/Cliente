import { EducationLayout } from '../layouts/EducationLayout';
import { ModuleFilters } from '../ui/ModuleFilters';
import { ModulesList } from '../ui/ModulesList';

/**
 * Página principal del módulo educativo
 * Muestra una lista de módulos educativos con filtros y buscador
 * 
 * @returns {JSX.Element} Página de módulos educativos
 */
export const EducationPage = () => {
  const isAdmin = true;

  const renderActions = () => (
    <button className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800 transition-colors">
      Administrar módulos
    </button>
  );

  return (
    <EducationLayout
      title="Contenido educativo"
      actions={isAdmin ? renderActions() : null}
    >
      <ModuleFilters isAdmin={isAdmin} />
      <ModulesList modules={[]} isAdmin={false} />
    </EducationLayout>
  );
};
