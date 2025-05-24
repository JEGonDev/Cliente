import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useThread } from "../hooks/useThread";
import ThreadContentList from "../ui/ThreadContentList";

export const ThreadDetailView = () => {
  const { threadId } = useParams();
  const { fetchThreadById, threads, loading, error } = useThread();

  // Busca el hilo cuando cambia el ID
  useEffect(() => {
    if (threadId) fetchThreadById(threadId);
  }, [threadId]);

  const thread = threads.length > 0 ? threads[0] : null;

  if (loading) return <Spinner />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (!thread) return <Alert type="warning">Hilo no encontrado</Alert>;

  return (
    <div>
      <Card>
        <h2>{thread.title}</h2>
        <p>{thread.content}</p>
        <small>
          Creado el: {new Date(thread.createdAt).toLocaleString()}
        </small>
      </Card>      
    </div>
  );
}