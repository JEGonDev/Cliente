import PropTypes from 'prop-types';
import { ModulesList } from '../ui/ModulesList';
import { DeleteModeNotice } from '../ui/DeleteModeNotice';

/**
 * Componente presentacional para el modo de eliminación de módulos
 */
export const EducationDeleteMode = ({
  filteredModules,
  isAdmin,
  selectedModules,
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
        selectedModules={selectedModules}
        onSelectModule={onSelectModule}
      />
      
      <DeleteModeNotice
        onCancel={onCancel}
        onConfirm={onConfirm}
        hasSelected={selectedModules.length > 0}
      />
    </>
  );
};

EducationDeleteMode.propTypes = {
  filteredModules: PropTypes.array.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  selectedModules: PropTypes.array.isRequired,
  onSelectModule: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired
};