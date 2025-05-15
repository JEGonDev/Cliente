// src/features/education/ui/ModulesList.jsx
import PropTypes from 'prop-types';
import { ModuleCard } from './ModuleCard';

export const ModulesList = ({ 
  modules = [], 
  isAdmin = false,
  isSelectable = false,
  selectedModules = [],
  onSelectModule = () => {}
}) => {
  // Función para manejar la selección de un módulo
  const handleSelect = (moduleId) => {
    if (isSelectable) {
      // Si ya hay un módulo seleccionado y es diferente al actual, deseleccionarlo
      if (selectedModules.length > 0 && selectedModules[0] !== moduleId) {
        onSelectModule(selectedModules[0]); // Deseleccionar el módulo anterior
      }
      // Seleccionar o deseleccionar el módulo actual
      onSelectModule(moduleId);
    }
  };

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
                  onChange={() => handleSelect(module.moduleId || module.id)}
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
              isSelectable={isSelectable}
              isSelected={selectedModules.includes(module.moduleId || module.id)}
              onSelect={handleSelect}
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
  selectedModules: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])),
  onSelectModule: PropTypes.func
};