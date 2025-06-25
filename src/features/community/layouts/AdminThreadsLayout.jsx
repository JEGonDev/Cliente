import React, { useEffect } from "react";
import { ThreadCard } from "../ui/ThreadCard";
import { useThread } from "../hooks/useThread";
import { useNavigate } from "react-router-dom";

/**
 * Vista administrativa de hilos de la comunidad (no solo foro)
 * - Apila los hilos verticalmente
 * - Aplica animación a las cards (asume que ThreadCard tiene animación)
 * - Contenedor fijo (scroll interno)
 * - Permite búsqueda por título o descripción
 * - Muestra todos los hilos llamando fetchAllThreads
 */
export const AdminThreadsLayout = ({ searchTerm = "", className = "" }) => {
  const { threads, loading, error, fetchAllThreads } = useThread();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllThreads();
    // eslint-disable-next-line
  }, []);

  // Filtrar hilos por barra de búsqueda (por título o descripción)
  const filteredThreads = searchTerm
    ? threads.filter(
        (thread) =>
          thread.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          thread.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : threads;

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

  if (!filteredThreads || filteredThreads.length === 0) {
    return (
      <div className={`text-gray-500 text-center mt-8 ${className}`}>
        <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
          <p className="text-lg font-medium">No hay hilos para mostrar</p>
          <p className="text-sm mt-2">
            Sé el primero en crear un hilo de discusión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <div className="bg-gray-100 p-4">
        <h2 className="text-xl font-semibold mb-4">Hilos de la comunidad</h2>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => navigate(`/comunity/ThreadForum`)}
            className="text-secondary underline text-sm"
          >
            Administrar hilos
          </button>
        </div>
      </div>

      {/* Contenedor fijo con scroll interno y hilos apilados verticalmente */}
      <div className="max-h-96 overflow-y-auto flex flex-col gap-4 mt-4">
        {filteredThreads.map((thread) => (
          <ThreadCard key={thread.id || thread.thread_id} thread={thread} />
        ))}
      </div>
    </div>
  );
};


// import React, { useEffect } from "react";
// import { ThreadCard } from "../ui/ThreadCard";
// import { useThread } from "../hooks/useThread";

// export const AdminThreadsLayout = ({ className = "" }) => {
//   const { threads, loading, error, fetchForumThreads } = useThread();

//   useEffect(() => {
//     fetchForumThreads();
//     // Solo se ejecuta una vez al montar
//     // eslint-disable-next-line
//   }, []);

//   if (loading) {
//     return (
//       <div className={`text-center text-gray-500 mt-8 ${className}`}>
//         <div className="flex items-center justify-center">
//           <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary mr-3"></div>
//           Cargando hilos...
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={`text-center text-red-500 mt-8 ${className}`}>
//         <div className="bg-red-50 border border-red-200 rounded-md p-4">
//           <p className="font-medium">Error al cargar hilos</p>
//           <p className="text-sm mt-1">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (!threads || threads.length === 0) {
//     return (
//       <div className={`text-gray-500 text-center mt-8 ${className}`}>
//         <div className="bg-gray-50 border border-gray-200 rounded-md p-8">
//           <p className="text-lg font-medium">No hay hilos para mostrar</p>
//           <p className="text-sm mt-2">
//             Sé el primero en crear un hilo de discusión.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className={`space-y-6 ${className}`}>
//       <div className="bg-gray-100 p-4">
//         <h2 className="text-xl font-semibold mb-4">Hilos de la comunidad</h2>
//         <div className="flex justify-end mt-4">
//           <button
//             onClick={() => navigate(`/comunity/ThreadForum`)}
//             className="text-secondary underline text-sm"
//           >
//             Administrar hilos
//           </button>
//         </div>
//       </div>

//       {threads.map((thread) => (
//         <ThreadCard key={thread.id || thread.thread_id} thread={thread} />
//       ))}
//     </div>
//   );
// };
