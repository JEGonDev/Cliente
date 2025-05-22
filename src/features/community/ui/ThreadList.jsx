import React, { useEffect } from "react";
import { ThreadCard } from "./ThreadCard";
import { useThread } from "../hooks/useThread";

/**
 * Props:
 * - groupId: para hilos de grupo
 * - userId: para hilos de usuario
 * - threadId: para un hilo específico
 * Si todo vacío, muestra foro general
 */
export const ThreadList = ({ groupId, userId, threadId }) => {
  console.log("ThreadList props:", { groupId, userId, threadId });
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

  useEffect(() => {
    if (threadId) {
      fetchThreadById(threadId);
    } else if (groupId) {
      fetchThreadsByGroup(groupId);
    } else if (userId) {
      fetchThreadsByUser(userId);
    } else {
      fetchForumThreads();
    }
    // eslint-disable-next-line
  }, [groupId, userId, threadId]);

  if (loading)
    return <div className="text-center text-gray-500 mt-8">Cargando hilos...</div>;
  if (error)
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  if (!threads || threads.length === 0)
    return (
      <div className="text-gray-500 text-center mt-8">
        No hay hilos para mostrar.
      </div>
    );

  return (
    <div className="space-y-6">
      {threads.map((thread) => (
        <ThreadCard key={thread.id} thread={thread} />
      ))}
    </div>
  );
};