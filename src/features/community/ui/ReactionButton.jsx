import { useContext } from 'react';
import { useReactions } from '../hooks/useReactions';
import { AuthContext } from '../../authentication/context/AuthContext';
import { Heart } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * Componente para mostrar y manejar la reacción de corazón
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.showCount - Si mostrar el contador (default: true)
 * @param {boolean} props.disabled - Si el botón está deshabilitado
 * @param {string} props.size - Tamaño del botón ('sm', 'md', 'lg')
 */
export const ReactionButton = ({
  postId,
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
  } = useReactions();

  // Verificar si el usuario ya reaccionó
  const isReacted = hasUserReacted(postId, 'heart');

  // Obtener el conteo de reacciones
  const counts = getReactionCounts(postId);
  const count = counts['heart'] || 0;

  // Manejar clic en la reacción
  const handleClick = async () => {
    if (!isAuthenticated) {
      alert('Necesitas iniciar sesión para reaccionar a las publicaciones');
      return;
    }

    if (disabled || loading) return;

    await toggleReaction(postId, 'heart');
  };

  // Mapear tamaños
  const sizeClasses = {
    sm: 'gap-1.5 text-sm',
    md: 'gap-2 text-base',
    lg: 'gap-2.5 text-lg'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Clases CSS dinámicas
  const buttonClasses = `
    inline-flex items-center px-3 py-1.5 rounded-full transition-all duration-200
    ${sizeClasses[size]}
    ${isReacted
      ? 'text-pink-600 bg-pink-50 hover:bg-pink-100'
      : 'text-gray-500 bg-gray-50 hover:bg-gray-100'
    }
    ${disabled || loading
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer hover:scale-105 active:scale-95'
    }
    ${className}
  `.trim();

  return (
    <button
      onClick={handleClick}
      disabled={disabled || loading || !isAuthenticated}
      className={buttonClasses}
      title={
        !isAuthenticated
          ? 'Inicia sesión para reaccionar'
          : `${isReacted ? 'Quitar' : 'Agregar'} me gusta`
      }
      aria-label={`${isReacted ? 'Quitar' : 'Agregar'} me gusta a la publicación`}
    >
      <Heart
        className={`${iconSizes[size]} ${isReacted ? 'fill-current' : ''} ${loading ? 'animate-pulse' : ''}`}
      />
      {/* Contador al lado del corazón */}
      {showCount && count > 0 && (
        <span className="font-medium">
          {count}
        </span>
      )}

      {/* Indicador de carga */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
          <div className="w-3 h-3 border-2 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </button>
  );
};

ReactionButton.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  className: PropTypes.string,
  showCount: PropTypes.bool,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

/**
 * Componente para mostrar el resumen de reacciones
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {string} props.className - Clases CSS adicionales
 */
export const ReactionSummary = ({ postId, className = '' }) => {
  const { getReactionCounts } = useReactions();

  const counts = getReactionCounts(postId);
  const totalReactions = counts['heart'] || 0;

  if (totalReactions === 0) return null;

  return (
    <div className={`flex items-center text-sm text-gray-500 ${className}`}>
      <Heart className="w-4 h-4 text-pink-500 fill-current mr-1" />
      <span>
        {totalReactions === 1
          ? '1 me gusta'
          : `${totalReactions} me gusta`
        }
      </span>
    </div>
  );
};

ReactionSummary.propTypes = {
  postId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  className: PropTypes.string
};