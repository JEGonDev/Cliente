import { useAuthRoles } from '../hooks/useAuthRoles';

/**
 * Componente que renderiza su contenido solo si el usuario tiene los roles requeridos
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.roles - Lista de roles permitidos (al menos uno)
 * @param {boolean} props.requireAll - Si true, el usuario debe tener TODOS los roles especificados
 * @param {React.ReactNode} props.children - Contenido a mostrar si el usuario tiene permisos
 * @param {React.ReactNode} props.fallback - Contenido a mostrar si el usuario no tiene permisos
 */
export const RoleBasedAccess = ({ 
  roles = [],
  requireAll = false,
  children, 
  fallback = null
}) => {
  const { isAuthenticated, hasRole, isAdmin } = useAuthRoles();
  
  // Si no hay roles especificados, permitir acceso a todos los usuarios autenticados
  if (roles.length === 0) {
    return isAuthenticated ? children : fallback;
  }
  
  // El administrador siempre tiene acceso a todo
  if (isAdmin) {
    return children;
  }
  
  // Verificar si el usuario tiene al menos uno de los roles (OR lógico)
  if (!requireAll) {
    const hasAccess = roles.some(role => hasRole(role));
    return hasAccess ? children : fallback;
  }
  
  // Verificar si el usuario tiene todos los roles (AND lógico)
  const hasAllRoles = roles.every(role => hasRole(role));
  return hasAllRoles ? children : fallback;
};

/**
 * Componente que muestra su contenido solo para administradores
 */
export const AdminOnly = ({ children, fallback = null }) => {
  const { isAdmin } = useAuthRoles();
  return isAdmin ? children : fallback;
};

/**
 * Componente que muestra su contenido para administradores y moderadores
 */
export const ModeratorAccess = ({ children, fallback = null }) => {
  const { canModerateContent } = useAuthRoles();
  return canModerateContent() ? children : fallback;
};