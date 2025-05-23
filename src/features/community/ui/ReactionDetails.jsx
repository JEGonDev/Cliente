import { useState, useEffect } from 'react';
import { useReactions } from '../hooks/useReactions';
import { X } from 'lucide-react';
import { Modal } from '../../../ui/components/Modal';

/**
 * Componente para mostrar detalles de todas las reacciones de un post
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 */
export const ReactionDetails = ({ postId, isOpen, onClose }) => {
  const { getReactionsByPostId, loading } = useReactions();
  const [reactions, setReactions] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  
  // Cargar reacciones cuando se abre el modal
  useEffect(() => {
    if (isOpen && postId) {
      const postReactions = getReactionsByPostId(postId);
      setReactions(postReactions);
    }
  }, [isOpen, postId, getReactionsByPostId]);
  
  // Agrupar reacciones por tipo
  const reactionGroups = reactions.reduce((groups, reaction) => {
    if (!groups[reaction.reactionType]) {
      groups[reaction.reactionType] = [];
    }
    groups[reaction.reactionType].push(reaction);
    return groups;
  }, {});
  
  // Mapeo de iconos
  const reactionIcons = {
    like: { icon: '👍', label: 'Me gusta' },
    love: { icon: '❤️', label: 'Me encanta' },
    laugh: { icon: '😂', label: 'Me divierte' },
    wow: { icon: '😮', label: 'Me asombra' },
    sad: { icon: '😢', label: 'Me entristece' },
    angry: { icon: '😠', label: 'Me enoja' }
  };
  
  // Filtrar reacciones según la pestaña activa
  const filteredReactions = activeTab === 'all' 
    ? reactions 
    : reactions.filter(r => r.reactionType === activeTab);
  
  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Reacciones" size="md">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Modal>
    );
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reacciones" size="md">
      {reactions.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Esta publicación aún no tiene reacciones.</p>
        </div>
      ) : (
        <div>
          {/* Pestañas para filtrar por tipo de reacción */}
          <div className="flex border-b border-gray-200 mb-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Todas ({reactions.length})
            </button>
            
            {Object.entries(reactionGroups).map(([type, typeReactions]) => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`flex items-center px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === type
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1">{reactionIcons[type]?.icon || '👍'}</span>
                {typeReactions.length}
              </button>
            ))}
          </div>
          
          {/* Lista de reacciones */}
          <div className="max-h-96 overflow-y-auto">
            {filteredReactions.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-500">No hay reacciones de este tipo.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredReactions.map((reaction) => (
                  <div key={reaction.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div className="flex items-center">
                      {/* Avatar del usuario */}
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center mr-3 text-sm">
                        {reaction.userName?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      
                      {/* Nombre del usuario */}
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {reaction.userName || `Usuario #${reaction.userId}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(reaction.reactionDate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    {/* Tipo de reacción */}
                    <div className="flex items-center">
                      <span className="text-lg mr-1">
                        {reactionIcons[reaction.reactionType]?.icon || '👍'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {reactionIcons[reaction.reactionType]?.label || reaction.reactionType}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
};

/**
 * Componente compacto para mostrar un resumen de reacciones con enlace a detalles
 * 
 * @param {Object} props - Propiedades del componente
 * @param {number} props.postId - ID de la publicación
 * @param {string} props.className - Clases CSS adicionales
 * @param {boolean} props.showDetails - Si mostrar enlace a detalles
 */
export const ReactionSummaryWithDetails = ({ postId, className = '', showDetails = true }) => {
  const { getReactionCounts } = useReactions();
  const [showModal, setShowModal] = useState(false);
  
  const counts = getReactionCounts(postId);
  const totalReactions = Object.values(counts).reduce((sum, count) => sum + count, 0);
  
  if (totalReactions === 0) return null;

  // Mostrar los tipos de reacción más populares
  const sortedReactions = Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3);

  const reactionIcons = {
    like: '👍',
    love: '❤️',
    laugh: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
  };

  return (
    <>
      <div className={`flex items-center text-sm text-gray-500 ${className}`}>
        {/* Iconos de los tipos más populares */}
        <div className="flex mr-2">
          {sortedReactions.map(([type, _]) => (
            <span key={type} className="text-base mr-1">
              {reactionIcons[type] || '👍'}
            </span>
          ))}
        </div>
        
        {/* Conteo total con enlace a detalles */}
        {showDetails ? (
          <button
            onClick={() => setShowModal(true)}
            className="hover:underline hover:text-gray-700"
          >
            {totalReactions === 1 
              ? '1 reacción' 
              : `${totalReactions} reacciones`
            }
          </button>
        ) : (
          <span>
            {totalReactions === 1 
              ? '1 reacción' 
              : `${totalReactions} reacciones`
            }
          </span>
        )}
      </div>
      
      {/* Modal de detalles */}
      {showModal && (
        <ReactionDetails
          postId={postId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};