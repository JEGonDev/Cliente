import PropTypes from 'prop-types';
import { ModulesList } from '../ui/ModulesList';
import { Button } from '../../../ui/components/Button';

/**
 * Componente presentacional para el modo de edición de módulos
 */
export const EducationEditMode = ({
  filteredModules,
  isAdmin,
  selectedModuleToEdit,
  onSelectModule,
  onCancel,
  onConfirm
}) => {
  return (
    <>
      <ModulesList
        modules={filteredModules || []}
        isAdmin={isAdmin}
        isSelectable
        selectedModules={selectedModuleToEdit ? [selectedModuleToEdit] : []}
        onSelectModule={onSelectModule}
      />
      
      <div
        role="status"
        className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4"
      >
        <p className="text-yellow-700 font-semibold mb-2">
          ⚙️ Editar módulo educativo
        </p>
        <p className="text-yellow-700 mb-2">
          Selecciona el módulo que quieres <strong>modificar</strong> y luego pulsa <strong>"Editar seleccionado"</strong>.
        </p>
        <ul className="list-decimal list-inside text-yellow-700">
          <li>Escoge el módulo en la lista.</li>
          <li>Haz clic en <strong>"Editar seleccionado"</strong>.</li>
        </ul>
      </div>
      
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <Button variant="white" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={onConfirm}
          disabled={!selectedModuleToEdit}
        >
          Editar seleccionado
        </Button>
      </div>
    </>
  );
};

EducationEditMode.propTypes = {
  filteredModules: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  selectedModuleToEdit: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onSelectModule: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};