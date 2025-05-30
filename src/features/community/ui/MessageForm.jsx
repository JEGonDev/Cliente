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
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-gray-600">
          <span className="font-medium">Inicia sesión</span> para participar en la conversación
        </p>
      </div>
    );
  }

  if (disabled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Header del formulario más compacto */}
      <div className="flex items-center space-x-3 px-4 py-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
          {user?.firstName?.charAt(0) || user?.username?.charAt(0) || 'U'}
        </div>
        <span className="text-sm font-medium text-gray-900">
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : user?.username || 'Usuario'
          }
        </span>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholder}
              className={`w-full p-3 border rounded-lg resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${isFocused ? 'border-primary' : 'border-gray-300'
                }`}
              rows={2}
              maxLength={1000}
              disabled={isLoading || disabled}
            />

            {/* Contador de caracteres */}
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {message.length}/1000
            </div>
          </div>

          {/* Footer con botones */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">
              <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Enter</kbd> para enviar
            </div>

            <button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg text-sm font-medium transition-colors ${!message.trim() || isLoading || disabled
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'
                }`}
            >
              {isLoading ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isLoading ? 'Enviando...' : 'Enviar'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};