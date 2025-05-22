import { useState } from "react";
import { communityService } from "../services/communityService";

/**
 * Hook para traer y manejar posts y mensajes de un hilo.
 * Junta ambos y los ordena por fecha.
 */
export function useThreadContent() {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchContent = async (threadId) => {
    setLoading(true);
    setError(null);
    try {
      // Llama a ambos endpoints del service (ajusta los nombres si son diferentes)
      const [postsResp, messagesResp] = await Promise.all([
        communityService.getPostsByThreadId(threadId),
        communityService.getMessagesByThreadId(threadId),
      ]);
      // Marca el tipo para la card
      const posts = (postsResp.data || []).map(p => ({ ...p, type: "post" }));
      const messages = (messagesResp.data || []).map(m => ({ ...m, type: "message" }));
      // Junta y ordena por fecha
      const all = [...posts, ...messages].sort((a, b) =>
        new Date(a.createdAt) - new Date(b.createdAt)
      );
      setContentItems(all);
    } catch (e) {
      setError(e.message || "No se pudo cargar el contenido del hilo");
    } finally {
      setLoading(false);
    }
  };

  return { contentItems, loading, error, fetchContent };
}