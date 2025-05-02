import { ModulesList } from './ModulesList';

/**
 * Componente para la administración de módulos educativos
 * Permite crear, modificar y eliminar módulos
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.modules - Lista de módulos
 */
export const AdminModules = ({ modules = [] }) => {
  return (
    <div>
      {/* Controles de administración */}
      <div className="flex flex-wrap gap-4 mb-6 mt-4">
        <button className="bg-green-700 text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors">
          Crear módulo
        </button>

        <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors">
          Modificar módulo
        </button>

        <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors">
          Eliminar módulo
        </button>
      </div>

      {/* Lista de módulos */}
      <ModulesList 
        modules={modules}
        isAdmin={true}
      />
    </div>
  );
};
