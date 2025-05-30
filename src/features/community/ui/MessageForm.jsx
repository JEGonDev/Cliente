import React, { useState, useContext } from 'react';
import { Send, Loader, WifiOff } from 'lucide-react';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Componente de formulario para enviar mensajes en el foro
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSendMessage - Función para enviar el mensaje
 * @param {boolean} props.isLoading - Estado de carga del envío
 * @param {string} props.placeholder - Texto placeholder del textarea
 * @param {boolean} props.disabled - Si el formulario está deshabilitado
 */
export const MessageForm = ({
  onSendMessage,
  isLoading = false,
  placeholder = "Escribe tu mensaje aquí...",
  disabled = false
}) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    // Enviar el mensaje
    onSendMessage(message.trim());

    // Limpiar el formulario
    setMessage('');
  };

  const handleKeyPress = (e) => {
    // Enviar con Ctrl+Enter
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-gray-50 border-t border-gray-200 p-4">
        <p className="text-center text-gray-600">
          <span className="font-medium">Inicia sesión</span> para participar en la conversación
        </p>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="bg-red-50 border-t border-red-200 p-4">
        <div className="flex items-center justify-center gap-2 text-red-600">
          <WifiOff className="w-4 h-4" />
          <p className="text-sm">
            No se pueden enviar mensajes en este momento. Esperando conexión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-gray-200 bg-white px-4 py-3 pb-0"
    >
      <div className={`flex items-end gap-2 rounded-2xl border ${isFocused ? 'border-primary' : 'border-gray-200'} bg-white p-2 transition-colors`}>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          rows={1}
          className="flex-1 resize-none border-0 bg-transparent p-1 focus:ring-0 text-sm"
          style={{
            minHeight: '24px',
            maxHeight: '120px'
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !message.trim()}
          className={`flex-shrink-0 rounded-xl p-2 transition-colors ${message.trim()
              ? 'bg-primary text-white hover:bg-green-700'
              : 'bg-gray-100 text-gray-400'
            }`}
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Presiona Ctrl + Enter para enviar
      </p>
    </form>
  );
};