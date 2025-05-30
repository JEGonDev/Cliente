import React, { useEffect, useRef } from 'react';
import { MessageCard } from './MessageCard';
import { MessageCircle } from 'lucide-react';

/**
 * Componente para mostrar la lista de mensajes del foro
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array} props.messages - Lista de mensajes
 * @param {boolean} props.isLoading - Estado de carga
 * @param {string} props.error - Mensaje de error si existe
 * @param {Function} props.onDeleteMessage - Función para eliminar mensaje
 * @param {Function} props.onRefresh - Función para refrescar mensajes
 * @param {boolean} props.autoScroll - Si debe hacer scroll automático al final
 */
export const MessageList = ({ 
  messages = [], 
  isLoading = false,
  error = null,
  onDeleteMessage,
  onRefresh,
  autoScroll = true
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  // Auto scroll al final cuando llegan nuevos mensajes
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, autoScroll]);

  // Manejar eliminación de mensaje
  const handleDeleteMessage = async (messageId) => {
    try {
      await onDeleteMessage(messageId);
      // Opcionalmente refrescar la lista
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error al eliminar mensaje:', error);
    }
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto mb-3"></div>
          <p className="text-gray-600">Cargando mensajes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600 font-medium">Error al cargar mensajes</p>
        <p className="text-red-500 text-sm mt-1">{error}</p>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="mt-3 text-primary hover:text-green-700 text-sm font-medium"
          >
            Intentar nuevamente
          </button>
        )}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-8">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay mensajes en el foro
          </h3>
          <p className="text-gray-500 mb-4">
            ¡Sé el primero en iniciar la conversación! Comparte tus ideas, haz preguntas o simplemente saluda a la comunidad.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3" ref={containerRef}>
      {/* Header con información */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'}
          </span>
        </div>
        
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="text-xs text-gray-500 hover:text-primary disabled:opacity-50"
          >
            {isLoading ? 'Actualizando...' : 'Actualizar'}
          </button>
        )}
      </div>

      {/* Lista de mensajes */}
      <div className="space-y-3">
        {messages.map((message) => (
          <MessageCard
            key={message.id || message.message_id}
            message={message}
            onDelete={handleDeleteMessage}
          />
        ))}
      </div>

      {/* Indicador de carga para nuevos mensajes */}
      {isLoading && messages.length > 0 && (
        <div className="text-center py-3">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-primary"></div>
            <span>Cargando mensajes...</span>
          </div>
        </div>
      )}

      {/* Referencia para auto-scroll */}
      <div ref={messagesEndRef} />
    </div>
  );
};