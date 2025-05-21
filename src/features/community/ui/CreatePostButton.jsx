import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import PostFormModal from './PostFormModal';
import PropTypes from 'prop-types';

/**
 * Botón para crear nuevas publicaciones que abre un modal
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.variant - Variante del botón ('primary', 'outline', etc.)
 * @param {string} props.className - Clases CSS adicionales
 * @param {Function} props.onPostCreated - Callback cuando se crea un post
 * @param {string} props.label - Texto del botón (opcional)
 * @param {Object} props.context - Contexto de creación (grupo, hilo, general)
 */
export const CreatePostButton = ({ 
  variant = 'primary',
  className = '',
  onPostCreated,
  label = 'Crear publicación',
  context = { type: 'general' }
}) => {
  // Estado para controlar la visibilidad del modal
  const [showModal, setShowModal] = useState(false);
  
  // Mapa de variantes de botones
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-green-700',
    secondary: 'bg-secondary text-white hover:bg-green-600',
    outline: 'bg-white text-primary border border-primary hover:bg-gray-50',
    white: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
  };
  
  // Obtener la clase de estilo según la variante
  const buttonStyle = variantClasses[variant] || variantClasses.primary;
  
  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`
          flex items-center justify-center px-4 py-2 rounded-md
          transition-colors duration-200 text-sm font-medium
          ${buttonStyle} ${className}
        `}
        aria-label="Crear publicación"
      >
        <PlusIcon className="w-5 h-5 mr-1" />
        <span>{label}</span>
      </button>
      
      {/* Modal de creación de publicación */}
      {showModal && (
        <PostFormModal
          onClose={() => setShowModal(false)}
          onPostCreated={(post) => {
            if (onPostCreated) {
              onPostCreated(post);
            }
            setShowModal(false);
          }}
          context={context}
        />
      )}
    </>
  );
};

CreatePostButton.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'white']),
  className: PropTypes.string,
  onPostCreated: PropTypes.func,
  label: PropTypes.string,
  context: PropTypes.shape({
    type: PropTypes.oneOf(['general', 'group', 'thread']),
    id: PropTypes.number,
    name: PropTypes.string
  })
};