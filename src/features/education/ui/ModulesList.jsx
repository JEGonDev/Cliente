import { useState } from 'react';
import { ModuleCard } from './components/ModuleCard';

/**
 * Componente para mostrar una lista de módulos educativos en formato grid
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.modules - Lista de módulos a mostrar
 * @param {boolean} props.isAdmin - Indica si se muestra en modo administrador
 * @param {boolean} props.isSelectable - Indica si se pueden seleccionar módulos
 * @param {Function} props.onSelectModule - Función para manejar selección
 * @param {Array} props.selectedModules - Array con IDs de módulos seleccionados
 */
export const ModulesList = ({ 
  modules = [], 
  isAdmin = false, 
  isSelectable = false,
  onSelectModule = () => {},
  selectedModules = []
}) => {
  // En una implementación real, esto vendría de un custom hook
  const [localModules] = useState(modules.length > 0 ? modules : [
    { id: '109234', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
    { id: '109235', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
    { id: '109236', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
    { id: '109237', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
    { id: '109238', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
    { id: '109239', title: 'Primeros pasos para comenzar con tu cultivo hidroponía', tags: ['Principiantes', 'PrimerosPasos', 'General'] },
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
      {localModules.map((module) => (
        <ModuleCard 
          key={module.id}
          module={module}
          isAdmin={isAdmin}
          isSelectable={isSelectable}
          isSelected={selectedModules.includes(module.id)}
          onSelect={onSelectModule}
        />
      ))}
    </div>
  );
};