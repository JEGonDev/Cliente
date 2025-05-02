import { useState, useContext, useEffect } from 'react';
import { CommunityContext } from '../context/CommunityContext';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica de reacciones
 * 
 * Este hook encapsula:
 * - Estados para gestionar reacciones
 * - Estado de la UI (errores, carga)
 * - Handlers para interacción con reacciones (crear, eliminar)
 * 
 * @returns {Object} Propiedades y métodos para trabajar con reacciones
 */
export const useReaction = () => {
  // Contexto de comunidad
  const { 
    reactions, 
    loadingReactions, 
    reactionError,
    fetchAllReactions,
    createReaction: contextCreateReaction,
    deleteReaction: contextDeleteReaction 
  } = useContext(CommunityContext);
  
  // Contexto de autenticación para obtener el ID del usuario
  const { user } = useContext(AuthContext);
  
  // Estado para agrupar las reacciones por post
  const [reactionsByPost, setReactionsByPost] = useState({});
  
  // Estado para errores
  const [error, setError] = useState(null);
  
  // Al cambiar las reacciones, actualizamos el agrupamiento
  useEffect(() => {
    const grouped = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.postId]) {
        acc[reaction.postId] = {};
      }
      
      if (!acc[reaction.postId][reaction.reactionType]) {
        acc[reaction.postId][reaction.reactionType] = [];
      }
      
      acc[reaction.postId][reaction.reactionType].push(reaction);
      return acc;
    }, {});
    
    setReactionsByPost(grouped);
  }, [reactions]);
  
  /**
   * Obtiene el conteo de reacciones por tipo para un post específico
   * @param {number} postId - ID del post
   * @returns {Object} Objeto con el conteo de cada tipo de reacción
   */
  const getReactionCounts = (postId) => {
    if (!reactionsByPost[postId]) return {};
    
    const counts = {};
    Object.keys(reactionsByPost[postId]).forEach(type => {
      counts[type] = reactionsByPost[postId][type].length;
    });
    
    return counts;
  };
  
  /**
   * Verifica si el usuario actual ya ha reaccionado de cierta manera a un post
   * @param {number} postId - ID del post
   * @param {string} reactionType - Tipo de reacción
   * @returns {boolean} true si ya ha reaccionado, false si no
   */
  const hasUserReacted = (postId, reactionType) => {
    if (!user || !reactionsByPost[postId] || !reactionsByPost[postId][reactionType]) {
      return false;
    }
    
    return reactionsByPost[postId][reactionType].some(r => r.userId === user.id);
  };
  
  /**
   * Encuentra la reacción de un usuario a un post
   * @param {number} postId - ID del post
   * @param {string} reactionType - Tipo de reacción
   * @returns {Object|null} La reacción encontrada o null
   */
  const findUserReaction = (postId, reactionType) => {
    if (!user || !reactionsByPost[postId] || !reactionsByPost[postId][reactionType]) {
      return null;
    }
    
    return reactionsByPost[postId][reactionType].find(r => r.userId === user.id) || null;
  };
  
  /**
   * Maneja la creación o eliminación de una reacción
   * @param {number} postId - ID del post
   * @param {string} reactionType - Tipo de reacción
   */
  const toggleReaction = async (postId, reactionType) => {
    if (!user) {
      setError('Necesitas iniciar sesión para reaccionar a las publicaciones');
      return;
    }
    
    setError(null);
    
    try {
      const existingReaction = findUserReaction(postId, reactionType);
      
      if (existingReaction) {
        // Si ya existe, eliminamos la reacción
        await contextDeleteReaction(existingReaction.id);
      } else {
        // Si no existe, creamos una nueva reacción
        await contextCreateReaction({
          postId,
          reactionType
        });
      }
      
      // Actualizamos la lista de reacciones
      await fetchAllReactions();
    } catch (error) {
      console.error('Error al toggle reacción:', error);
      setError(error.message || 'Error al procesar la reacción');
    }
  };
  
  /**
   * Obtiene todas las reacciones de un usuario
   * @returns {Array} Lista de reacciones del usuario
   */
  const getUserReactions = () => {
    if (!user) return [];
    
    return reactions.filter(reaction => reaction.userId === user.id);
  };
  
  /**
   * Obtiene todas las reacciones para un post específico
   * @param {number} postId - ID del post
   * @returns {Array} Lista de reacciones para el post
   */
  const getReactionsByPostId = (postId) => {
    return reactions.filter(reaction => reaction.postId === postId);
  };
  
  // Retornamos todos los estados y funciones que necesita el componente
  return {
    // Estados
    reactions,
    reactionsByPost,
    loading: loadingReactions,
    error: error || reactionError,
    
    // Funciones para obtener datos
    fetchAllReactions,
    getReactionCounts,
    hasUserReacted,
    findUserReaction,
    getUserReactions,
    getReactionsByPostId,
    
    // Funciones de CRUD
    toggleReaction
  };
};