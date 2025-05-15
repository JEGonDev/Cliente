import { useState, useEffect } from 'react';
import { Button } from '../../../ui/components/Button';
import { CreateTagModal, EditTagModal, DeleteTagModal } from '../ui/TagModals';
import { useTags } from '../hooks/useTags';

/**
 * Componente simple que muestra botones para gestionar etiquetas (CRUD)
 * 
 * @returns {JSX.Element} Componente con botones para gestión de etiquetas
 */
export const TagManagementButtons = ({ onTagsUpdated }) => {
  const { tags, fetchAllTags } = useTags();

  // Estados para controlar la apertura de modales
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Estado para la etiqueta seleccionada (para edición/eliminación)
  const [selectedTag, setSelectedTag] = useState(null);

  // Estado local de etiquetas para poder actualizarlo inmediatamente
  const [localTags, setLocalTags] = useState([]);

  useEffect(() => {
    if (tags && Array.isArray(tags)) {
      setLocalTags([...tags]);
    }
  }, [tags]);

  // Función para refrescar las etiquetas después de cambios
  const handleTagsUpdated = async () => {
    // Obtener etiquetas actualizadas del servidor
    const updatedTags = await fetchAllTags();

    // Actualizar el estado local inmediatamente sin esperar a la re-renderización
    if (updatedTags && Array.isArray(updatedTags)) {
      setLocalTags([...updatedTags]);
    }
  };

  // Estado para controlar el modal de selección de etiqueta
  const [selectTagModalOpen, setSelectTagModalOpen] = useState(false);
  const [selectAction, setSelectAction] = useState('');

  // Handler para abrir el modal de edición
  const handleOpenEditModal = () => {
    // Si hay etiquetas disponibles, abrir el selector
    if (tags && tags.length > 0) {
      setSelectAction('edit');
      setSelectTagModalOpen(true);
    } else {
      alert('No hay etiquetas disponibles para editar.');
    }
  };

  // Handler para abrir el modal de eliminación
  const handleOpenDeleteModal = () => {
    // Si hay etiquetas disponibles, abrir el selector
    if (tags && tags.length > 0) {
      setSelectAction('delete');
      setSelectTagModalOpen(true);
    } else {
      alert('No hay etiquetas disponibles para eliminar.');
    }
  };

  // Handler para procesar la selección de etiqueta
  const handleTagSelected = (tag) => {
    setSelectedTag(tag);
    setSelectTagModalOpen(false);

    // Aquí está el cambio clave - asegurarnos de que los modales se abren
    // después de que el modal de selección se cierra
    setTimeout(() => {
      if (selectAction === 'edit') {
        setEditModalOpen(true);
      } else if (selectAction === 'delete') {
        setDeleteModalOpen(true);
      }
    }, 50);
  };

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {/* Título de la sección */}
      <div className="w-full mb-2">
        <h3 className="text-lg font-medium">Gestión de Etiquetas</h3>
      </div>

      {/* Botones CRUD */}
      <Button
        variant="primary"
        size="sm"
        onClick={() => setCreateModalOpen(true)}
      >
        Crear Etiqueta
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleOpenEditModal}
        disabled={!tags || tags.length === 0}
      >
        Editar Etiqueta
      </Button>

      <Button
        variant="danger"
        size="sm"
        onClick={handleOpenDeleteModal}
        disabled={!tags || tags.length === 0}
      >
        Eliminar Etiqueta
      </Button>

      {/* Modales para operaciones CRUD */}
      <CreateTagModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={onTagsUpdated}
      />

      <EditTagModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        tag={selectedTag}
        onSuccess={onTagsUpdated}
      />

      <DeleteTagModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        tags={selectedTag}
        onSuccess={onTagsUpdated}
      />

      {/* Modal para seleccionar etiqueta */}
      {selectTagModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Overlay semitransparente */}
            <div className="fixed inset-0 transition-opacity" onClick={() => setSelectTagModalOpen(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>

            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6"
              role="dialog" aria-modal="true" aria-labelledby="modal-headline">
              <div>
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                    Seleccionar Etiqueta
                  </h3>
                  <div className="mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {localTags.map(tag => (
                        <div
                          key={tag.id}
                          className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50"
                          onClick={() => handleTagSelected(tag)}
                        >
                          <span>#{tag.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-700 hover:bg-gray-300 focus:outline-none sm:text-sm"
                  onClick={() => setSelectTagModalOpen(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};