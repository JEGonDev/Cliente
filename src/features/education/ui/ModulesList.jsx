import PropTypes from 'prop-types';
import { ModuleCard } from './ModuleCard';

export const ModulesList = ({ 
  modules = [], 
  isAdmin = false,
  isSelectable = false,
  selectedModules = [],
  onSelectModule = () => {}
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-6">
      {modules.length === 0 ? (
        <div className="col-span-3 text-center py-8">
          <p className="text-gray-500">No hay módulos disponibles</p>
        </div>
      ) : (
        modules.map((module) => (
  <div key={module.moduleId || module.id} className="relative">
    {/* Interfaz de selección para modo de eliminación */}
    {isSelectable && (
      <div className="absolute top-2 right-2 z-10">
        <input 
          type="checkbox" 
          checked={selectedModules.includes(module.moduleId || module.id)}
          onChange={() => onSelectModule(module.moduleId || module.id)}
          className="h-5 w-5 text-green-600 focus:ring-green-500"
        />
      </div>
    )}
    <ModuleCard
      id={module.moduleId || module.id}
      title={module.title}
      tags={module.tags || []}
      videosCount={module.videosCount || 0}
      articlesCount={module.articlesCount || 0}
      guidesCount={module.guidesCount || 0}
      isAdmin={isAdmin}
    />
          </div>
        ))
      )}
    </div>
  );
};

// Validación de propiedades
ModulesList.propTypes = {
  modules: PropTypes.arrayOf(PropTypes.object),
  isAdmin: PropTypes.bool,
  isSelectable: PropTypes.bool,
  selectedModules: PropTypes.arrayOf(PropTypes.string),
  onSelectModule: PropTypes.func
};