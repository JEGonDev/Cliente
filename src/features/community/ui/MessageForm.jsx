import React, { useState, useContext } from 'react';
import { Send, Loader } from 'lucide-react';
import { AuthContext } from '../../authentication/context/AuthContext';

/**
 * Componente de formulario para enviar mensajes en el foro
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Function} props.onSendMessage - Función para enviar el mensaje
 * @param {boolean} props.isLoading - Estado de carga del envío
 * @param {string} props.placeholder - Texto placeholder del textarea
 */
export const MessageForm = ({ 
  onSendMessage, 
  isLoading = false, 
  placeholder = "Escribe tu mensaje aquí..." 
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      {/* Header del formulario */}
      <div className="flex items-center space-x-3 mb-3">
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
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`w-full p-3 border rounded-md resize-none transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
              isFocused ? 'border-primary' : 'border-gray-300'
            }`}
            rows={3}
            maxLength={1000}
            disabled={isLoading}
          />
          
          {/* Contador de caracteres */}
          <div className="absolute bottom-2 right-2 text-xs text-gray-400">
            {message.length}/1000
          </div>
        </div>

        {/* Footer con botones */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Presiona <kbd className="px-1 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Ctrl</kbd> + <kbd className="px-1 py-0.5 text-xs bg-gray-100 border border-gray-300 rounded">Enter</kbd> para enviar
          </div>
          
          <button
            type="submit"
            disabled={!message.trim() || isLoading}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !message.trim() || isLoading
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
      </form>
    </div>
  );
};