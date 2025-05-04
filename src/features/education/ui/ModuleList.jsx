
import PropTypes from 'prop-types';
import { ModuleCard } from './ModuleCard';

/**
 * Componente que muestra una lista de módulos educativos en formato grid.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.modules - Lista de módulos a mostrar
 */
export const ModulesList = ({ modules = [] }) => {
  // Si no hay módulos, mostrar un mensaje
  if (modules.length === 0) {
    // Datos de ejemplo para la maquetación
    modules = [
      {
        id: '1',
        title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
        tags: ['Principiantes', 'PrimerosPasos', 'General'],
        videosCount: 10,
        articlesCount: 10,
        guidesCount: 25
      },
      {
        id: '2',
        title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
        tags: ['Principiantes', 'PrimerosPasos', 'General'],
        videosCount: 10,
        articlesCount: 10,
        guidesCount: 25
      },
      {
        id: '3',
        title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
        tags: ['Principiantes', 'PrimerosPasos', 'General'],
        videosCount: 10,
        articlesCount: 10,
        guidesCount: 25
      },
      {
        id: '4',
        title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
        tags: ['Principiantes', 'PrimerosPasos', 'General'],
        videosCount: 10,
        articlesCount: 10,
        guidesCount: 25
      },
      {
        id: '5',
        title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
        tags: ['Principiantes', 'PrimerosPasos', 'General'],
        videosCount: 10,
        articlesCount: 10,
        guidesCount: 25
      },
      {
        id: '6',
        title: 'Primeros pasos para comenzar con tu cultivo hidroponía',
        tags: ['Principiantes', 'PrimerosPasos', 'General'],
        videosCount: 10,
        articlesCount: 10,
        guidesCount: 25
      }
    ];
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-auto gap-6">
      {modules.map((module) => (
        <ModuleCard
          key={module.id}
          id={module.id}
          title={module.title}
          tags={module.tags}
          videosCount={module.videosCount}
          articlesCount={module.articlesCount}
          guidesCount={module.guidesCount}
        />
      ))}
    </div>
  );
};

// Validación de propiedades
ModulesList.propTypes = {
  modules: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      tags: PropTypes.arrayOf(PropTypes.string),
      videosCount: PropTypes.number,
      articlesCount: PropTypes.number,
      guidesCount: PropTypes.number
    })
  )
};