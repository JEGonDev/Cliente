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
    <div className="space-y-6 font-inter">
      {/* Lista de módulos */}
      <ModulesList
        modules={filteredModules || []}
        isAdmin={isAdmin}
        isSelectable
        selectedModules={selectedModuleToEdit ? [selectedModuleToEdit] : []}
        onSelectModule={onSelectModule}
      />

      {/* Aviso informativo */}
      <div
        role="status"
        className="bg-yellow-50 border-l-4 border-yellow-400 p-5 rounded-md shadow-sm"
      >
        <p className="text-yellow-800 font-bold text-base flex items-center gap-2 mb-2">
          ⚙️ Editar módulo educativo
        </p>
        <p className="text-yellow-700 text-sm mb-2">
          Selecciona el módulo que quieres <strong>modificar</strong> y luego pulsa <strong>"Editar seleccionado"</strong>.
        </p>
        <ul className="list-decimal list-inside text-yellow-700 text-sm space-y-1">
          <li>Escoge el módulo en la lista.</li>
          <li>Haz clic en <strong>"Editar seleccionado"</strong>.</li>
        </ul>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap justify-center gap-4 pt-2">
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
    </div>
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
