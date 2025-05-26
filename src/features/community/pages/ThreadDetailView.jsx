import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Hash, ChevronRightIcon } from "lucide-react";
import { AuthContext } from "../../authentication/context/AuthContext";
import { useThread } from "../hooks/useThread";
import { useGroup } from "../hooks/useGroup";
import { Button } from "../../../ui/components/Button";
import { ThreadEditModal } from "../ui/ThreadEditModal";
import { ThreadDeleteDialog } from "../ui/ThreadDeleteDialog";

export const ThreadDetailView = () => {
  const { isAdmin, isModerator } = useContext(AuthContext);
  const { threadId } = useParams();
  const navigate = useNavigate();

  // ✅ CORREGIDO: Usar threads[0] porque el hook retorna threads (array)
  const {
    threads, // ← El hook retorna threads (array)
    loading,
    error,
    fetchThreadById,
    handleUpdateThread,
    handleDeleteThread,
    canUpdateThread,
    canDeleteThread,
    formData,
    handleChange,
    resetForm,
    formErrors,
  } = useThread();

  // ✅ CORREGIDO: Extraer el hilo individual del array
  const thread = threads && threads.length > 0 ? threads[0] : null;

  // Estados locales para modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ CORREGIDO: useEffect sin crear bucle infinito
  useEffect(() => {
    if (threadId) {
      console.log("Cargando hilo con ID:", threadId);
      fetchThreadById(threadId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  // ✅ CORREGIDO: Solo ejecutar useGroup cuando thread existe
  const { selectedGroup, groupLoading, groupError } = useGroup(thread?.groupId);

  // 🔍 DEBUGGING: Verificar que tenemos los datos
  console.log("=== DEBUGGING ThreadDetailView ===");
  console.log("threadId:", threadId);
  console.log("threads (array):", threads);
  console.log("thread (individual):", thread);
  console.log("loading:", loading);
  console.log("error:", error);
  console.log("selectedGroup:", selectedGroup);
  console.log("=====================================");

  // Funciones utilitarias
  const getDefaultAvatar = (userName) => {
    if (!userName)
      return "https://ui-avatars.com/api/?name=U&background=6b7280&color=fff";
    const initials = userName
      .split(" ")
      .map((p) => p?.[0] || "")
      .join("")
      .toUpperCase()
      .substring(0, 2);
    return `https://ui-avatars.com/api/?name=${initials}&background=059669&color=fff&size=128`;
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Fecha no disponible";
    }
  };

  // Handlers para acciones
  const handleEditClick = () => {
    if (thread) {
      handleChange({ target: { name: "title", value: thread.title } });
      handleChange({ target: { name: "content", value: thread.content } });
      handleChange({ target: { name: "groupId", value: thread.groupId } });
      setIsEditModalOpen(true);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const result = await handleUpdateThread(threadId, e);
      if (result) {
        setIsEditModalOpen(false);
        resetForm();
        // ✅ CORREGIDO: Recargar el hilo después de actualizar
        await fetchThreadById(threadId);
      }
    } catch (error) {
      console.error("Error al actualizar hilo:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      const success = await handleDeleteThread(threadId);
      if (success) {
        setIsDeleteDialogOpen(false);
        navigate(-1);
      }
    } catch (error) {
      console.error("Error al eliminar hilo:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    resetForm();
  };

  // ✅ CORREGIDO: Estados de loading jerarquizados
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-gray-600">Cargando hilo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex items-center">
          <div className="text-red-500 mr-3">⚠️</div>
          <div>
            <h3 className="text-red-800 font-medium">
              Error al cargar el hilo
            </h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => fetchThreadById(threadId)}
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
        <div className="flex items-center">
          <div className="text-yellow-500 mr-3">📝</div>
          <div>
            <h3 className="text-yellow-800 font-medium">Hilo no encontrado</h3>
            <p className="text-yellow-700 text-sm mt-1">
              El hilo solicitado no existe o ha sido eliminado.
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  // ✅ CORREGIDO: Loading del grupo se maneja por separado
  if (groupLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="ml-4 text-gray-600">Cargando información del grupo...</p>
      </div>
    );
  }

  if (groupError) {
    console.warn("Error al cargar grupo:", groupError);
    // Continuar renderizando sin información del grupo
  }

  return (
    <>
      <section >
        {/* Header con información del grupo */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-2 bg-gray-300 rounded px-4 py-2 min-h-[40px] w-full md:w-auto md:flex-1">
            <Hash className="text-3xl text-gray-700" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {selectedGroup?.name || thread.groupName || "Grupo desconocido"}
            </h1>
            <ChevronRightIcon className="text-3xl text-gray-700" />
            <h1 className="text-2xl md:text-3xl font-bold">
              {thread.title || "Título del hilo no disponible"}
            </h1>
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-2">
          {/* Botón volver */}
          <div className="mb-6">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>

          {/* Card principal del hilo */}
          <div className="w-full bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Header: Título y grupo */}
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white rounded-t-lg">
              <h1 className="text-2xl font-bold mb-1">{thread.title}</h1>
              {selectedGroup?.name || thread.groupName}
            </div>

            {/* Contenido del hilo */}
            <div className="p-6">
              {/* Info del autor */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={thread.userAvatar || getDefaultAvatar(thread.userName)}
                  alt={`Avatar de ${thread.userName || "Usuario"}`}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getDefaultAvatar(thread.userName);
                  }}
                />
                <div>
                  <div className="font-medium text-base">
                    {thread.userName ||
                      thread.userFirstName ||
                      "Usuario Anónimo"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(thread.createdAt || thread.creationDate)}
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {thread.content}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t pt-4">
                {thread.updatedAt &&
                  thread.updatedAt !==
                    (thread.createdAt || thread.creationDate) && (
                    <span>
                      Última actualización: {formatDate(thread.updatedAt)}
                    </span>
                  )}
              </div>
            </div>

            {/* Acciones de administración */}
            {(canUpdateThread(thread) || canDeleteThread(thread)) &&
              (isAdmin || isModerator) && (
                <div className="flex justify-end gap-2 px-6 pb-6">
                  {canUpdateThread(thread) && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleEditClick}
                    >
                      Editar
                    </Button>
                  )}
                  {canDeleteThread(thread) && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => setIsDeleteDialogOpen(true)}
                    >
                      Eliminar
                    </Button>
                  )}
                </div>
              )}
          </div>

          {/* Modal de edición */}
          <ThreadEditModal
            isOpen={isEditModalOpen}
            isUpdating={isUpdating}
            formData={formData}
            formErrors={formErrors}
            handleChange={handleChange}
            handleSubmit={handleUpdateSubmit}
            handleCancel={handleCancelEdit}
          />

          {/* Modal de confirmación de eliminación */}
          <ThreadDeleteDialog
            isOpen={isDeleteDialogOpen}
            loading={isDeleting}
            threadTitle={thread.title}
            onConfirm={handleDeleteConfirm}
            onCancel={() => setIsDeleteDialogOpen(false)}
          />
        </div>
      </section>
    </>
  );
};

// import React, { useState, useContext, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Hash } from "lucide-react";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { useThread } from "../hooks/useThread";
// import { useGroup } from "../hooks/useGroup";
// import { Button } from "../../../ui/components/Button";
// import { ThreadEditModal } from "../ui/ThreadEditModal";
// import { ThreadDeleteDialog } from "../ui/ThreadDeleteDialog";

// export const ThreadDetailView = () => {
//   const { isAdmin, isModerator } = useContext(AuthContext);
//   const { threadId } = useParams();
//   const navigate = useNavigate();

//   // ✅ CORREGIDO: Destructuring completo del hook useThread
//   const {
//     thread,              // ← Usar thread (singular), no threads[0]
//     loading,
//     error,
//     fetchThreadById,
//     handleUpdateThread,
//     handleDeleteThread,
//     canUpdateThread,
//     canDeleteThread,
//     formData,
//     handleChange,
//     resetForm,
//     formErrors,
//   } = useThread();

//   // Estados locales para modales
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // ✅ CORREGIDO: useEffect sin crear bucle infinito
//   useEffect(() => {
//     if (threadId) {
//       console.log("Cargando hilo con ID:", threadId);
//       fetchThreadById(threadId);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [threadId]);

//   // ✅ CORREGIDO: Solo ejecutar useGroup cuando thread existe
//   const {
//     selectedGroup,
//     groupLoading,
//     groupError
//   } = useGroup(thread?.groupId);

//   console.log("Thread Detail View - thread:", thread);
//   console.log("Thread Detail View - selectedGroup:", selectedGroup);

//   // Funciones utilitarias
//   const getDefaultAvatar = (userName) => {
//     if (!userName)
//       return "https://ui-avatars.com/api/?name=U&background=6b7280&color=fff";
//     const initials = userName
//       .split(" ")
//       .map((p) => p?.[0] || "")
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);
//     return `https://ui-avatars.com/api/?name=${initials}&background=059669&color=fff&size=128`;
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString("es-ES", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "Fecha no disponible";
//     }
//   };

//   // Handlers para acciones
//   const handleEditClick = () => {
//     if (thread) {
//       handleChange({ target: { name: "title", value: thread.title } });
//       handleChange({ target: { name: "content", value: thread.content } });
//       handleChange({ target: { name: "groupId", value: thread.groupId } });
//       setIsEditModalOpen(true);
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);
//     try {
//       const result = await handleUpdateThread(threadId, e);
//       if (result) {
//         setIsEditModalOpen(false);
//         resetForm();
//         // ✅ CORREGIDO: Recargar el hilo después de actualizar
//         await fetchThreadById(threadId);
//       }
//     } catch (error) {
//       console.error("Error al actualizar hilo:", error);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     setIsDeleting(true);
//     try {
//       const success = await handleDeleteThread(threadId);
//       if (success) {
//         setIsDeleteDialogOpen(false);
//         navigate(-1);
//       }
//     } catch (error) {
//       console.error("Error al eliminar hilo:", error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditModalOpen(false);
//     resetForm();
//   };

//   // ✅ CORREGIDO: Estados de loading jerarquizados
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//         <p className="ml-4 text-gray-600">Cargando hilo...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="flex items-center">
//           <div className="text-red-500 mr-3">⚠️</div>
//           <div>
//             <h3 className="text-red-800 font-medium">Error al cargar el hilo</h3>
//             <p className="text-red-700 text-sm mt-1">{error}</p>
//           </div>
//         </div>
//         <div className="mt-4 flex gap-2">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={() => fetchThreadById(threadId)}
//           >
//             Reintentar
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (!thread) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//         <div className="flex items-center">
//           <div className="text-yellow-500 mr-3">📝</div>
//           <div>
//             <h3 className="text-yellow-800 font-medium">Hilo no encontrado</h3>
//             <p className="text-yellow-700 text-sm mt-1">
//               El hilo solicitado no existe o ha sido eliminado.
//             </p>
//           </div>
//         </div>
//         <div className="mt-4">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // ✅ CORREGIDO: Loading del grupo se maneja por separado
//   if (groupLoading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//         <p className="ml-4 text-gray-600">Cargando información del grupo...</p>
//       </div>
//     );
//   }

//   if (groupError) {
//     console.warn("Error al cargar grupo:", groupError);
//     // Continuar renderizando sin información del grupo
//   }

//   return (
//     <>
//       {/* Header con información del grupo */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2 bg-gray-300 rounded px-2 py-2 min-h-[40px] flex-1">
//           <Hash className="text-3xl text-gray-700" />
//           <h1 className="text-3xl font-bold">
//             {selectedGroup?.name || thread.groupName || "Grupo desconocido"}
//           </h1>
//         </div>
//       </div>

//       <div className="max-w-2xl mx-auto p-6">
//         {/* Botón volver */}
//         <div className="mb-6">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//         </div>

//         {/* Card principal del hilo */}
//         <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//           {/* Header: Título y grupo */}
//           <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white rounded-t-lg">
//             <h1 className="text-2xl font-bold mb-1">{thread.title}</h1>
//             {(selectedGroup?.name || thread.groupName) && (
//               <div className="mt-1 text-sm font-medium">
//                 Grupo: {selectedGroup?.name || thread.groupName}
//               </div>
//             )}
//           </div>

//           {/* Contenido del hilo */}
//           <div className="p-6">
//             {/* Info del autor */}
//             <div className="flex items-center space-x-3 mb-4">
//               <img
//                 src={thread.userAvatar || getDefaultAvatar(thread.userName)}
//                 alt={`Avatar de ${thread.userName || "Usuario"}`}
//                 className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = getDefaultAvatar(thread.userName);
//                 }}
//               />
//               <div>
//                 <div className="font-medium text-base">
//                   {thread.userName || thread.userFirstName || "Usuario Anónimo"}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {formatDate(thread.createdAt)}
//                 </div>
//               </div>
//             </div>

//             {/* Contenido */}
//             <div className="prose max-w-none mb-6">
//               <p className="text-gray-700 whitespace-pre-wrap">
//                 {thread.content}
//               </p>
//             </div>

//             {/* Metadata */}
//             <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t pt-4">
//               {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
//                 <span>
//                   Última actualización: {formatDate(thread.updatedAt)}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Acciones de administración */}
//           {(canUpdateThread(thread) || canDeleteThread(thread)) &&
//             (isAdmin || isModerator) && (
//               <div className="flex justify-end gap-2 px-6 pb-6">
//                 {canUpdateThread(thread) && (
//                   <Button variant="primary" size="sm" onClick={handleEditClick}>
//                     Editar
//                   </Button>
//                 )}
//                 {canDeleteThread(thread) && (
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => setIsDeleteDialogOpen(true)}
//                   >
//                     Eliminar
//                   </Button>
//                 )}
//               </div>
//             )}
//         </div>

//         {/* Modal de edición */}
//         <ThreadEditModal
//           isOpen={isEditModalOpen}
//           isUpdating={isUpdating}
//           formData={formData}
//           formErrors={formErrors}
//           handleChange={handleChange}
//           handleSubmit={handleUpdateSubmit}
//           handleCancel={handleCancelEdit}
//         />

//         {/* Modal de confirmación de eliminación */}
//         <ThreadDeleteDialog
//           isOpen={isDeleteDialogOpen}
//           loading={isDeleting}
//           threadTitle={thread.title}
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setIsDeleteDialogOpen(false)}
//         />
//       </div>
//     </>
//   );
// };

// import React, { useState, useContext, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Hash} from "lucide-react";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { useThread } from "../hooks/useThread";
// import { useGroup } from "../hooks/useGroup";
// import { Button } from "../../../ui/components/Button";
// import { ThreadEditModal } from "../ui/ThreadEditModal";
// import { ThreadDeleteDialog } from "../ui/ThreadDeleteDialog";

// export const ThreadDetailView = () => {
//   const { isAdmin, isModerator } = useContext(AuthContext);
//   const { threadId } = useParams();
//   const navigate = useNavigate();
//   console.log("Thread Detail View - threadId:", threadId);

//   const {
//     fetchThreadById,
//     threads,
//     loading,
//     error,
//     handleUpdateThread,
//     handleDeleteThread,
//     canUpdateThread,
//     canDeleteThread,
//     formData,
//     handleChange,
//     resetForm,
//     formErrors,
//   } = useThread();

//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   useEffect(() => {
//     if (threadId)fetchThreadById(threadId);
//     // eslint-disable-next-line
//   }, [threadId]);
//   console.log("Thread Detail View - threads:", threads);

//   const thread = threads?.[0] || null;
//   console.log("Thread Detail View - thread:", thread);
//    const { selectedGroup, groupLoading, groupError } = useGroup(thread.groupId);

//   if (groupLoading) return <p>Cargando grupo...</p>;
//   if (groupError) return <p>Error al cargar grupo: {groupError}</p>;
//   if (!selectedGroup) return <p>Grupo no encontrado</p>;

//   console.log("Thread Detail View - thread:", thread);

//   const getDefaultAvatar = (userName) => {
//     if (!userName)
//       return "https://ui-avatars.com/api/?name=U&background=6b7280&color=fff";
//     const initials = userName
//       .split(" ")
//       .map((p) => p?.[0] || "")
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);
//     return `https://ui-avatars.com/api/?name=${initials}&background=059669&color=fff&size=128`;
//   };

//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString("es-ES", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     } catch {
//       return "Fecha no disponible";
//     }
//   };

//   const handleEditClick = () => {
//     if (thread) {
//       handleChange({ target: { name: "title", value: thread.title } });
//       handleChange({ target: { name: "content", value: thread.content } });
//       handleChange({ target: { name: "groupId", value: thread.groupId } });
//       setIsEditModalOpen(true);
//     }
//   };

//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);
//     try {
//       const result = await handleUpdateThread(threadId, e);
//       if (result) {
//         setIsEditModalOpen(false);
//         resetForm();
//         await fetchThreadById(threadId);
//       }
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   const handleDeleteConfirm = async () => {
//     setIsDeleting(true);
//     try {
//       const success = await handleDeleteThread(threadId);
//       if (success) {
//         setIsDeleteDialogOpen(false);
//         navigate(-1);
//       }
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleCancelEdit = () => {
//     setIsEditModalOpen(false);
//     resetForm();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="flex items-center">
//           <div className="text-red-500 mr-3">⚠️</div>
//           <div>
//             <h3 className="text-red-800 font-medium">
//               Error al cargar el hilo
//             </h3>
//             <p className="text-red-700 text-sm mt-1">{error}</p>
//           </div>
//         </div>
//         <div className="mt-4 flex gap-2">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={() => fetchThreadById(threadId)}
//           >
//             Reintentar
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (!thread) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//         <div className="flex items-center">
//           <div className="text-yellow-500 mr-3">📝</div>
//           <div>
//             <h3 className="text-yellow-800 font-medium">Hilo no encontrado</h3>
//             <p className="text-yellow-700 text-sm mt-1">
//               El hilo solicitado no existe o ha sido eliminado.
//             </p>
//           </div>
//         </div>
//         <div className="mt-4">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-2 bg-gray-300 rounded px-2 py-2 min-h-[40px] flex-1">
//           <Hash className="text-3xl text-gray-700" />
//           <h1 className="text-3xl font-bold">{selectedGroup.name}</h1>
//         </div>
//       </div>

//       <div className="max-w-2xl mx-auto p-6">
//         <div className="mb-6">
//           <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//         </div>
//         <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//           {/* Header: Título y grupo */}
//           <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white rounded-t-lg">
//             <h1 className="text-2xl font-bold mb-1">{thread.title}</h1>
//             {thread.groupName && (
//               <div className="mt-1 text-sm font-medium">
//                 Grupo: {thread.groupName}
//               </div>
//             )}
//           </div>
//           {/* Detalles */}
//           <div className="p-6">
//             <div className="flex items-center space-x-3 mb-4">
//               <img
//                 src={thread.userAvatar || getDefaultAvatar(thread.userName)}
//                 alt={`Avatar de ${thread.userName || "Usuario"}`}
//                 className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
//                 onError={(e) => {
//                   e.target.onerror = null;
//                   e.target.src = getDefaultAvatar(thread.userName);
//                 }}
//               />
//               <div>
//                 <div className="font-medium text-base">
//                   {thread.userName || thread.userFirstName || "Usuario Anónimo"}
//                 </div>
//                 <div className="text-sm text-gray-500">
//                   {formatDate(thread.createdAt)}
//                 </div>
//               </div>
//             </div>
//             <div className="prose max-w-none mb-6">
//               <p className="text-gray-700 whitespace-pre-wrap">
//                 {thread.content}
//               </p>
//             </div>
//             <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-t pt-4">
//               {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
//                 <span>
//                   Última actualización: {formatDate(thread.updatedAt)}
//                 </span>
//               )}
//             </div>
//           </div>
//           {/* Acciones admin/moderador */}
//           {(canUpdateThread(thread) || canDeleteThread(thread)) &&
//             (isAdmin || isModerator) && (
//               <div className="flex justify-end gap-2 px-6 pb-6">
//                 {canUpdateThread(thread) && (
//                   <Button variant="primary" size="sm" onClick={handleEditClick}>
//                     Editar
//                   </Button>
//                 )}
//                 {canDeleteThread(thread) && (
//                   <Button
//                     variant="danger"
//                     size="sm"
//                     onClick={() => setIsDeleteDialogOpen(true)}
//                   >
//                     Eliminar
//                   </Button>
//                 )}
//               </div>
//             )}
//         </div>
//         {/* Modal de edición */}
//         <ThreadEditModal
//           isOpen={isEditModalOpen}
//           isUpdating={isUpdating}
//           formData={formData}
//           formErrors={formErrors}
//           handleChange={handleChange}
//           handleSubmit={handleUpdateSubmit}
//           handleCancel={handleCancelEdit}
//         />
//         {/* Modal de confirmación de eliminación */}
//         <ThreadDeleteDialog
//           isOpen={isDeleteDialogOpen}
//           loading={isDeleting}
//           threadTitle={thread.title}
//           onConfirm={handleDeleteConfirm}
//           onCancel={() => setIsDeleteDialogOpen(false)}
//         />
//       </div>
//     </>
//   );
// };

// import React, { useState, useContext, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Edit,
//   Trash2,
//   Calendar,
//   User,
//   ArrowLeft,
//   MoreVertical,
//   Save,
//   X
// } from "lucide-react";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { useThread } from "../hooks/useThread";
// import { Modal } from "../../../ui/components/Modal";
// import { Button } from "../../../ui/components/Button";
// import DivInput from "../../../ui/components/DivInput";

// /**
//  * Componente para mostrar los detalles completos de un hilo específico
//  * Incluye información del autor, contenido, y opciones de edición/eliminación
//  */
// export const ThreadDetailView = () => {
//   const { user } = useContext(AuthContext);
//   const { threadId } = useParams();
//   const navigate = useNavigate();

//   // Estados del hook de hilos
//   const {
//     fetchThreadById,
//     threads,
//     loading,
//     error,
//     successMessage,
//     handleUpdateThread,
//     handleDeleteThread,
//     canUpdateThread,
//     canDeleteThread,
//     formData,
//     handleChange,
//     resetForm,
//     formErrors
//   } = useThread();

//   // Estados locales para modales y acciones
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [isDeleting, setIsDeleting] = useState(false);

//   // Cargar hilo cuando se monta el componente o cambia el ID
//   useEffect(() => {
//     if (threadId) {
//       fetchThreadById(threadId);
//     }
//   }, [threadId]);

//   // Obtener el hilo actual (el hook retorna array, tomamos el primero)
//   const thread = threads.length > 0 ? threads[0] : null;

//   /**
//    * Genera un avatar por defecto basado en las iniciales del usuario
//    */
//   const getDefaultAvatar = (userName) => {
//     if (!userName) return "https://ui-avatars.com/api/?name=U&background=6b7280&color=fff";

//     const initials = userName
//       .split(' ')
//       .map(part => part?.[0] || '')
//       .join('')
//       .toUpperCase()
//       .substring(0, 2);

//     return `https://ui-avatars.com/api/?name=${initials}&background=059669&color=fff&size=128`;
//   };

//   /**
//    * Formatea la fecha de creación del hilo
//    */
//   const formatDate = (dateString) => {
//     try {
//       return new Date(dateString).toLocaleDateString('es-ES', {
//         year: 'numeric',
//         month: 'long',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     } catch {
//       return 'Fecha no disponible';
//     }
//   };

//   /**
//    * Abre el modal de edición y carga los datos del hilo
//    */
//   const handleEditClick = () => {
//     if (thread) {
//       // Cargar datos del hilo en el formulario
//       handleChange({ target: { name: 'title', value: thread.title } });
//       handleChange({ target: { name: 'content', value: thread.content } });
//       handleChange({ target: { name: 'groupId', value: thread.groupId } });
//       setIsEditModalOpen(true);
//     }
//     setIsMenuOpen(false);
//   };

//   /**
//    * Maneja la actualización del hilo
//    */
//   const handleUpdateSubmit = async (e) => {
//     e.preventDefault();
//     setIsUpdating(true);

//     try {
//       const result = await handleUpdateThread(threadId, e);
//       if (result) {
//         setIsEditModalOpen(false);
//         resetForm();
//         // Recargar el hilo actualizado
//         await fetchThreadById(threadId);
//       }
//     } catch (error) {
//       console.error('Error al actualizar hilo:', error);
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   /**
//    * Maneja la eliminación del hilo
//    */
//   const handleDeleteConfirm = async () => {
//     setIsDeleting(true);

//     try {
//       const success = await handleDeleteThread(threadId);
//       if (success) {
//         setIsDeleteModalOpen(false);
//         // Redirigir a la lista de hilos o página anterior
//         navigate(-1);
//       }
//     } catch (error) {
//       console.error('Error al eliminar hilo:', error);
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   /**
//    * Cierra el modal de edición y resetea el formulario
//    */
//   const handleCancelEdit = () => {
//     setIsEditModalOpen(false);
//     resetForm();
//   };

//   // Estados de carga
//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   // Estados de error
//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-md p-4">
//         <div className="flex items-center">
//           <div className="text-red-500 mr-3">⚠️</div>
//           <div>
//             <h3 className="text-red-800 font-medium">Error al cargar el hilo</h3>
//             <p className="text-red-700 text-sm mt-1">{error}</p>
//           </div>
//         </div>
//         <div className="mt-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => navigate(-1)}
//             className="mr-2"
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={() => fetchThreadById(threadId)}
//           >
//             Reintentar
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   // Estado cuando no se encuentra el hilo
//   if (!thread) {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
//         <div className="flex items-center">
//           <div className="text-yellow-500 mr-3">📝</div>
//           <div>
//             <h3 className="text-yellow-800 font-medium">Hilo no encontrado</h3>
//             <p className="text-yellow-700 text-sm mt-1">
//               El hilo solicitado no existe o ha sido eliminado.
//             </p>
//           </div>
//         </div>
//         <div className="mt-4">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => navigate(-1)}
//           >
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Volver
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Mensaje de éxito */}
//       {successMessage && (
//         <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
//           <p className="text-green-800">{successMessage}</p>
//         </div>
//       )}

//       {/* Botón de volver */}
//       <div className="mb-6">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={() => navigate(-1)}
//         >
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Volver
//         </Button>
//       </div>

//       {/* Card principal del hilo */}
//       <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
//         {/* Header del hilo */}
//         <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
//           <div className="flex items-start justify-between">
//             <div className="flex-1">
//               <h1 className="text-2xl font-bold mb-2 leading-tight">
//                 {thread.title}
//               </h1>

//               {/* Información del autor */}
//               <div className="flex items-center space-x-3">
//                 <img
//                   src={thread.userAvatar || getDefaultAvatar(thread.userName)}
//                   alt={`Avatar de ${thread.userName || 'Usuario'}`}
//                   className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = getDefaultAvatar(thread.userName);
//                   }}
//                 />
//                 <div>
//                   <div className="flex items-center space-x-2">
//                     <User className="w-4 h-4" />
//                     <span className="font-medium">
//                       {thread.userName || thread.userFirstName || 'Usuario Anónimo'}
//                     </span>
//                   </div>
//                   <div className="flex items-center space-x-2 text-sm opacity-90">
//                     <Calendar className="w-3 h-3" />
//                     <span>{formatDate(thread.createdAt)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Menú de acciones */}
//             {(canUpdateThread(thread) || canDeleteThread(thread)) && (
//               <div className="relative">
//                 <Button
//                   variant="white"
//                   size="sm"
//                   onClick={() => setIsMenuOpen(!isMenuOpen)}
//                   className="ml-4"
//                 >
//                   <MoreVertical className="w-4 h-4" />
//                 </Button>

//                 {isMenuOpen && (
//                   <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
//                     {canUpdateThread(thread) && (
//                       <button
//                         onClick={handleEditClick}
//                         className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                       >
//                         <Edit className="w-4 h-4 mr-2" />
//                         Editar
//                       </button>
//                     )}
//                     {canDeleteThread(thread) && (
//                       <button
//                         onClick={() => {
//                           setIsDeleteModalOpen(true);
//                           setIsMenuOpen(false);
//                         }}
//                         className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
//                       >
//                         <Trash2 className="w-4 h-4 mr-2" />
//                         Eliminar
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Contenido del hilo */}
//         <div className="p-6">
//           <div className="prose max-w-none">
//             <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
//               {thread.content}
//             </p>
//           </div>

//           {/* Metadatos adicionales */}
//           <div className="mt-6 pt-4 border-t border-gray-200">
//             <div className="flex flex-wrap gap-4 text-sm text-gray-500">
//               {thread.groupName && (
//                 <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800">
//                   Grupo: {thread.groupName}
//                 </span>
//               )}
//               {thread.updatedAt && thread.updatedAt !== thread.createdAt && (
//                 <span>
//                   Última actualización: {formatDate(thread.updatedAt)}
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal de edición */}
//       <Modal
//         isOpen={isEditModalOpen}
//         onClose={handleCancelEdit}
//         title="Editar Hilo"
//         size="lg"
//       >
//         <form onSubmit={handleUpdateSubmit} className="space-y-4">
//           {/* Campo de título */}
//           <div>
//             <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
//               Título *
//             </label>
//             <DivInput
//               name="title"
//               type="text"
//               value={formData.title}
//               placeholder="Título del hilo"
//               required
//               handleChange={handleChange}
//               className={formErrors.title ? 'border-red-300' : ''}
//             />
//             {formErrors.title && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
//             )}
//           </div>

//           {/* Campo de contenido */}
//           <div>
//             <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
//               Contenido *
//             </label>
//             <textarea
//               name="content"
//               value={formData.content}
//               onChange={handleChange}
//               placeholder="Contenido del hilo..."
//               required
//               rows={6}
//               className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-primary focus:border-primary resize-vertical ${
//                 formErrors.content ? 'border-red-300' : 'border-gray-300'
//               }`}
//             />
//             {formErrors.content && (
//               <p className="text-red-500 text-xs mt-1">{formErrors.content}</p>
//             )}
//           </div>

//           {/* Errores generales */}
//           {formErrors.general && (
//             <div className="bg-red-50 border border-red-200 rounded-md p-3">
//               <p className="text-red-800 text-sm">{formErrors.general}</p>
//             </div>
//           )}

//           {/* Botones del modal */}
//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={handleCancelEdit}
//               disabled={isUpdating}
//             >
//               <X className="w-4 h-4 mr-2" />
//               Cancelar
//             </Button>
//             <Button
//               type="submit"
//               variant="primary"
//               disabled={isUpdating}
//             >
//               {isUpdating ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                   Guardando...
//                 </div>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4 mr-2" />
//                   Guardar Cambios
//                 </>
//               )}
//             </Button>
//           </div>
//         </form>
//       </Modal>

//       {/* Modal de confirmación de eliminación */}
//       <Modal
//         isOpen={isDeleteModalOpen}
//         onClose={() => setIsDeleteModalOpen(false)}
//         title="Confirmar Eliminación"
//         size="md"
//       >
//         <div className="space-y-4">
//           <div className="flex items-center space-x-3">
//             <div className="flex-shrink-0">
//               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                 <Trash2 className="w-5 h-5 text-red-600" />
//               </div>
//             </div>
//             <div>
//               <h3 className="text-lg font-medium text-gray-900">
//                 ¿Eliminar este hilo?
//               </h3>
//               <p className="text-sm text-gray-500 mt-1">
//                 Esta acción no se puede deshacer. El hilo "{thread.title}" será eliminado permanentemente.
//               </p>
//             </div>
//           </div>

//           <div className="flex justify-end space-x-3 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setIsDeleteModalOpen(false)}
//               disabled={isDeleting}
//             >
//               Cancelar
//             </Button>
//             <Button
//               type="button"
//               variant="danger"
//               onClick={handleDeleteConfirm}
//               disabled={isDeleting}
//             >
//               {isDeleting ? (
//                 <div className="flex items-center">
//                   <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                   Eliminando...
//                 </div>
//               ) : (
//                 <>
//                   <Trash2 className="w-4 h-4 mr-2" />
//                   Eliminar
//                 </>
//               )}
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// import React, { useState, useContext, useCallback, useEffect } from "react";
// import { AuthContext } from "../../authentication/context/AuthContext";
// import { useParams } from "react-router-dom";
// import { useThread } from "../hooks/useThread";

// export const ThreadDetailView = () => {
//   const { user } = useContext(AuthContext);
//   const userId = user?.id || user?.userId;
//   const { threadId } = useParams();
//   const { fetchThreadById, threads, loading, error, successMessage } = useThread();

//   // ✅ Estados para controlar la carga manual
//   const [hasLoadedInitial, setHasLoadedInitial] = useState(false);
//   const [lastUserId, setLastUserId] = useState(null);

//   // Busca el hilo cuando cambia el ID
//   useEffect(() => {
//     if (threadId) fetchThreadById(threadId);
//   }, [threadId]);

//   const thread = threads.length > 0 ? threads[0] : null;

//   if (loading) return <Spinner />;
//   if (error) return <Alert type="error">{error}</Alert>;
//   if (!thread) return <Alert type="warning">Hilo no encontrado</Alert>;

//   return (
//     <div>
//       <Card>
//         <h2>{thread.title}</h2>
//         <p>{thread.content}</p>
//         <small>Creado el: {new Date(thread.createdAt).toLocaleString()}</small>
//       </Card>
//     </div>
//   );
// };
