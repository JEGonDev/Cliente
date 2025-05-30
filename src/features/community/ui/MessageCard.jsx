import { useState, useContext, useEffect } from 'react';
import {Trash} from 'lucide-react';
import { AuthContext } from '../../authentication/context/AuthContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { profileService } from '../../profile/services/profileService';

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
  const messageId = message.id;
  const userId = message.userId;
  const content = message.content || '';
  const messageDate = message.creationDate || new Date().toISOString();

  // Verificación de permisos para eliminar
  const canDeleteMessage = isAdmin || isModerator || (user && user.id === userId);

  // Verificar si el mensaje es del usuario actual
  const isCurrentUser = user && user.id === userId;

  // Formatear hora exacta
  const getFormattedTime = () => {
    try {
      return format(new Date(messageDate), 'h:mm a', { locale: es });
    } catch {
      return '--:--';
    }
  };

  // Cargar información del usuario
  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoadingUser(true);
      try {
        if (userId) {
          const userData = await profileService.getUserById(userId);
          // Intentar obtener el nombre completo o username
          const displayName = userData.username;
          setUserName(displayName || `Usuario #${userId}`);
        }
      } catch (error) {
        console.error('Error al cargar información del usuario:', error);
        setUserName(`Usuario #${userId}`);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleDelete = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este mensaje?')) {
      onDelete(messageId);
    }
  };

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      {/* Avatar y mensaje para otros usuarios */}
      {!isCurrentUser && (
        <div className="flex items-start space-x-2 max-w-[80%]">
          <div className="flex-shrink-0">
          </div>
          <div className="flex flex-col">
            <div className="bg-secondary border border-blue-100 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm">
              <p className="text-xs font-medium text-blue-700 mb-1">
                {isLoadingUser ? 'Cargando...' : userName}
              </p>
              <p className="text-sm text-gray-800">
                {content}
              </p>
            </div>
            <span className="text-xs text-gray-500 mt-1 ml-2">{getFormattedTime()}</span>
          </div>
        </div>
      )}

      {/* Mensaje para el usuario actual */}
      {isCurrentUser && (
        <div className="flex items-start space-x-2 max-w-[80%]">
          <div className="flex flex-col items-end">
            <div className="bg-primary text-white rounded-2xl rounded-tr-none px-4 py-2">
              <p className="text-sm">
                {content}
              </p>
            </div>
            <div className="flex items-center space-x-2 mt-1 mr-2">
              <span className="text-xs text-gray-500">{getFormattedTime()}</span>
              {canDeleteMessage && (
                <button
                  onClick={handleDelete}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                >
                  <Trash className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};