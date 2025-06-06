import React, { useEffect } from "react";
import { ThreadCard } from "../ui/ThreadCard";
import { useThread } from "../hooks/useThread";

export const AdminThreadsLayout = ({ className = "" }) => {
  const { threads, loading, error, fetchForumThreads } = useThread();

  useEffect(() => {
    fetchForumThreads();
    // Solo se ejecuta una vez al montar
    // eslint-disable-next-line
  }, []);

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
            Sé el primero en crear un hilo de discusión.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
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

      {threads.map((thread) => (
        <ThreadCard key={thread.id || thread.thread_id} thread={thread} />
      ))}
    </div>
  );
};
