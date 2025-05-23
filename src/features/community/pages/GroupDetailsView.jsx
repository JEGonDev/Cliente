import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHashtag, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { ThreadList } from "../ui/ThreadList";
import { useGroup } from "../hooks/useGroup";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { GroupEditModal } from "../ui/GroupEditModal";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";

export const GroupDetailsView = () => {
  const { groupId } = useParams();
  
  // Estados locales para modales
  const [showThreadModal, setShowThreadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Hooks
  const { isAdmin, canModerateContent } = useAuthRoles();
  
  const {
    selectedGroup: group,
    groupLoading,
    groupError,
    formData,
    formErrors,
    successMessage,
    isEditing,
    updateLoading,
    handleChange,
    handleJoinGroup,
    handleDeleteGroup,
    handleUpdateGroup,
    loadGroupForEdit,
    cancelEdit,
    clearMessages,
  } = useGroup(groupId);

  // Memoizar el ID del grupo para evitar renders innecesarios
  const stableGroupId = useMemo(() => group?.id, [group]);

  // ✅ Handlers para edición
  const handleEditClick = () => {
    if (group) {
      loadGroupForEdit(group);
      setShowEditModal(true);
      clearMessages();
    }
  };

  const handleEditSubmit = async () => {
    const result = await handleUpdateGroup(group.id);
    if (result) {
      // Cerrar modal después de éxito
      setTimeout(() => {
        setShowEditModal(false);
        cancelEdit();
      }, 1500);
    }
  };

  const handleEditClose = () => {
    setShowEditModal(false);
    cancelEdit();
    clearMessages();
  };

  // Handler para eliminar
  const handleConfirmDelete = async () => {
    const success = await handleDeleteGroup(group.id);
    if (success) {
      setShowDeleteConfirmation(false);
      // El hook se encargará de la redirección
    }
  };

  // Estados de carga y error
  if (groupLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-500">Cargando detalles del grupo...</span>
      </div>
    );
  }

  if (groupError) {
    return (
      <div className="max-w-5xl mx-auto my-8 p-4">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-600 font-medium">Error al cargar el grupo</p>
          <p className="text-red-500 text-sm mt-1">{groupError}</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-5xl mx-auto my-8 p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800">No se encontró el grupo solicitado.</p>
        </div>
      </div>
    );
  }

  // Determinar si el usuario puede editar/eliminar
  const canEditGroup = isAdmin || canModerateContent();

  return (
    <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
      {/* Header con icono numeral y nombre */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-gray-300 rounded px-2 py-2 min-h-[40px] flex-1">
          <FaHashtag className="text-3xl text-gray-700" />
          <h1 className="text-3xl font-bold">{group.name}</h1>
        </div>
        
        {/* ✅ Botones de administración (solo para admin/moderadores) */}
        {canEditGroup && (
          <div className="flex gap-2 ml-4">
            <button
              className="bg-blue text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              onClick={handleEditClick}
              title="Editar grupo"
            >
              <FaEdit />
              <span className="hidden sm:inline">Editar</span>
            </button>
            
            <button
              className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
              onClick={() => setShowDeleteConfirmation(true)}
              title="Eliminar grupo"
            >
              <FaTrash />
              <span className="hidden sm:inline">Eliminar</span>
            </button>
          </div>
        )}
      </div>

      {/* Mensaje de bienvenida */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold">
          ¡Te damos la bienvenida a{" "}
          <span className="text-primary"># {group.name}!</span>
        </h2>
        <p className="text-lg font-bold mt-2">
          Un espacio para aprender, compartir experiencias sobre hidroponía.
        </p>
      </div>

      {/* Descripción y fecha */}
      <div className="mb-6">
        <div className="text-gray-700 mb-1">
          <strong>Descripción:</strong> {group.description || 'Sin descripción'}
        </div>
        <div className="text-gray-500 text-sm">
          <strong>Fecha de creación:</strong>{" "}
          {group.creationDate
            ? new Date(group.creationDate).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Sin fecha"}
        </div>
      </div>

      {/* ✅ Mensajes de estado (solo cuando no hay modales abiertos) */}
      {!showEditModal && (successMessage || formErrors?.general) && (
        <div className="mb-6">
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
              <p className="text-green-600 font-medium">{successMessage}</p>
            </div>
          )}
          {formErrors?.general && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 font-medium">{formErrors.general}</p>
            </div>
          )}
        </div>
      )}

      {/* Botones de acción para usuarios */}
      <div className="mb-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
        <button
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
          onClick={() => handleJoinGroup(group.id)}
        >
          Unirse al grupo
        </button>

        <button
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={() => setShowThreadModal(true)}
        >
          <FaPlus />
          <span>Crear hilo</span>
        </button>
      </div>

      {/* Lista de hilos del grupo */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Hilos del grupo</h2>
        <ThreadList groupId={stableGroupId} />
      </div>

      {/* ✅ Modal para crear hilo */}
      {showThreadModal && (
        <ThreadFormModal
          groupId={group.id}
          onClose={() => setShowThreadModal(false)}
          onThreadCreated={() => setShowThreadModal(false)}
        />
      )}

      {/* ✅ Modal para editar grupo */}
      {showEditModal && (
        <GroupEditModal
          group={group}
          formData={formData}
          formErrors={formErrors}
          successMessage={successMessage}
          updateLoading={updateLoading}
          onInputChange={handleChange}
          onSubmit={handleEditSubmit}
          onClose={handleEditClose}
        />
      )}

      {/* ✅ Diálogo de confirmación para eliminar */}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          title="Eliminar grupo"
          message={`¿Estás seguro de que deseas eliminar el grupo "${group.name}"? Esta acción no se puede deshacer y se eliminarán todos los hilos y mensajes asociados.`}
          confirmText="Eliminar grupo"
          cancelText="Cancelar"
          variant="danger"
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
        />
      )}
    </div>
  );
};


// import React, { useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaHashtag, FaPlus, FaTrash } from "react-icons/fa";
// import { ThreadList } from "../ui/ThreadList";
// import { useGroup } from "../hooks/useGroup";
// import { ThreadFormModal } from "../ui/ThreadFormModal";
// import { ConfirmationDialog } from "../ui/ConfirmationDialog";
// import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";

// export const GroupDetailsView = () => {
//   const { groupId } = useParams();
  
//   // Estados locales
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

//   // Hooks
//   const { isAdmin, canModerateContent } = useAuthRoles();
  
//   const {
//     selectedGroup: group,
//     groupLoading,
//     groupError,
//     handleJoinGroup,
//     handleDeleteGroup,
//     successMessage,
//     formErrors,
//   } = useGroup(groupId);

//   // Memoizar el ID del grupo para evitar renders innecesarios
//   const stableGroupId = useMemo(() => group?.id, [group]);

//   // Handlers
//   const handleConfirmDelete = async () => {
//     const success = await handleDeleteGroup(group.id);
//     if (success) {
//       setShowDeleteConfirmation(false);
//       // El hook se encargará de la redirección
//     }
//     // Si hay error, el modal se mantiene abierto para mostrar el error
//   };

//   // Estados de carga y error
//   if (groupLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-[400px]">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//         <span className="ml-3 text-gray-500">Cargando detalles del grupo...</span>
//       </div>
//     );
//   }

//   if (groupError) {
//     return (
//       <div className="max-w-5xl mx-auto my-8 p-4">
//         <div className="bg-red-50 border border-red-200 rounded-md p-4">
//           <p className="text-red-600 font-medium">Error al cargar el grupo</p>
//           <p className="text-red-500 text-sm mt-1">{groupError}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!group) {
//     return (
//       <div className="max-w-5xl mx-auto my-8 p-4">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//           <p className="text-yellow-800">No se encontró el grupo solicitado.</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
//       {/* Header con icono numeral y nombre */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2 bg-gray-300 rounded px-2 py-2 min-h-[40px] flex-1">
//           <FaHashtag className="text-3xl text-gray-700" />
//           <h1 className="text-3xl font-bold">{group.name}</h1>
//         </div>
        
//         {/* ✅ Botón de eliminar (solo para admin/moderadores) */}
//         {(isAdmin || canModerateContent()) && (
//           <button
//             className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
//             onClick={() => setShowDeleteConfirmation(true)}
//             title="Eliminar grupo"
//           >
//             <FaTrash />
//             <span className="hidden sm:inline">Eliminar</span>
//           </button>
//         )}
//       </div>

//       {/* Mensaje de bienvenida */}
//       <div className="mb-6">
//         <h2 className="text-4xl font-bold">
//           ¡Te damos la bienvenida a{" "}
//           <span className="text-primary"># {group.name}!</span>
//         </h2>
//         <p className="text-lg font-bold mt-2">
//           Un espacio para aprender, compartir experiencias sobre hidroponía.
//         </p>
//       </div>

//       {/* Descripción y fecha */}
//       <div className="mb-6">
//         <div className="text-gray-700 mb-1">
//           <strong>Descripción:</strong> {group.description || 'Sin descripción'}
//         </div>
//         <div className="text-gray-500 text-sm">
//           <strong>Fecha de creación:</strong>{" "}
//           {group.creationDate
//             ? new Date(group.creationDate).toLocaleDateString("es-ES", {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })
//             : "Sin fecha"}
//         </div>
//       </div>

//       {/* ✅ Mensajes de estado */}
//       {(successMessage || formErrors?.general) && (
//         <div className="mb-6">
//           {successMessage && (
//             <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-3">
//               <p className="text-green-600 font-medium">{successMessage}</p>
//             </div>
//           )}
//           {formErrors?.general && (
//             <div className="bg-red-50 border border-red-200 rounded-md p-3">
//               <p className="text-red-600 font-medium">{formErrors.general}</p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Botones de acción */}
//       <div className="mb-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
//         <button
//           className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
//           onClick={() => handleJoinGroup(group.id)}
//         >
//           Unirse al grupo
//         </button>

//         <button
//           className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
//           onClick={() => setShowModal(true)}
//         >
//           <FaPlus />
//           <span>Crear hilo</span>
//         </button>
//       </div>

//       {/* Lista de hilos del grupo */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Hilos del grupo</h2>
//         <ThreadList groupId={stableGroupId} />
//       </div>

//       {/* ✅ Modal para crear hilo */}
//       {showModal && (
//         <ThreadFormModal
//           groupId={group.id}
//           onClose={() => setShowModal(false)}
//           onThreadCreated={() => setShowModal(false)}
//         />
//       )}

//       {/* ✅ Diálogo de confirmación para eliminar */}
//       {showDeleteConfirmation && (
//         <ConfirmationDialog
//           title="Eliminar grupo"
//           message={`¿Estás seguro de que deseas eliminar el grupo "${group.name}"? Esta acción no se puede deshacer y se eliminarán todos los hilos y mensajes asociados.`}
//           confirmText="Eliminar grupo"
//           cancelText="Cancelar"
//           variant="danger"
//           onConfirm={handleConfirmDelete}
//           onCancel={() => setShowDeleteConfirmation(false)}
//         />
//       )}
//     </div>
//   );
// };
