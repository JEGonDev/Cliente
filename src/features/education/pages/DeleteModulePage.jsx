import { EducationLayout } from '../layouts/EducationLayout';
import { ModulesList } from '../ui/ModulesList';

export const DeleteModulePage = () => {
  return (
    <EducationLayout title="Eliminar Módulos Educativos">
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <p className="text-yellow-700">
          Nota: Marque las casillas de los módulos que desea eliminar y oprima el botón eliminar módulo para realizar la acción.
        </p>
      </div>

      {/* Aquí se renderiza una lista de módulos simulada */}
      <ModulesList 
        modules={[
          { id: '109234', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
          { id: '109235', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
          { id: '109236', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
        ]}
        isAdmin={true}
        isSelectable={true}
        onSelectModule={() => {}}
        selectedModules={[]}
      />

      <div className="mt-6 flex justify-center gap-4">
        <button
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 opacity-50 cursor-not-allowed"
        >
          Eliminar módulos seleccionados
        </button>
      </div>
    </EducationLayout>
  );
};
