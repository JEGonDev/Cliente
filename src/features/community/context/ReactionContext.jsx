import { createContext, useState, useContext } from 'react';
import { communityService } from '../services/communityService';

// Creamos el contexto para las reacciones
export const ReactionContext = createContext();

/**
 * Proveedor del contexto de reacciones que encapsula la lógica y el estado.
 */
export const ReactionProvider = ({ children }) => {
    // Estados para manejar las reacciones
    const [reactions, setReactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Función para obtener todas las reacciones desde la API.
     */
    const fetchReactions = async () => {
        setLoading(true); // Indicamos que la carga está en progreso.
        setError(null); // Reseteamos errores.
        try {
            const data = await communityService.getAllReactions(); // Llamamos al servicio de API.
            setReactions(data); // Guardamos las reacciones en el estado.
        } catch (e) {
            setError(e.message || 'Error al cargar las reacciones'); // Capturamos errores.
        } finally {
            setLoading(false); // Finalizamos la carga.
        }
    };

    return (
        <ReactionContext.Provider value={{ reactions, loading, error, fetchReactions }}>
            {children}
        </ReactionContext.Provider>
    );
};

/**
 * Hook personalizado para consumir el contexto de reacciones.
 */
export const useReactions = () => {
    const context = useContext(ReactionContext);
    if (!context) {
        throw new Error('useReactions debe ser usado dentro de un ReactionProvider');
    }
    return context;
};