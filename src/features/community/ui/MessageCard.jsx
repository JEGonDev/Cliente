import React, { useState, useContext, useEffect } from 'react';
import { MoreVertical, Calendar, Trash, Edit, User } from 'lucide-react';
import { AuthContext } from '../../authentication/context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

/**
 * Componente para mostrar un mensaje individual en el foro
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.message - Datos del mensaje
 * @param {Function} props.onDelete - Función para eliminar mensaje
 * @param {Function} props.onEdit - Función para editar mensaje (futuro)
 */
export const MessageCard = ({ message, onDelete, onEdit }) => {
  const { user, isAdmin, isModerator } = useContext(AuthContext);
  const [showOptions, setShowOptions] = useState(false);
  const [userName, setUserName] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Identificadores normalizados
  const messageId = message.id || message.message_id;
  const userId = message.userId || message.user_id;
  const content = message.content || '';
  const messageDate = message.messageDate || message.creation_date || message.created_at || new Date().toISOString();

  // Verificación de permisos para eliminar
  const canDeleteMessage = isAdmin || isModerator || (user && user.id === userId);

  // Formatear fecha relativa
  const getRelativeTime = () => {
    try {
      return formatDistanceToNow(new Date(messageDate), { 
        addSuffix: true, 
        locale: es 
      });
    } catch (error) {
      return 'Hace un momento';
    }
  };

  // Simular carga de nombre de usuario (en el futuro podrías cargar desde una API)
  useEffect(() => {
    // Por ahora usaremos un nombre genérico basado en el userId
    setUserName(message.author || message.userName || `Usuario #${userId}`);
    setIsLoadingUser(false);
  }, [userId, message.author, message.userName]);

  // Generar avatar con iniciales
  const getAvatarInitials = () => {
    if (userName) {
      return userName
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
    }
    return 'U';
  };

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      onDelete(messageId);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      {/* Header del mensaje */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
            {isLoadingUser ? '...' : getAvatarInitials()}
          </div>
          
          {/* Información del usuario y fecha */}
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">
              {isLoadingUser ? 'Cargando...' : userName}
            </span>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{getRelativeTime()}</span>
            </div>
          </div>
        </div>

        {/* Menú de opciones */}
        {canDeleteMessage && (
          <div className="relative">
            <button
              className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              onClick={() => setShowOptions(!showOptions)}
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                {/* Opción editar (comentada para futura implementación) */}
                {/* <button
                  onClick={() => {
                    setShowOptions(false);
                    onEdit && onEdit(message);
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Edit className="w-3 h-3 mr-2" />
                  Editar
                </button> */}

                <button
                  onClick={() => {
                    setShowOptions(false);
                    handleDelete();
                  }}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <Trash className="w-3 h-3 mr-2" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Contenido del mensaje */}
      <div className="pl-11">
        <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
};