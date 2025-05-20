import { useContext } from 'react';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Hook personalizado para manejar permisos de usuario en base a roles y lógica.
 * Este hook encapsula:
 * - Verificaciones de permisos (editar, eliminar, crear) en distintas entidades.
 * - Integración con el contexto de autenticación (AuthContext).
 */
export const usePermissions = () => {
  const { isAdmin, isModerator, user } = useContext(AuthContext);

  /**
   * Verifica si el usuario puede editar un post.
   * @param {Object} post - El post que se está verificando.
   * @returns {boolean} Verdadero si el usuario tiene permiso para editar.
   */
  const canEditPost = (post) => {
    return isAdmin || (post?.userId === user?.id);
  };

  /**
   * Verifica si el usuario puede eliminar un post.
   * @param {Object} post - El post que se está verificando.
   * @returns {boolean} Verdadero si el usuario tiene permiso para eliminar.
   */
  const canDeletePost = (post) => {
    return isAdmin || (post?.userId === user?.id);
  };

  /**
   * Verifica si el usuario puede crear un grupo.
   * @returns {boolean} Verdadero si el usuario tiene permiso para crear grupos.
   */
  const canCreateGroup = () => {
    return isAdmin || isModerator;
  };

  /**
   * Verifica si el usuario puede editar un grupo.
   * @param {Object} group - El grupo que se está verificando.
   * @returns {boolean} Verdadero si el usuario tiene permiso para editar.
   */
  const canEditGroup = (group) => {
    return isAdmin || (group?.ownerId === user?.id);
  };

  /**
   * Verifica si el usuario puede eliminar un grupo.
   * @param {Object} group - El grupo que se está verificando.
   * @returns {boolean} Verdadero si el usuario tiene permiso para eliminar.
   */
  const canDeleteGroup = (group) => {
    return isAdmin || (group?.ownerId === user?.id);
  };

  return {
    canEditPost,
    canDeletePost,
    canCreateGroup,
    canEditGroup,
    canDeleteGroup,
  };
};