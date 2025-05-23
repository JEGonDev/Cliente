import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { FaHashtag, FaPlus, FaTrash } from "react-icons/fa";
import { ThreadList } from "../ui/ThreadList";
import { useGroup } from "../hooks/useGroup";
import { ThreadFormModal } from "../ui/ThreadFormModal";
import { ConfirmationDialog } from "../ui/ConfirmationDialog";
import { useAuthRoles } from "../../authentication/hooks/useAuthRoles";

export const GroupDetailsView = () => {
  const { groupId } = useParams();
  
  // Estados locales
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  // Hooks
  const { isAdmin, canModerateContent } = useAuthRoles();
  
  const {
    selectedGroup: group,
    groupLoading,
    groupError,
    handleJoinGroup,
    handleDeleteGroup,
    successMessage,
    formErrors,
  } = useGroup(groupId);

  // Memoizar el ID del grupo para evitar renders innecesarios
  const stableGroupId = useMemo(() => group?.id, [group]);

  // Handlers
  const handleConfirmDelete = async () => {
    const success = await handleDeleteGroup(group.id);
    if (success) {
      setShowDeleteConfirmation(false);
      // El hook se encargará de la redirección
    }
    // Si hay error, el modal se mantiene abierto para mostrar el error
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

  return (
    <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
      {/* Header con icono numeral y nombre */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-gray-300 rounded px-2 py-2 min-h-[40px] flex-1">
          <FaHashtag className="text-3xl text-gray-700" />
          <h1 className="text-3xl font-bold">{group.name}</h1>
        </div>
        
        {/* ✅ Botón de eliminar (solo para admin/moderadores) */}
        {(isAdmin || canModerateContent()) && (
          <button
            className="ml-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center gap-2"
            onClick={() => setShowDeleteConfirmation(true)}
            title="Eliminar grupo"
          >
            <FaTrash />
            <span className="hidden sm:inline">Eliminar</span>
          </button>
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

      {/* ✅ Mensajes de estado */}
      {(successMessage || formErrors?.general) && (
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

      {/* Botones de acción */}
      <div className="mb-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
        <button
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
          onClick={() => handleJoinGroup(group.id)}
        >
          Unirse al grupo
        </button>

        <button
          className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center gap-2"
          onClick={() => setShowModal(true)}
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
      {showModal && (
        <ThreadFormModal
          groupId={group.id}
          onClose={() => setShowModal(false)}
          onThreadCreated={() => setShowModal(false)}
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

// import React, { useState, useCallback } from "react";
// import { useParams } from "react-router-dom";
// import { FaHashtag, FaPlus } from "react-icons/fa";
// import { ThreadList } from "../ui/ThreadList";
// import { useGroup } from "../hooks/useGroup";
// import { ThreadFormModal } from "../ui/ThreadFormModal";
// import { ConfirmationDialog } from "../ui/ConfirmationDialog";

// /**
//  * Vista optimizada para mostrar detalles de un grupo específico.
//  * Previene renders innecesarios y ciclos infinitos.
//  */
// export const GroupDetailsView = () => {
//   const { groupId } = useParams();
//   const [showModal, setShowModal] = useState(false);
//   const [ showComfirm, setShowComfirm ] = useState(false);

//   // ✅ Hook optimizado
//   const {
//     selectedGroup: group,
//     groupLoading,
//     groupError,
//     handleJoinGroup,
//     successMessage,
//     formErrors,
//   } = useGroup(groupId);

//   // ✅ Callbacks memoizados
//   const handleShowModal = useCallback(() => setShowModal(true), []);
//   const handleCloseModal = useCallback(() => setShowModal(false), []);
  
//   const handleThreadCreated = useCallback(() => {
//     setShowModal(false);
//     // Aquí podrías agregar lógica adicional si es necesario
//   }, []);

//   const handleJoinClick = useCallback(() => {
//     if (group?.id) {
//       handleJoinGroup(group.id);
//     }
//   }, [group?.id, handleJoinGroup]);

//   // ✅ Estados de carga y error
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
//       {/* ✅ Header optimizado */}
//       <header className="flex items-center gap-2 mb-6 bg-gray-300 rounded px-2 py-2 min-h-[40px]">
//         <FaHashtag className="text-3xl text-gray-700" aria-hidden="true" />
//         <h1 className="text-3xl font-bold">{group.name}</h1>
//       </header>

//       {/* ✅ Mensaje de bienvenida */}
//       <section className="mb-6">
//         <h2 className="text-4xl font-bold">
//           ¡Te damos la bienvenida a{" "}
//           <span className="text-primary"># {group.name}!</span>
//         </h2>
//         <p className="text-lg font-bold mt-2">
//           Un espacio para aprender, compartir experiencias sobre hidroponía.
//         </p>
//       </section>

//       {/* ✅ Información del grupo */}
//       <section className="mb-6">
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
//       </section>

//       {/* ✅ Mensajes de estado */}
//       {(successMessage || formErrors?.general) && (
//         <section className="mb-6">
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
//         </section>
//       )}

//       {/* ✅ Acciones del grupo */}
//       <section className="mb-8 space-y-4">
//         <button
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200"
//           onClick={handleJoinClick}
//           disabled={groupLoading}
//         >
//           Unirse al grupo
//         </button>

//         <button
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
//           onClick={handleShowModal}
//         >
//           <FaPlus aria-hidden="true" />
//           <span>Crear hilo</span>
//         </button>
//       </section>

//       {/* ✅ Lista de hilos */}
//       <section className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Hilos del grupo</h2>
//         <ThreadList groupId={group.id} />
//       </section>

//       {/* ✅ Modal condicional */}
//       {showModal && (
//         <ThreadFormModal
//           groupId={group.id}
//           onClose={handleCloseModal}
//           onThreadCreated={handleThreadCreated}
//         />
//       )}
//     </div>
//   );
// };
// import React, { useEffect, useState, useCallback, useMemo } from "react";
// import { useParams } from "react-router-dom";
// import { FaHashtag } from "react-icons/fa";
// import { communityService } from "../services/communityService";
// import { ThreadList } from "../ui/ThreadList";
// import { useGroup } from "../hooks/useGroup";
// import { useThread } from "../hooks/useThread";
// import { FaPlus, FaSearch, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { ThreadFormModal } from "../ui/ThreadFormModal";



// export const GroupDetailsView = () => {
//   const { groupId } = useParams();
//   const [group, setGroup] = useState(null);
//   const stableGroupId = useMemo(() => group?.id, [group]);
//   const { handleJoinGroup, successMessage, formErrors } = useGroup();
//   const { threads, loading: threadsLoading, error: threadsError } = useThread(stableGroupId);
//   const [showModal, setShowModal] = useState(false);

//   // const handleThreadsLoaded = useCallback((threads) => {
//   //   if (Array.isArray(threads) && threads.length > 0) {
//   //     setAllThreads(threads);
//   //   } else {
//   //     setAllThreads(exampleThreads); // fallback si la API falla o retorna vacío
//   //   }
//   // }, []);

  

//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       try {
//         const data = await communityService.getGroupById(groupId);
//         setGroup(data.data); // Ajusta según la respuesta real de tu API
//       } catch (error) {
//         setGroup(null);
//       }
//     };
//     fetchGroupDetails();
//   }, [groupId]);

//   if (!group)
//     return <p className="text-gray-500">Cargando detalles del grupo...</p>;

  

//   return (
//     <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
//       {/* Header con icono numeral y nombre */}
//       <div className="flex items-center gap-2 mb-6 bg-gray-300 rounded px-2 py-2 sm:py-2 md:py-2 min-h-[40px] sm:min-h-[60px] md:min-h-[80px]">
//         <FaHashtag className="text-3xl text-gray-700" />
//         <h1 className="text-3xl font-bold">{group.name}</h1>
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
//           <strong>Descripción:</strong> {group.description}
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

//       {/* Botón para unirse */}
//       <div className="mb-8">
//         <button
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//           onClick={() => handleJoinGroup(group.id)}
//         >
//           Unirse al grupo
//         </button>
//         {successMessage && <p className="text-green-600">{successMessage}</p>}
//         {formErrors.general && (
//           <p className="text-red-600">{formErrors.general}</p>
//         )}
//       </div>

//       {/* Botón para crear hilo */}
//       <div className="mb-8">
//         <button
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//           onClick={() => setShowModal(true)}
//         >
//           <FaPlus /> Crear hilo
//         </button>
//         {successMessage && <p className="text-green-600">{successMessage}</p>}
//         {formErrors.general && (
//           <p className="text-red-600">{formErrors.general}</p>
//         )}
//       </div>

//       {/* Lista de hilos del grupo */}
//       <div className="mt-10">
//         <h2 className="text-2xl font-bold mb-4">Hilos del grupo</h2>
//         {/* Muestra loading o error si aplica */}
//         {threadsLoading && <p>Cargando hilos...</p>}
//         {threadsError && <p className="text-red-600">{threadsError}</p>}
//         {/* Pasa threads al ThreadList */}
//         <ThreadList groupId={stableGroupId}  />
//       </div>

//       {showModal && (
//         <ThreadFormModal
//           groupId={group.id}
//           onClose={() => setShowModal(false)}
//           onThreadCreated={() => setShowModal(false)}
//         />
//       )}
//     </div>
//   );
// };

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { FaHashtag } from "react-icons/fa";
// import { communityService } from "../services/communityService";
// import { ThreadList } from "../ui/ThreadList";
// import { useGroup } from "../hooks/useGroup";
// import { useThread } from "../hooks/useThread";

// export const GroupDetailsView = () => {
//   const { groupId } = useParams();
//   const [group, setGroup] = useState(null);
//   const { handleJoinGroup, successMessage, formErrors } = useGroup();
//   //  hook obtener hilos grupo
//   const { threads, loading, error, fetchThreadsByGroup } = useThread();

//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       try {
//         const data = await communityService.getGroupById(groupId);
//         setGroup(data.data); // Ajusta según la respuesta real de tu API
//       } catch (error) {
//         setGroup(null);
//       }
//     };
//     fetchGroupDetails();
//   }, [groupId]);

//   // Carga los hilos del grupo cada vez que el groupId cambie
//   useEffect(() => {
//     if (groupId) {
//       fetchThreadsByGroup(groupId);
//     }
//   }, [groupId]);

//   if (!group)
//     return <p className="text-gray-500">Cargando detalles del grupo...</p>;

//   return (
//     <div className="max-w-5xl mx-auto my-8 p-4 bg-white rounded shadow">
//       {/* Header con icono numeral y nombre */}
//       <div className="flex items-center gap-2 mb-6 bg-gray-300 rounded px-2 py-2 sm:py-2 md:py-2 min-h-[40px] sm:min-h-[60px] md:min-h-[80px]">
//         <FaHashtag className="text-3xl text-gray-700" />
//         <h1 className="text-3xl font-bold">{group.name}</h1>
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
//           <strong>Descripción:</strong> {group.description}
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

//       {/* Botón para unirse */}
//       <div className="mb-8">
//         <button
//           className="bg-primary text-white px-4 py-2 rounded-md hover:bg-green-600"
//           onClick={() => handleJoinGroup(group.id)}
//         >
//           Unirse al grupo
//         </button>
//         {successMessage && <p className="text-green-600">{successMessage}</p>}
//         {formErrors.general && (
//           <p className="text-red-600">{formErrors.general}</p>
//         )}
//       </div>

//       {/* Sección de hilos */}
//       <div>
//         {loading ? (
//           <p className="text-gray-500">Cargando hilos...</p>
//         ) : error ? (
//           <p className="text-red-500">{error}</p>
//         ) : (
//           <ThreadList threads={threads} />
//         )}
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { communityService } from "../services/communityService";

// export const GroupDetailsView = () => {
//   const { groupId } = useParams();
//   const [group, setGroup] = useState(null);
//   const [threadsCount, setThreadsCount] = useState(0);
//   const [postsCount, setPostsCount] = useState(0);

//   useEffect(() => {
//     const fetchGroupDetails = async () => {
//       try {
//         const data = await communityService.getGroupById(groupId);
//         console.log("Detalle del grupo recibido de la API:", data);
//         setGroup(data.data); // <-- ¡AQUÍ ESTÁ LA CLAVE!
//         // Si tienes los métodos para threads/posts, agrégalos aquí:
//         // const threadsRes = await communityService.getThreadsByGroupId(groupId);
//         // setThreadsCount(Array.isArray(threadsRes.data) ? threadsRes.data.length : 0);
//         // const postsRes = await communityService.getPostsByGroupId(groupId);
//         // setPostsCount(Array.isArray(postsRes.data) ? postsRes.data.length : 0);
//       } catch (error) {
//         setGroup(null);
//       }
//     };

//     fetchGroupDetails();
//   }, [groupId]);

//   if (!group)
//     return <p className="text-gray-500">Cargando detalles del grupo...</p>;

//   return (
//     <div className="p-4 max-w-xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-2">{group.name}</h2>
//       <p className="text-gray-600 mb-2">{group.description}</p>
//       <p className="text-sm text-gray-500 mb-2">
//         Fecha de creación:{" "}
//         {group.creationDate
//           ? new Date(group.creationDate).toLocaleDateString()
//           : "Sin fecha"}
//       </p>
//       <div className="flex gap-4 mb-4">
//         <span className="text-sm text-gray-700">
//           Hilos: <strong>{threadsCount}</strong>
//         </span>
//         <span className="text-sm text-gray-700">
//           Posts: <strong>{postsCount}</strong>
//         </span>
//       </div>
//       <div className="flex gap-2 mt-4">
//         <button
//           onClick={() => alert("Crear hilo (implementa aquí la lógica o el modal)")}
//           className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//         >
//           Crear Hilo
//         </button>
//         <button
//           onClick={() => alert("Crear post (implementa aquí la lógica o el modal)")}
//           className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
//         >
//           Crear Post
//         </button>
//       </div>
//     </div>
//   );
// };
