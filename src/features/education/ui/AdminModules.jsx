import { ModulesList } from './ModulesList';
import PropTypes from 'prop-types';

/**
 * Componente para la administración de módulos educativos
 * Permite crear, modificar y eliminar módulos
 *
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.modules - Lista de módulos
 */
export const AdminModules = ({ modules = [] }) => {
  return (
    <div className="flex flex-col px-6 py-4 gap-8">

      {/* Lista de módulos */}
      <div className="flex-1">
        <ModulesList 
          modules={modules}
          isAdmin={true}
        />
      </div>

      {/* Botones de administración */}
      <div className="flex flex-wrap gap-4 mt-10 justify-center">
        <button className="bg-[#043707] text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors">
          Crear módulo
        </button>

        <button className="bg-[#043707] text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors">
          Modificar módulo
        </button>

        <button className="bg-[#043707] text-white px-6 py-3 rounded-md hover:bg-green-800 transition-colors">
          Eliminar módulo
        </button>
      </div>
    </div>
  );
};

// Validación de props
AdminModules.propTypes = {
  modules: PropTypes.arrayOf(PropTypes.object)
};
