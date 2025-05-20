import { useEducationPage } from '../features/education/hooks/useEducationPage';
import { EducationLayout } from '../features/education/layouts/EducationLayout';
import { EducationMainContent } from '../features/education/layouts/EducationMainContent';
import { EducationEditMode } from '../features/education/layouts/EducationEditMode';
import { EducationDeleteMode } from '../features/education/layouts/EducationDeleteMode';
import { DeleteConfirmationModal } from '../features/education/ui/DeleteConfirmationModal';
import { AdminControlPanel } from '../features/education/ui/AdminControlPanel';

/**
 * Componente principal para la página de educación.
 * Actúa como un contenedor (container) que utiliza hooks personalizados
 * para la lógica y delega la presentación a componentes especializados.
 * 
 * @returns {JSX.Element} Página completa de educación
 */
export const EducationPage = () => {
  // Utilizamos el hook personalizado para toda la lógica de la página
  const {
    // Estados
    activeIcon,
    searchValue,
    activeTagIds,
    isDeleteMode,
    selectedModules,
    isEditMode,
    selectedModuleToEdit,
    filteredModules,
    deleteConfirmModalOpen,
    moduleToDelete,
    
    // Datos
    tags,
    
    // Estados derivados
    isLoading,
    hasError,
    isAdmin,
    
    // Handlers
    handleIconClick,
    handleSearchChange,
    handleTagClick,
    handleCreateModule,
    handleEditModule,
    handleCancelEdit,
    handleSelectModuleForEdit,
    handleConfirmEdit,
    handleEnterDeleteMode,
    handleCancelDelete,
    handleSelectModule,
    handleConfirmDelete,
    handleModalConfirmDelete,
    setDeleteConfirmModalOpen,
    handleTagsUpdated
  } = useEducationPage();

  // Renderizamos el contenido apropiado según el estado
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (hasError) {
      return (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded mb-6">
          <p className="text-center">No hay módulos disponibles para mostrar</p>
          {isAdmin && (
            <div className="mt-8">
              <AdminControlPanel
                onCreateClick={handleCreateModule}
                onEditClick={handleEditModule}
                onDeleteClick={handleEnterDeleteMode}
              />
            </div>
          )}
        </div>
      );
    }

    if (isEditMode) {
      return (
        <EducationEditMode
          filteredModules={filteredModules}
          isAdmin={isAdmin}
          selectedModuleToEdit={selectedModuleToEdit}
          onSelectModule={handleSelectModuleForEdit}
          onCancel={handleCancelEdit}
          onConfirm={handleConfirmEdit}
        />
      );
    }

    if (isDeleteMode) {
      return (
        <EducationDeleteMode
          filteredModules={filteredModules}
          isAdmin={isAdmin}
          selectedModules={selectedModules}
          onSelectModule={handleSelectModule}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
        />
      );
    }

    // Estado normal - mostrar contenido principal
    return (
      <EducationMainContent
        tags={tags}
        activeTagIds={activeTagIds}
        onTagClick={handleTagClick}
        isAdmin={isAdmin}
        filteredModules={filteredModules}
        searchValue={searchValue}
        onTagsUpdated={handleTagsUpdated}
        onCreateClick={handleCreateModule}
        onEditClick={handleEditModule}
        onDeleteClick={handleEnterDeleteMode}
      />
    );
  };

  return (
    <EducationLayout
      activeIcon={activeIcon}
      onIconClick={handleIconClick}
      tags={Array.isArray(tags) ? tags : []}
      activeTagIds={activeTagIds}
      onTagClick={handleTagClick}
      isAdmin={isAdmin}
      searchValue={searchValue}
      onSearchChange={handleSearchChange}
    >
      {renderContent()}
      
      {/* Modal de confirmación para eliminación */}
      <DeleteConfirmationModal
        isOpen={deleteConfirmModalOpen}
        onClose={() => setDeleteConfirmModalOpen(false)}
        onConfirm={handleModalConfirmDelete}
        title="Eliminar módulo educativo"
        message="¿Estás seguro de que deseas eliminar este módulo? Esta acción no se puede deshacer y eliminará todo el contenido asociado."
      />
    </EducationLayout>
  );
};