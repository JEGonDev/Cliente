import { useContext } from 'react';
import { ReactionContext } from '../context/ReactionContext';

/**
 * Hook personalizado para manejar la lógica de reacciones.
 * Este hook encapsula:
 * - Estados de carga y errores relacionados con las reacciones.
 * - Handlers para crear y eliminar reacciones.
 */
export const useReactions = () => {
  const { reactions, loading, error, fetchReactions } = useContext(ReactionContext);

  const toggleReaction = async (postId, reactionType) => {
    try {
      // Aquí llamaría a una función que interactúe con la API (communityService)
      await fetchReactions(); // Refrescar después de crear o eliminar la reacción.
    } catch (error) {
      console.error('Error al procesar la reacción:', error);
    }
  };

  return {
    reactions,
    loading,
    error,
    fetchReactions,
    toggleReaction,
  };
};