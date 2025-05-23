import { useState, useEffect, useContext, useCallback } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar la lógica completa de reacciones
 * 
 * Funcionalidades:
 * - Gestión de estado de reacciones
 * - CRUD de reacciones (crear, obtener, eliminar)
 * - Agrupación de reacciones por publicación y tipo
 * - Verificación de reacciones del usuario actual
 * - Contadores de reacciones por tipo
 * 
 * @returns {Object} Estados y funciones para manejar reacciones
 */
export const useReactions = () => {
  // ===================== ESTADOS =====================
  const [reactions, setReactions] = useState([]);
  const [reactionsByPost, setReactionsByPost] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // ===================== CONTEXTOS =====================
  const { user, isAuthenticated } = useContext(AuthContext);

  // ===================== EFECTOS =====================
  
  /**
   * Agrupa las reacciones por publicación y tipo cuando cambian las reacciones
   */
  useEffect(() => {
    const grouped = reactions.reduce((acc, reaction) => {
      const { postId, reactionType } = reaction;
      
      if (!acc[postId]) {
        acc[postId] = {};
      }
      
      if (!acc[postId][reactionType]) {
        acc[postId][reactionType] = [];
      }
      
      acc[postId][reactionType].push(reaction);
      return acc;
    }, {});
    
    setReactionsByPost(grouped);
  }, [reactions]);

  // ===================== FUNCIONES DE OBTENCIÓN DE DATOS =====================
  
  /**
   * Obtiene todas las reacciones del sistema
   */
  const fetchAllReactions = useCallback(async () => {
    if (!isAuthenticated) {
      setReactions([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await communityService.getAllReactions();
      setReactions(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error al obtener reacciones:', err);
      setError(err.message || 'Error al cargar las reacciones');
      setReactions([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Obtiene las reacciones de una publicación específica
   * @param {number} postId - ID de la publicación
   */
  const fetchReactionsByPost = useCallback(async (postId) => {
    if (!postId || !isAuthenticated) return [];

    setLoading(true);
    setError(null);

    try {
      const response = await communityService.getReactionsByPost(postId);
      return Array.isArray(response) ? response : [];
    } catch (err) {
      console.error(`Error al obtener reacciones de la publicación ${postId}:`, err);
      setError(err.message || `Error al cargar reacciones de la publicación`);
      return [];
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // ===================== FUNCIONES DE ANÁLISIS =====================
  
  /**
   * Obtiene el conteo de reacciones por tipo para una publicación
   * @param {number} postId - ID de la publicación
   * @returns {Object} Objeto con el conteo de cada tipo de reacción
   */
  const getReactionCounts = useCallback((postId) => {
    if (!reactionsByPost[postId]) return {};
    
    const counts = {};
    Object.keys(reactionsByPost[postId]).forEach(type => {
      counts[type] = reactionsByPost[postId][type].length;
    });
    
    return counts;
  }, [reactionsByPost]);

  /**
   * Verifica si el usuario actual ya reaccionó de cierta manera a una publicación
   * @param {number} postId - ID de la publicación
   * @param {string} reactionType - Tipo de reacción
   * @returns {boolean} true si ya reaccionó, false si no
   */
  const hasUserReacted = useCallback((postId, reactionType) => {
    if (!user || !reactionsByPost[postId] || !reactionsByPost[postId][reactionType]) {
      return false;
    }
    
    return reactionsByPost[postId][reactionType].some(r => r.userId === user.id);
  }, [user, reactionsByPost]);

  /**
   * Encuentra la reacción específica del usuario actual en una publicación
   * @param {number} postId - ID de la publicación
   * @param {string} reactionType - Tipo de reacción
   * @returns {Object|null} La reacción encontrada o null
   */
  const findUserReaction = useCallback((postId, reactionType) => {
    if (!user || !reactionsByPost[postId] || !reactionsByPost[postId][reactionType]) {
      return null;
    }
    
    return reactionsByPost[postId][reactionType].find(r => r.userId === user.id) || null;
  }, [user, reactionsByPost]);

  /**
   * Obtiene todas las reacciones de la publicación
   * @param {number} postId - ID de la publicación
   * @returns {Array} Lista de todas las reacciones de la publicación
   */
  const getReactionsByPostId = useCallback((postId) => {
    return reactions.filter(reaction => reaction.postId === postId);
  }, [reactions]);

  /**
   * Obtiene las reacciones del usuario actual
   * @returns {Array} Lista de reacciones del usuario
   */
  const getUserReactions = useCallback(() => {
    if (!user) return [];
    return reactions.filter(reaction => reaction.userId === user.id);
  }, [reactions, user]);

  // ===================== OPERACIONES CRUD =====================
  
  /**
   * Crea una nueva reacción
   * @param {Object} reactionData - Datos de la reacción {postId, reactionType}
   * @returns {Promise<Object|null>} La reacción creada o null si hay error
   */
  const createReaction = async (reactionData) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para reaccionar');
      return null;
    }

    const { postId, reactionType } = reactionData;

    if (!postId || !reactionType) {
      setError('Faltan datos requeridos para crear la reacción');
      return null;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      const response = await communityService.createReaction({
        postId: Number(postId),
        reactionType: reactionType.trim()
      });

      if (response && response.data) {
        setSuccessMessage('Reacción agregada correctamente');
        
        // Actualizar la lista local de reacciones
        await fetchAllReactions();
        
        return response.data;
      }

      return null;
    } catch (err) {
      console.error('Error al crear reacción:', err);
      setError(err.message || 'Error al crear la reacción');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Elimina una reacción
   * @param {number} reactionId - ID de la reacción a eliminar
   * @returns {Promise<boolean>} true si se eliminó correctamente
   */
  const deleteReaction = async (reactionId) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para eliminar reacciones');
      return false;
    }

    if (!reactionId) {
      setError('ID de reacción requerido');
      return false;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage('');

    try {
      await communityService.deleteReaction(reactionId);
      
      setSuccessMessage('Reacción eliminada correctamente');
      
      // Actualizar la lista local de reacciones
      await fetchAllReactions();
      
      return true;
    } catch (err) {
      console.error(`Error al eliminar reacción ${reactionId}:`, err);
      setError(err.message || 'Error al eliminar la reacción');
      return false;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Alterna una reacción (crea si no existe, elimina si existe)
   * @param {number} postId - ID de la publicación
   * @param {string} reactionType - Tipo de reacción
   * @returns {Promise<boolean>} true si la operación fue exitosa
   */
  const toggleReaction = async (postId, reactionType) => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para reaccionar');
      return false;
    }

    setError(null);

    try {
      const existingReaction = findUserReaction(postId, reactionType);
      
      if (existingReaction) {
        // Si ya existe, la eliminamos
        return await deleteReaction(existingReaction.id);
      } else {
        // Si no existe, la creamos
        const result = await createReaction({ postId, reactionType });
        return result !== null;
      }
    } catch (err) {
      console.error('Error al alternar reacción:', err);
      setError(err.message || 'Error al procesar la reacción');
      return false;
    }
  };

  // ===================== FUNCIONES DE UTILIDAD =====================
  
  /**
   * Limpia mensajes de error y éxito
   */
  const clearMessages = () => {
    setError(null);
    setSuccessMessage('');
  };

  /**
   * Verifica si el usuario puede eliminar una reacción específica
   * @param {Object} reaction - Objeto de la reacción
   * @returns {boolean} true si puede eliminar
   */
  const canDeleteReaction = useCallback((reaction) => {
    if (!user || !reaction) return false;
    
    // Solo el propietario de la reacción puede eliminarla
    // (los administradores podrían tener permisos adicionales si se implementa)
    return reaction.userId === user.id;
  }, [user]);

  // ===================== RETORNO DEL HOOK =====================
  
  return {
    // Estados
    reactions,
    reactionsByPost,
    loading,
    error,
    successMessage,
    
    // Funciones de obtención de datos
    fetchAllReactions,
    fetchReactionsByPost,
    
    // Funciones de análisis
    getReactionCounts,
    hasUserReacted,
    findUserReaction,
    getReactionsByPostId,
    getUserReactions,
    
    // Operaciones CRUD
    createReaction,
    deleteReaction,
    toggleReaction,
    
    // Utilidades
    clearMessages,
    canDeleteReaction
  };
};