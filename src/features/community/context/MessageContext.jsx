import { createContext, useState, useCallback, useMemo, useEffect, useContext } from 'react';
import { communityService } from '../services/communityService';
import { AuthContext } from '../../authentication/context/AuthContext';

// Creamos el contexto para los mensajes
export const MessageContext = createContext();

/**
 * Proveedor del contexto de mensajes que encapsula la lógica y el estado.
 */
export const MessageProvider = ({ children }) => {
    const { isAuthenticated, loading: authLoading } = useContext(AuthContext);

    // Estados principales
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Estados para mensaje individual
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [messageLoading, setMessageLoading] = useState(false);

    // Estados para historial por contexto
    const [contextMessages, setContextMessages] = useState({});
    const [contextLoading, setContextLoading] = useState({});

    /**
     * Obtiene todos los mensajes
     */
    const fetchAllMessages = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await communityService.getAllMessages();
            setMessages(response?.data || []);
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Error al cargar mensajes');
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Obtiene un mensaje por ID
     */
    const fetchMessageById = useCallback(async (id) => {
        setMessageLoading(true);
        setError(null);

        try {
            const response = await communityService.getMessageById(id);
            setSelectedMessage(response?.data || null);
            return response?.data || null;
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || `Error al cargar mensaje ${id}`);
            setSelectedMessage(null);
            return null;
        } finally {
            setMessageLoading(false);
        }
    }, []);

    /**
     * Crea un nuevo mensaje
     */
    const createMessage = useCallback(async (messageData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await communityService.createMessage(messageData);

            if (response?.data) {
                // Actualizar lista local de mensajes
                setMessages(prev => [...prev, response.data]);
                return response.data;
            }

            return null;
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || 'Error al crear mensaje');
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Elimina un mensaje
     */
    const deleteMessage = useCallback(async (id) => {
        setLoading(true);
        setError(null);

        try {
            await communityService.deleteMessage(id);

            // Actualizar lista local
            setMessages(prev => prev.filter(msg => msg.id !== id));

            // Limpiar mensaje seleccionado si es el que se eliminó
            if (selectedMessage?.id === id) {
                setSelectedMessage(null);
            }

            return true;
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || `Error al eliminar mensaje ${id}`);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selectedMessage]);

    /**
     * Obtiene mensajes por contexto con caché
     */
    const fetchMessagesByContext = useCallback(async (contextType, contextId = null, limit = 50, offset = 0) => {
        const cacheKey = `${contextType}:${contextId || 'general'}`;

        setContextLoading(prev => ({ ...prev, [cacheKey]: true }));
        setError(null);

        try {
            const response = await communityService.getMessageHistory(contextType, contextId, limit, offset);
            const messagesData = response?.data || [];

            // Actualizar caché de contexto
            setContextMessages(prev => ({
                ...prev,
                [cacheKey]: messagesData
            }));

            return messagesData;
        } catch (err) {
            setError(err?.response?.data?.message || err?.message || `Error al cargar mensajes de ${contextType}`);
            return [];
        } finally {
            setContextLoading(prev => ({ ...prev, [cacheKey]: false }));
        }
    }, []);

    /**
     * Helpers para obtener mensajes específicos
     */
    const fetchPostMessages = useCallback((postId, limit, offset) =>
        fetchMessagesByContext('post', postId, limit, offset), [fetchMessagesByContext]);

    const fetchGroupMessages = useCallback((groupId, limit, offset) =>
        fetchMessagesByContext('group', groupId, limit, offset), [fetchMessagesByContext]);

    const fetchThreadMessages = useCallback((threadId, limit, offset) =>
        fetchMessagesByContext('thread', threadId, limit, offset), [fetchMessagesByContext]);

    const fetchForumMessages = useCallback((limit, offset) =>
        fetchMessagesByContext('forum', null, limit, offset), [fetchMessagesByContext]);

    /**
     * Funciones de utilidad
     */
    const getContextMessages = useCallback((contextType, contextId = null) => {
        const cacheKey = `${contextType}:${contextId || 'general'}`;
        return contextMessages[cacheKey] || [];
    }, [contextMessages]);

    const isContextLoading = useCallback((contextType, contextId = null) => {
        const cacheKey = `${contextType}:${contextId || 'general'}`;
        return contextLoading[cacheKey] || false;
    }, [contextLoading]);

    const clearError = useCallback(() => setError(null), []);

    // Cargar mensajes automáticamente al autenticarse
    useEffect(() => {
        if (isAuthenticated && !authLoading) {
            fetchAllMessages();
        } else if (!isAuthenticated && !authLoading) {
            setMessages([]);
            setContextMessages({});
        }
    }, [isAuthenticated, authLoading, fetchAllMessages]);

    // Valor del contexto memoizado
    const contextValue = useMemo(() => ({
        // Estados
        messages,
        loading,
        error,
        selectedMessage,
        messageLoading,
        contextMessages,
        contextLoading,

        // Funciones principales
        fetchAllMessages,
        fetchMessageById,
        createMessage,
        deleteMessage,

        // Funciones por contexto
        fetchMessagesByContext,
        fetchPostMessages,
        fetchGroupMessages,
        fetchThreadMessages,
        fetchForumMessages,

        // Helpers
        getContextMessages,
        isContextLoading,
        clearError,

        // Setters
        setSelectedMessage
    }), [
        messages, loading, error, selectedMessage, messageLoading, contextMessages, contextLoading,
        fetchAllMessages, fetchMessageById, createMessage, deleteMessage,
        fetchMessagesByContext, fetchPostMessages, fetchGroupMessages, fetchThreadMessages, fetchForumMessages,
        getContextMessages, isContextLoading, clearError
    ]);

    return (
        <MessageContext.Provider value={contextValue}>
            {children}
        </MessageContext.Provider>
    );
};

/**
 * Hook personalizado para consumir el contexto de mensajes.
 */
export const useMessageContext = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessageContext debe ser usado dentro de un MessageProvider');
    }
    return context;
};