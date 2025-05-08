import PropTypes from 'prop-types';
import { ModuleCard } from './ModuleCard';

export const ModulesList = ({ 
  modules = [], 
  isAdmin = false,
  isSelectable = false,
  selectedModules = [],
  onSelectModule = () => {}
}) => {
  // Si no hay módulos, mostrar datos de ejemplo
  if (modules.length === 0) {
    modules = [
      {
        id: '1',
        title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
        tags: ['Principiantes', 'PrimerosPasos', 'General'],
        videosCount: 10,
        articlesCount: 10,
        guidesCount: 25
      },
      // ... otros módulos de ejemplo
    ];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-6">
      {modules.map((module) => (
        <div key={module.id} className="relative">
          {isSelectable && (
            <div className="absolute top-2 right-2 z-10">
              <input 
                type="checkbox" 
                checked={selectedModules.includes(module.id)}
                onChange={() => onSelectModule(module.id)}
                className="h-5 w-5 text-green-600 focus:ring-green-500"
              />
            </div>
          )}
          <ModuleCard
            id={module.id}
            title={module.title}
            tags={module.tags}
            videosCount={module.videosCount}
            articlesCount={module.articlesCount}
            guidesCount={module.guidesCount}
            isAdmin={isAdmin}
          />
        </div>
      ))}
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