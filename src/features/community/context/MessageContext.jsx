import { createContext, useState, useContext } from 'react';
import { communityService } from '../services/communityService';

// Creamos el contexto para los mensajes
export const MessageContext = createContext();

/**
 * Proveedor del contexto de mensajes que encapsula la lógica y el estado.
 */
export const MessageProvider = ({ children }) => {
    // Estados para manejar los mensajes
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Función para obtener todos los mensajes desde la API.
     */
    const fetchMessages = async () => {
        setLoading(true); // Indicamos que la carga está en progreso.
        setError(null); // Reseteamos errores.
        try {
            const data = await communityService.getAllMessages(); // Llamamos al servicio de API.
            setMessages(data); // Guardamos los mensajes en el estado.
        } catch (e) {
            setError(e.message || 'Error al cargar los mensajes'); // Capturamos errores.
        } finally {
            setLoading(false); // Finalizamos la carga.
        }
    };

    return (
        <MessageContext.Provider value={{ messages, loading, error, fetchMessages }}>
            {children}
        </MessageContext.Provider>
    );
};

/**
 * Hook personalizado para consumir el contexto de mensajes.
 */
export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessages debe ser usado dentro de un MessageProvider');
    }
    return context;
};