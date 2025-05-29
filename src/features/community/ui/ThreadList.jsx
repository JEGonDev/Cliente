import React, { useEffect, useImperativeHandle } from "react";
import { ThreadCard } from "./ThreadCard";
import { useThread } from "../hooks/useThread";

/**
 * ThreadList corregido - sin dependencias problemáticas
 */
export const ThreadList = ({ 
  groupId, 
  userId, 
  threadId, 
  onThreadsLoaded,
  showCards = true,
  className = "",
  refetchRef
}) => {
  const {
    threads,
    loading,
    error,
    fetchThreadsByGroup,
    fetchAllThreads,
    fetchForumThreads,
    fetchThreadsByUser,
    fetchThreadById,
  } = useThread();

  const reloadThreads = async () => {
    try {
      if (threadId) {
        await fetchThreadById(threadId);
      } else if (groupId) {
        await fetchThreadsByGroup(groupId);
      } else if (userId) {
        await fetchThreadsByUser(userId);
      } else {
        await fetchForumThreads();
      }
    } catch (err) {
      console.error('Error cargando hilos:', err);
    }
  };
  useEffect(() => {
  reloadThreads();
  // eslint-disable-next-line
}, [groupId, userId, threadId]);

  useEffect(() => {
    if (refetchRef) {
      refetchRef.current = reloadThreads;
    }
  }, [refetchRef, groupId, userId, threadId]);

  // ✅ Efecto simplificado sin dependencias de funciones
  // useEffect(() => {
  //   const loadThreads = async () => {
  //     try {
  //       if (threadId) {
  //         await fetchThreadById(threadId);
  //       } else if (groupId) {
  //         await fetchThreadsByGroup(groupId);
  //       } else if (userId) {
  //         await fetchThreadsByUser(userId);
  //       } else {
  //         // Para el foro general (cuando groupId es null)
  //         await fetchForumThreads();
  //       }
  //     } catch (err) {
  //       console.error('Error cargando hilos:', err);
  //     }
  //   };

  //   loadThreads();
    
  //   // ✅ Solo dependencias de valores, NO de funciones
  // }, [groupId, userId, threadId]);

  // ✅ Notificar al padre cuando los hilos cambien
  useEffect(() => {
    if (onThreadsLoaded && threads && !loading) {
      onThreadsLoaded(threads);
    }
  }, [threads, loading, onThreadsLoaded]);

  // Si no queremos mostrar las cards (modo "data-only"), no renderizar nada visual
  if (!showCards) {
    return null;
  }

  // Estados de carga y error
  if (loading) {
    return (
      <div className={`text-center text-gray-500 mt-8 ${className}`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-3"></div>
          Cargando hilos...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center text-red-500 mt-8 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="font-medium">Error al cargar hilos</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <div className={`text-gray-500 text-center mt-8 ${className}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
          <p className="text-lg font-medium">No hay hilos para mostrar</p>
          <p className="text-sm mt-2">
            {groupId ? "Este grupo aún no tiene hilos de discusión." : 
             userId ? "Este usuario no ha creado hilos." :
             "Sé el primero en crear un hilo de discusión."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {threads.map((thread) => (
        <ThreadCard 
          key={thread.id || thread.thread_id} 
          thread={thread} 
        />
      ))}
    </div>
  );
};


// import React, { useEffect } from "react";
// import { ThreadCard } from "./ThreadCard";
// import { useThread } from "../hooks/useThread";

// export const ThreadList = ({ groupId, userId, threadId, onThreadsLoaded }) => {
//   const {
//     threads,
//     loading,
//     error,
//     fetchThreadsByGroup,
//     fetchAllThreads,
//     fetchForumThreads,
//     fetchThreadsByUser,
//     fetchThreadById,
//   } = useThread();

//   useEffect(() => {
//     if (threadId) {
//       fetchThreadById(threadId);
//     } else if (groupId) {
//       fetchThreadsByGroup(groupId);
//     } else if (userId) {
//       fetchThreadsByUser(userId);
//     } else {
//       fetchForumThreads();
//     }
//     // eslint-disable-next-line
//   }, [groupId, userId, threadId]);

  

 


//   if (loading)
//     return <div className="text-center text-gray-500 mt-8">Cargando hilos...</div>;
//   if (error)
//     return <div className="text-center text-red-500 mt-8">{error}</div>;
//   if (!threads || threads.length === 0)
//     return (
//       <div className="text-gray-500 text-center mt-8">
//         No hay hilos para mostrar.
//       </div>
//     );
    

//   return (
//     <div className="space-y-6">
//       {threads.map((thread) => (
//         <ThreadCard key={thread.id} thread={thread} />
//       ))}
//     </div>
//   );
// };


// import React, { useEffect } from "react";
// import { ThreadCard } from "./ThreadCard";
// import { useThread } from "../hooks/useThread";

// /**
//  * Props:
//  * - groupId: para hilos de grupo
//  * - userId: para hilos de usuario
//  * - threadId: para un hilo específico
//  * Si todo vacío, muestra foro general
//  */
// export const ThreadList = ({ groupId, userId, threadId }) => {
//   console.log("ThreadList props:", { groupId, userId, threadId });
//   const {
//     threads,
//     loading,
//     error,
//     fetchThreadsByGroup,
//     fetchAllThreads,
//     fetchForumThreads,
//     fetchThreadsByUser,
//     fetchThreadById,
//   } = useThread();

//   useEffect(() => {
//     if (threadId) {
//       fetchThreadById(threadId);
//     } else if (groupId) {
//       fetchThreadsByGroup(groupId);
//     } else if (userId) {
//       fetchThreadsByUser(userId);
//     } else {
//       fetchForumThreads();
//     }
//     // eslint-disable-next-line
//   }, [groupId, userId, threadId]);

//   if (loading)
//     return <div className="text-center text-gray-500 mt-8">Cargando hilos...</div>;
//   if (error)
//     return <div className="text-center text-red-500 mt-8">{error}</div>;
//   if (!threads || threads.length === 0)
//     return (
//       <div className="text-gray-500 text-center mt-8">
//         No hay hilos para mostrar.
//       </div>
//     );

//   return (
//     <div className="space-y-6">
//       {threads.map((thread) => (
//         <ThreadCard key={thread.id} thread={thread} />
//       ))}
//     </div>
//   );
// };