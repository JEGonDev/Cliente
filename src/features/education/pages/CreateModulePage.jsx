import { ModuleFormLayout } from '../layouts/ModuleFormLayout';

/**
 * Página para crear un nuevo módulo educativo
 * 
 * @returns {JSX.Element} Página de creación de módulo
 */
export const CreateModulePage = () => {
  return (
    <ModuleFormLayout
      title="Crear Nuevo Módulo Educativo"
      submitText="Crear Módulo"
      onSubmit={() => console.log('Crear módulo con datos')}
      onCancel={() => console.log('Cancelar creación de módulo')}
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
            {['Principiante', 'Avanzado', 'Tomate', 'Lechuga', 'Infraestructura'].map((tag) => (
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
        
        {/* En la implementación real, aquí irían los campos para agregar artículos, guías y videos */}
        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-600">
            Una vez creado el módulo, podrás agregar artículos, guías y videos desde la vista de detalle.
          </p>
        </div>
      </div>
    </ModuleFormLayout>
  );
};
