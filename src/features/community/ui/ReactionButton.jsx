import { useContext } from 'react';
import { useReactions } from '../hooks/useReactions';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Componente para mostrar y manejar una reacción específica
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {string} props.reactionType - Tipo de reacción (like, love, laugh, etc.)
 * @param {string} props.icon - Emoji o icono a mostrar
 * @param {string} props.label - Etiqueta descriptiva (opcional)
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.showCount - Si mostrar el contador (default: true)
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.size - Tamaño del botón ('sm', 'md', 'lg')
 */
export const ReactionButton = ({
  postId,
  reactionType,
  icon,
  label,
  className = '',
  showCount = true,
  disabled = false,
  size = 'md'
}) => {
  const { isAuthenticated } = useContext(AuthContext);
  const {
    hasUserReacted,
    getReactionCounts,
    toggleReaction,
    loading,
    error
  } = useReactions();

  // Verificar si el usuario ya reaccionó de este tipo
  const isReacted = hasUserReacted(postId, reactionType);
  
  // Obtener el conteo de este tipo de reacción
  const counts = getReactionCounts(postId);
  const count = counts[reactionType] || 0;

  // Manejar clic en la reacción
  const handleClick = async () => {
    if (!isAuthenticated) {
      alert('Necesitas iniciar sesión para reaccionar a las publicaciones');
      return;
    }
    
    if (disabled || loading) return;
    
    await toggleReaction(postId, reactionType);
  };

  // Mapear tamaños
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  // Clases CSS dinámicas
  const buttonClasses = `
    inline-flex items-center gap-1 rounded-full font-medium transition-all duration-200
    ${sizeClasses[size]}
    ${isReacted 
      ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200 shadow-sm' 
      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
    ${disabled || loading 
      ? 'opacity-50 cursor-not-allowed' 
      : 'cursor-pointer hover:scale-105 active:scale-95'
    }
    ${className}
  `.trim();

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled || loading || !isAuthenticated}
        className={buttonClasses}
        title={
          !isAuthenticated 
            ? 'Inicia sesión para reaccionar'
            : label || `${isReacted ? 'Quitar' : 'Agregar'} reacción ${reactionType}`
        }
        aria-label={`${isReacted ? 'Quitar' : 'Agregar'} reacción ${reactionType} a la publicación`}
      >
        {/* Icono/Emoji */}
        <span className={`${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-base' : 'text-lg'} ${loading ? 'animate-pulse' : ''}`}>
          {icon}
        </span>
        
        {/* Contador (opcional) */}
        {showCount && count > 0 && (
          <span className="font-semibold">
            {count}
          </span>
        )}
        
        {/* Etiqueta (opcional) */}
        {label && (
          <span className="hidden sm:inline">
            {label}
          </span>
        )}
      </button>

      {/* Indicador de carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
          <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

/**
 * Componente para mostrar múltiples botones de reacción
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {Array} props.reactionTypes - Lista de tipos de reacción disponibles
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.disabled - Si los botones están deshabilitados
 * @param {string} props.size - Tamaño de los botones
 * @param {boolean} props.showLabels - Si mostrar etiquetas en desktop
 */
export const ReactionButtonGroup = ({
  postId,
  reactionTypes = [
    { type: 'like', icon: '👍', label: 'Me gusta' },
    { type: 'love', icon: '❤️', label: 'Me encanta' },
    { type: 'laugh', icon: '😂', label: 'Me divierte' },
    { type: 'wow', icon: '😮', label: 'Me asombra' },
    { type: 'sad', icon: '😢', label: 'Me entristece' },
    { type: 'angry', icon: '😠', label: 'Me enoja' }
  ],
  className = '',
  disabled = false,
  size = 'md',
  showLabels = false
}) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {reactionTypes.map(({ type, icon, label }) => (
        <ReactionButton
          key={type}
          postId={postId}
          reactionType={type}
          icon={icon}
          label={showLabels ? label : undefined}
          disabled={disabled}
          size={size}
        />
      ))}
    </div>
  );
};

/**
 * Componente simplificado para mostrar solo el conteo total de reacciones
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {string} props.className - Clases CSS adicionales
 */
export const ReactionSummary = ({ postId, className = '' }) => {
  const { getReactionCounts } = useReactions();
  
  const counts = getReactionCounts(postId);
  const totalReactions = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  if (totalReactions === 0) return null;

  // Mostrar los tipos de reacción más populares
  const sortedReactions = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3); // Solo los 3 más populares

  const reactionIcons = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
  };

  return (
    <div className={`flex items-center text-sm text-gray-500 ${className}`}>
      {/* Iconos de los tipos más populares */}
      <div className="flex mr-2">
        {sortedReactions.map(([type, _]) => (
          <span key={type} className="text-base mr-1">
            {reactionIcons[type] || '👍'}
          </span>
        ))}
      </div>
      
      {/* Conteo total */}
      <span>
        {totalReactions === 1 
          ? '1 reacción' 
          : `${totalReactions} reacciones`
        }
      </span>
    </div>
  );
};

/**
 * Componente simple para botón de "Me gusta" (más común)
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {string} props.className - Clases CSS adicionales
 * @param {string} props.size - Tamaño del botón
 */
export const LikeButton = ({ postId, className = '', size = 'md' }) => {
  return (
    <ReactionButton
      postId={postId}
      reactionType="like"
      icon="👍"
      label="Me gusta"
      className={className}
      size={size}
    />
  );
};