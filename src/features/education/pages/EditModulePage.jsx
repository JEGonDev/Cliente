import { ModuleFormLayout } from '../layouts/ModuleFormLayout';

/**
 * Página para editar un módulo educativo 
 * 
 * @returns {JSX.Element}
 */
export const EditModulePage = () => {
  return (
    <ModuleFormLayout
      title="Editar Módulo"
      submitText="Guardar cambios"
      onSubmit={() => {}}
      onCancel={() => {}}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título del módulo
          </label>
          <input
            type="text"
            name="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <textarea
            name="description"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500"
          ></textarea>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2">
            {['Principiantes', 'PrimerosPasos', 'General', 'Avanzado', 'Tomate', 'Infraestructura'].map((tag) => (
              <div key={tag} className="flex items-center">
                <input
                  type="checkbox"
                  id={`tag-${tag}`}
                  className="h-4 w-4 border-gray-300 rounded text-green-600 focus:ring-green-500"
                />
                <label htmlFor={`tag-${tag}`} className="ml-2 text-sm text-gray-700">
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ModuleFormLayout>
  );
};
