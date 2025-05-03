import { ModuleDetailLayout } from '../layouts/ModuleDetailLayout';
import { ModuleDetail } from '../ui/ModuleDetail';

/**
 * Página de detalle de un módulo educativo
 * Muestra toda la información, artículos, guías y videos de un módulo
 * 
 * @returns {JSX.Element} Página de detalle de módulo
 */
export const ModuleDetailPage = () => {
  const module = {
    id: '1',
    title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
    tags: ['Principiantes', 'PrimerosPasos', 'General']
  };

  const isAdmin = true;

  const renderActions = () => (
    <>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
        Editar módulo
      </button>
      <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
        Eliminar módulo
      </button>
    </>
  );

  return (
    <ModuleDetailLayout
      moduleTitle={module.title}
      actions={isAdmin ? renderActions() : null}
    >
      <ModuleDetail module={module} isAdmin={isAdmin} />
    </ModuleDetailLayout>
  );
};
