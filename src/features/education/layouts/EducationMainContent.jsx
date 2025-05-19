import PropTypes from 'prop-types';
import { ModulesList } from '../ui/ModulesList';
import { ModuleFilters } from '../ui/ModuleFilters';
import { AdminControlPanel } from '../ui/AdminControlPanel';
import { TagManagementButtons } from './TagManagementButtons';

/**
 * Componente presentacional para mostrar el contenido principal
 * de la página educativa en modo normal (no edición/eliminación)
 */
export const EducationMainContent = ({
  tags,
  activeTagIds,
  onTagClick,
  isAdmin,
  filteredModules,
  searchValue,
  onTagsUpdated,
  onCreateClick,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <>
      {isAdmin && <TagManagementButtons onTagsUpdated={onTagsUpdated} />}
      
      {Array.isArray(tags) && tags.length > 0 && (
        <ModuleFilters
          tags={tags || []}
          activeTagIds={activeTagIds}
          onTagClick={onTagClick}
        />
      )}
      
      {Array.isArray(tags) && tags.length === 0 && isAdmin && (
        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
          <p className="text-gray-600 mb-3">No hay etiquetas disponibles. Como administrador, puedes crear etiquetas para categorizar los módulos.</p>
        </div>
      )}
      
      {filteredModules.length === 0 && searchValue && (
        <div className="bg-gray-50 text-gray-600 p-4 rounded-md text-center my-4">
          No se encontraron módulos que coincidan con "{searchValue}"
        </div>
      )}
      
      <ModulesList
        modules={filteredModules || []}
        isAdmin={isAdmin}
        isSelectable={false}
      />
      
      {isAdmin && (
        <AdminControlPanel
          onCreateClick={onCreateClick}
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      )}
    </>
  );
};

EducationMainContent.propTypes = {
  tags: PropTypes.array.isRequired,
  activeTagIds: PropTypes.array.isRequired,
  onTagClick: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  filteredModules: PropTypes.array.isRequired,
  searchValue: PropTypes.string.isRequired,
  onTagsUpdated: PropTypes.func.isRequired,
  onCreateClick: PropTypes.func.isRequired,
  onEditClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired
};